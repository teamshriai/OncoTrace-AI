# Running OncoTrace locally

Two processes: a Python analysis backend (`server/`) and the React frontend
(`client/`). The frontend calls the backend, so start the backend first.

---

## 0. One-time prerequisites

**Node 18, 20, or 22.** Check with `node --version`. The project is pinned to a
toolchain that works on all three (see `client/.nvmrc`).

**System tools** for the genomics pipeline:

```bash
sudo apt-get install -y bcftools tabix samtools python3-venv default-jre
```

`bcftools`/`tabix`/`samtools` are required. `default-jre` is only needed if you
later provision SnpEff.

---

## 1. Backend setup (once)

**Skip this if `server/.venv` already exists and works** — check with:

```bash
cd ~/OncoTrace-AI/server && .venv/bin/python3 -c "import fastapi, cyvcf2; print('venv OK')"
```

Otherwise, on Debian/Ubuntu the stock `python3 -m venv` fails because `ensurepip`
isn't packaged. Either install the missing package:

```bash
sudo apt-get install -y python3-venv        # or python3.12-venv to match your Python
cd ~/OncoTrace-AI/server
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
```

…or, if you'd rather not use sudo, bootstrap pip by hand — no apt package needed:

```bash
cd ~/OncoTrace-AI/server
python3 -m venv --without-pip .venv
curl -sS https://bootstrap.pypa.io/get-pip.py | .venv/bin/python3
.venv/bin/pip install -r requirements.txt
```

> Don't chain these with `&&` after a bare `python3 -m venv .venv`: if that first
> command fails, the shell still runs anything on later lines, which is how a
> failed venv gets followed by a long unnecessary download.

### Reference databases

Each annotation stage needs its own dataset. **Stages whose data is missing are
reported as skipped, never as "found nothing."** Parsing, QC/artifact detection,
and every derived metric work with zero reference data.

```bash
cd ~/OncoTrace-AI/server

./scripts/download_references.sh civic              # ~15 MB   — actionability
./scripts/download_references.sh build-detection    # ~370 MB  — both ClinVar builds
./scripts/download_references.sh gene-spans-grch38  # ~10 MB   — panel footprint estimate

# Optional, large:
./scripts/download_references.sh snpeff-grch38      # ~1.5 GB  — consequence/HGVS
./scripts/download_references.sh reference-grch38   # ~3 GB    — indel left-alignment
```

`build-detection` downloads **both** ClinVar builds, which is what lets the
pipeline determine a file's reference build empirically instead of asking you.

Every step **skips anything already on disk** and prints what it found, so
re-running is cheap and safe. Interrupted downloads resume rather than restarting
(`curl -C -`), and files are written to `.part` and renamed only on success — so
a Ctrl+C can never leave a half-downloaded database that looks usable. To force a
refresh of a release, use `FORCE=1 ./scripts/download_references.sh clinvar-grch38`.

Check what's live:

```bash
curl -s localhost:8000/api/v1/health | python3 -m json.tool
```

---

## 2. Run it

**Terminal 1 — backend:**

```bash
cd ~/OncoTrace-AI/server
ONCOTRACE_PANEL_NAME="Targeted Oncology Panel (GeneMind SURFSeq5000)" \
  .venv/bin/uvicorn app.main:app --reload --port 8000
```

**Terminal 2 — frontend:**

```bash
cd ~/OncoTrace-AI/client
npm install          # first time only
npm run dev
```

Open **http://localhost:5173/demo**, upload a VCF, pick the reference build, and
click Analyze.

> `client/.env` has `VITE_LB_USE_MOCK_API=false`, which is what makes the app
> analyze your actual file. Setting it `true` enables demo mode, which **ignores
> the uploaded file and always returns one fixed sample** — if results look
> identical across different files, check this first.

---

## 3. Verify it works without the browser

```bash
cd ~/OncoTrace-AI/server

# Negative control: a real panel VCF with no true somatic findings.
curl -s -F vcf_file=@tests/fixtures/S5.panel.annotated.vcf \
        -F reference_build_hint=GRCh38 \
        localhost:8000/api/v1/vcf/analyze \
  | python3 -c "import json,sys; d=json.load(sys.stdin); print(json.dumps(d['tier_summary']['counts'], indent=1))"
# Expect: tier_1_actionable_somatic = 0

# Positive control: real GRCh38 hotspots at tumor-only allele fractions.
curl -s -F vcf_file=@tests/fixtures/positive_control_GRCh38.vcf \
        localhost:8000/api/v1/vcf/analyze \
  | python3 -c "import json,sys; d=json.load(sys.stdin); print(json.dumps(d['tier_summary']['counts'], indent=1))"
# Expect: tier_1_actionable_somatic = 3  (KRAS, PIK3CA, BRAF V600E)
```

Prove different files give different answers:

```bash
for f in tests/fixtures/S5.panel.annotated.vcf tests/fixtures/positive_control_GRCh38.vcf; do
  echo -n "$(basename $f): "
  curl -s -F vcf_file=@$f -F reference_build_hint=GRCh38 localhost:8000/api/v1/vcf/analyze \
    | python3 -c "import json,sys; d=json.load(sys.stdin); c=d['tier_summary']['counts']; print(f\"{d['qc_summary']['total_records']} variants, Tier1={c['tier_1_actionable_somatic']}\")"
done
```

### Optional inputs

```bash
# Supply the panel BED for an exact footprint (otherwise density is null).
curl -F vcf_file=@sample.vcf -F panel_bed=@panel.bed -F reference_build_hint=GRCh38 \
     localhost:8000/api/v1/vcf/analyze

# Choose a sample column in a multi-sample VCF.
curl -F vcf_file=@paired.vcf -F sample_name=TUMOR1 -F reference_build_hint=GRCh38 \
     localhost:8000/api/v1/vcf/analyze

# Let the pipeline determine the build itself (needs both ClinVar builds).
curl -F vcf_file=@sample.vcf localhost:8000/api/v1/vcf/analyze \
  | python3 -c "import json,sys; m=json.load(sys.stdin)['meta']; print(m['reference_build'], 'via', m['reference_build_source']); print(m['reference_build_evidence'])"
```

---

## 4. Tests

```bash
cd ~/OncoTrace-AI/server && .venv/bin/python3 -m pytest tests/ -q
cd ~/OncoTrace-AI/client && npm run lint && npm run build
```

Backend tests that need a reference database are **skipped with a reason** when
it isn't provisioned, so an unprovisioned machine can't look like a passing one.

---

## 5. Troubleshooting

**Every file returns identical results** — `VITE_LB_USE_MOCK_API` is `true` in
`client/.env`. Set it to `false` and restart `npm run dev`.

**`SyntaxError: ... does not provide an export named 'styleText'`** — Node is
older than the toolchain expects. Use Node 18/20/22 and reinstall:

```bash
cd ~/OncoTrace-AI/client && rm -rf node_modules package-lock.json && npm install
```

**`Can't reach the analysis service`** — the backend isn't running on port 8000,
or `VITE_LB_API_BASE_URL` in `client/.env` points elsewhere.

**HTTP 422 `reference_build_unresolved`** — the file doesn't state its build and
the pipeline couldn't determine one confidently. Pass `reference_build_hint`
explicitly. It refuses rather than guessing because a wrong build silently
invalidates every coordinate-based annotation.

**A stage says `skipped_missing_input`** — that reference database isn't
provisioned. Run the matching `download_references.sh` command from step 1.
