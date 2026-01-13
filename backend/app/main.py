from fastapi import FastAPI
from app.api.v1.endpoints import router as api_router
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    # Genera la documentación OpenAPI en esta ruta
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Conectamos nuestras rutas con el prefijo /api/v1
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {"message": "Bienvenido al core del AI SaaS Dashboard. Ve a /docs para la API."}