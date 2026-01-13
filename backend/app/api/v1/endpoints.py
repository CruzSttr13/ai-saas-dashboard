from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
def health_check():
    return {
        "status": "online", 
        "message": "Backend configurado correctamente en Fedora",
        "stack": "Python 3.12 + FastAPI"
    }

@router.get("/ping")
def ping():
    return {"res": "pong"}