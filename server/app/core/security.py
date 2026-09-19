"""Shared-credential gate for the invite-only demo.

The Authorization header is parsed by hand rather than with FastAPI's
``HTTPBasic``: that helper attaches ``WWW-Authenticate: Basic`` to its 401s even
with ``auto_error=False`` (a malformed header still raises through its internal
error path), and that header makes the browser hijack the response with its own
native credential dialog -- which would defeat the app's designed login modal.
Nothing here ever sets that header.
"""

import base64
import binascii
import logging
import secrets

from fastapi import HTTPException, Request

from . import config

logger = logging.getLogger("oncotrace.auth")


def _unauthorized(request: Request) -> HTTPException:
    # One identical response for every failure mode -- absent header, malformed
    # header, wrong username, wrong password -- so nothing distinguishes "no
    # such user" from "wrong password" to someone probing the endpoint.
    #
    # Logged at WARNING with the client IP so repeated failures are visible in
    # journald and can be picked up by fail2ban. A single shared credential is
    # inherently brute-forceable, so silent failures are not acceptable. The
    # attempted username is deliberately NOT logged: it is frequently a
    # mistyped password, and those must never reach the logs.
    client = request.client.host if request.client else "unknown"
    logger.warning("demo auth failure from %s %s", client, request.url.path)

    return HTTPException(
        status_code=401,
        detail={
            "error_kind": "unauthorized",
            "message": "Invalid demo credentials.",
        },
    )


def require_demo_auth(request: Request) -> str:
    """Validates HTTP Basic credentials against the configured demo login.

    Returns the authenticated username so routes can depend on it; raises 401
    on any failure and 503 when the server has no credential configured.
    """
    if not config.demo_auth_configured():
        logger.error(
            "demo auth is not configured -- set ONCOTRACE_DEMO_USERNAME and "
            "ONCOTRACE_DEMO_PASSWORD (see server/.env.example)"
        )
        raise HTTPException(
            status_code=503,
            detail={
                "error_kind": "auth_not_configured",
                "message": "Demo authentication is not configured on this server.",
            },
        )

    scheme, _, param = request.headers.get("authorization", "").partition(" ")
    if scheme.lower() != "basic" or not param:
        raise _unauthorized(request)

    try:
        decoded = base64.b64decode(param, validate=True).decode("utf-8")
    except (binascii.Error, UnicodeDecodeError, ValueError):
        raise _unauthorized(request)

    username, separator, password = decoded.partition(":")
    if not separator:
        raise _unauthorized(request)

    # Both comparisons always run -- `and` would short-circuit on a username
    # mismatch and leak, through response timing, whether the username was right.
    # compare_digest needs bytes here: it rejects str containing non-ASCII.
    username_ok = secrets.compare_digest(
        username.encode("utf-8"), config.DEMO_AUTH_USERNAME.encode("utf-8")
    )
    password_ok = secrets.compare_digest(
        password.encode("utf-8"), config.DEMO_AUTH_PASSWORD.encode("utf-8")
    )
    if not (username_ok and password_ok):
        raise _unauthorized(request)

    return username
