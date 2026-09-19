from fastapi import APIRouter, Depends

from ..core.security import require_demo_auth

router = APIRouter()


# POST rather than GET so no proxy or CDN ever caches an authorization outcome.
# The login modal calls this to validate credentials before storing them, so a
# wrong password surfaces immediately instead of only failing later at upload.
@router.post("/auth/verify")
def verify_credentials(_username: str = Depends(require_demo_auth)):
    return {"status": "ok"}
