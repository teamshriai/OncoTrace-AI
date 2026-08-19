# Deploying to oncotraceai.org

This adds a real backend (`server/`) to a site that was previously pure
static frontend. Read the **one-time setup** section fully before your first
deploy after this change lands — after that, every future deploy is just the
**routine update** section at the bottom.

Replace `anand` / `/home/anand/OncoTrace-AI` below with the actual deploy
user and clone path on the server if they differ.

---

## One-time setup (do this once, the first time these changes are deployed)

### 1. Pull the new code

```bash
ssh -i /home/shri-ai/shri-deploy/shri-key.pem anand@52.89.98.162
cd ~/OncoTrace-AI
git pull origin main
```

### 2. System packages the backend needs

```bash
sudo apt-get update
sudo apt-get install -y bcftools tabix samtools python3-venv default-jre
```

(`default-jre` is required now — SnpEff is part of the production pipeline.)

### 3. Python environment

```bash
cd ~/OncoTrace-AI/server
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
```

If `python3 -m venv` fails with an `ensurepip` error (common on minimal
Ubuntu images — ours hit this too):

```bash
sudo apt-get install -y python3-venv   # or python3.12-venv, matching `python3 --version`
# -- or, without sudo --
python3 -m venv --without-pip .venv
curl -sS https://bootstrap.pypa.io/get-pip.py | .venv/bin/python3
.venv/bin/pip install -r requirements.txt
```

Verify: `.venv/bin/python3 -c "import fastapi, cyvcf2; print('ok')"`

### 4. Reference databases (one-time, multi-GB, can take a long time)

These are gitignored on purpose — they're multi-GB and don't belong in git.
Run from `~/OncoTrace-AI/server`:

```bash
./scripts/download_references.sh civic              # ~15 MB
./scripts/download_references.sh build-detection    # ~370 MB (both ClinVar builds)
./scripts/download_references.sh gene-spans-grch38  # ~10 MB
./scripts/download_references.sh gene-spans-grch37  # ~10 MB
./scripts/download_references.sh snpeff-grch38       # ~1.5 GB — gene/consequence annotation
./scripts/download_references.sh snpeff-grch37       # ~1.5 GB — same, for GRCh37 uploads
```

We need **both** builds live, not just GRCh38 — samples arrive in either, and
the backend refuses to guess: an unresolved build returns a `422` rather than
silently annotating against the wrong genome.

**Expect this to be slow** — on a slow link, one ClinVar build alone took over
15 minutes and one SnpEff database took over 30 in testing, so budget real
time for four large downloads, not one. Let each command finish before
running the next; every step resumes cleanly if interrupted and skips
anything already on disk, so it's safe to re-run if a connection drops.

`reference-grch38` / `reference-grch37` (~3 GB each, improves indel matching)
are optional — skip them for the initial launch, add them later if needed.

Confirm what's live once done:

```bash
.venv/bin/uvicorn app.main:app --port 8000 &
curl -s localhost:8000/api/v1/health | python3 -m json.tool
kill %1
```

You want `clinvar_GRCh37`, `clinvar_GRCh38`, `civic_cache`, `snpeff_GRCh37`,
and `snpeff_GRCh38` **all** `true` before going live — any one of the
`snpeff_*` pair missing means gene names show as "(unannotated)" for uploads
of that build.

### 5. Install the backend as a systemd service

So it survives reboots and doesn't depend on a terminal staying open.

```bash
sudo cp ~/OncoTrace-AI/server/deploy/oncotrace-backend.service /etc/systemd/system/
sudo nano /etc/systemd/system/oncotrace-backend.service   # fix User/WorkingDirectory/ExecStart paths if needed
sudo systemctl daemon-reload
sudo systemctl enable --now oncotrace-backend
sudo systemctl status oncotrace-backend                   # should be "active (running)"
curl -s localhost:8000/api/v1/health                       # should respond from the service now, not a manual process
```

It binds to `127.0.0.1:8000` only — never expose that port directly to the
internet; nginx is the only thing that should reach it.

### 6. nginx: reverse-proxy `/api/` to the backend

```bash
sudo nginx -T | grep -B5 "server_name oncotraceai.org"    # find the right config file
sudo nano <that file>
```

Paste the contents of `~/OncoTrace-AI/server/deploy/nginx-api-location.conf`
**inside** the existing `server { ... }` block for oncotraceai.org (the one
that already has `location / { root /var/www/oncotraceai; ... }`) — do not
create a second server block. Then:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

This makes the API same-origin with the site (`oncotraceai.org/api/...`), so
no CORS configuration is needed on the backend side.

### 7. Build and deploy the frontend (same as before, one detail changed)

```bash
cd ~/OncoTrace-AI/client
npm install
npm run build
sudo rm -rf /var/www/oncotraceai/*
sudo cp -r dist/* /var/www/oncotraceai/
sudo chown -R www-data:www-data /var/www/oncotraceai
sudo chmod -R 755 /var/www/oncotraceai
sudo systemctl reload nginx
```

Nothing about these commands changed — the fix is a new
`client/.env.production` file already committed to the repo, which `npm run
build` picks up automatically (Vite's built-in convention) and makes the
frontend call the relative `/api/...` path instead of `http://localhost:8000`.
No manual env step needed.

### 8. Verify end-to-end

```bash
curl -s https://oncotraceai.org/api/v1/health | python3 -m json.tool
```

Then in a browser: go to `https://oncotraceai.org/demo` (or `/Book-LB`),
upload a real `.vcf` file, and confirm it analyzes (not the demo-mode fixed
sample) and a "Research Prototype" badge shows in the header.

---

## Routine update (every deploy after the one-time setup above)

```bash
ssh -i /home/shri-ai/shri-deploy/shri-key.pem anand@52.89.98.162
cd ~/OncoTrace-AI
git pull origin main

# Frontend (only if client/ changed)
cd client
npm install   # only if dependencies changed
npm run build
sudo rm -rf /var/www/oncotraceai/*
sudo cp -r dist/* /var/www/oncotraceai/
sudo chown -R www-data:www-data /var/www/oncotraceai
sudo chmod -R 755 /var/www/oncotraceai

# Backend (only if server/ changed)
cd ../server
.venv/bin/pip install -r requirements.txt   # only if requirements.txt changed
sudo systemctl restart oncotrace-backend

sudo systemctl reload nginx
```

## Known limitation, by design for now

Each `/api/v1/vcf/analyze` request runs in a background thread so it doesn't
block other requests, but the backend still processes uploads with limited
concurrency (`--workers 2` in the systemd unit). This is a research-pilot
deployment, not built for high concurrent load — if it needs to handle more
simultaneous uploads later, raise `--workers` in
`server/deploy/oncotrace-backend.service` (bounded by CPU count on the host)
before assuming something is broken.
