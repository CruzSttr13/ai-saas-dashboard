from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import users, auth
from app.api.v1.endpoints import ai, images

app = FastAPI(
    title="AI SaaS Dashboard",
    description="Backend para el Dashboard AI SaaS - Día 5: AI Integration",
    version="1.0.0"
)

# 1. Configuración de CORS (MUY IMPORTANTE: Antes de los routers)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # Asegúrate que tu Next.js esté aquí
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Inclusión de Routers (Agrupados)
app.include_router(auth.router, prefix="/api/v1", tags=["Auth"])
app.include_router(users.router, prefix="/api/v1", tags=["Users"])
app.include_router(ai.router, prefix="/api/v1/ai", tags=["AI"]) # Ruta: /api/v1/ai/chat
app.include_router(images.router, prefix="/api/v1/images", tags=["Images"])

# 3. Endpoints generales
@app.get("/", tags=["General"])
def read_root():
    return {
        "status": "online",
        "message": "Bienvenido al AI SaaS Dashboard 2026",
        "day": 5 
    }

@app.get("/db-test", tags=["General"])
def test_db_connection():
    from app.core.db import engine
    try:
        with engine.connect() as connection:
            return {"status": "success", "detail": "Conexión a PostgreSQL en Fedora exitosa"}
    except Exception as e:
        return {"status": "error", "detail": str(e)}