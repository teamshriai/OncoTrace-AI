import base64

from fastapi.testclient import TestClient

from app.core import config
from app.main import app

from .conftest import TEST_PASSWORD, TEST_USERNAME, basic_auth_header

client = TestClient(app)

ANALYZE = "/api/v1/vcf/analyze"
VERIFY = "/api/v1/auth/verify"

# Enough to reach the auth dependency; the request never gets past it.
A_FILE = {"vcf_file": ("x.vcf", b"##fileformat=VCFv4.2\n", "text/plain")}


def test_verify_accepts_correct_credentials():
    r = client.post(VERIFY, headers=basic_auth_header())
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}


def test_verify_rejects_wrong_password():
    r = client.post(VERIFY, headers=basic_auth_header(password="nope"))
    assert r.status_code == 401


def test_verify_rejects_unknown_username():
    r = client.post(VERIFY, headers=basic_auth_header(username="someone-else"))
    assert r.status_code == 401


def test_wrong_username_and_wrong_password_are_indistinguishable():
    """Nothing in the response may reveal which half of the credential was wrong."""
    bad_user = client.post(VERIFY, headers=basic_auth_header(username="someone-else"))
    bad_pass = client.post(VERIFY, headers=basic_auth_header(password="nope"))
    assert bad_user.status_code == bad_pass.status_code
    assert bad_user.json() == bad_pass.json()


def test_analyze_requires_credentials():
    r = client.post(ANALYZE, files=A_FILE)
    assert r.status_code == 401


def test_analyze_rejects_wrong_credentials():
    r = client.post(ANALYZE, files=A_FILE, headers=basic_auth_header(password="nope"))
    assert r.status_code == 401


def test_health_stays_public():
    """nginx and uptime monitoring poll this unauthenticated."""
    r = client.get("/api/v1/health")
    assert r.status_code == 200


def test_401_never_sends_www_authenticate():
    """A WWW-Authenticate header makes the browser hijack the response with its
    own native credential dialog, which would bypass the app's login modal."""
    responses = [
        client.post(VERIFY),
        client.post(VERIFY, headers=basic_auth_header(password="nope")),
        client.post(ANALYZE, files=A_FILE),
        client.post(VERIFY, headers={"Authorization": "Basic !!!not-base64!!!"}),
        client.post(VERIFY, headers={"Authorization": "Bearer sometoken"}),
        client.post(VERIFY, headers={"Authorization": "Basic"}),
        client.post(
            VERIFY,
            headers={
                "Authorization": "Basic " + base64.b64encode(b"no-colon-here").decode()
            },
        ),
    ]
    for r in responses:
        assert r.status_code == 401, r.text
        assert "www-authenticate" not in {k.lower() for k in r.headers}


def test_malformed_authorization_headers_are_rejected():
    for header in (
        {"Authorization": "Basic !!!not-base64!!!"},
        {"Authorization": "Bearer sometoken"},
        {"Authorization": "Basic"},
        {"Authorization": ""},
        {"Authorization": "Basic " + base64.b64encode(b"no-colon-here").decode()},
    ):
        r = client.post(VERIFY, headers=header)
        assert r.status_code == 401, header


def test_password_containing_colon_is_handled():
    """Only the first colon separates user from password, so a password may
    legitimately contain colons."""
    token = base64.b64encode(f"{TEST_USERNAME}:a:b:c".encode()).decode()
    r = client.post(VERIFY, headers={"Authorization": f"Basic {token}"})
    assert r.status_code == 401  # wrong password, but parsed rather than crashing


def test_unconfigured_server_fails_closed(monkeypatch):
    """With no credential configured the analysis endpoint must refuse outright
    rather than fall back to serving everyone."""
    monkeypatch.setattr(config, "DEMO_AUTH_USERNAME", None)
    monkeypatch.setattr(config, "DEMO_AUTH_PASSWORD", None)

    r = client.post(ANALYZE, files=A_FILE, headers=basic_auth_header())
    assert r.status_code == 503
    assert r.json()["detail"]["error_kind"] == "auth_not_configured"

    # Health must stay up so an operator can still see the server is running.
    assert client.get("/api/v1/health").status_code == 200
