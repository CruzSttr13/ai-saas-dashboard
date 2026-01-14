from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import users, auth

# 1. Instancia única de FastAPI
app = FastAPI(
    title="AI SaaS Dashboard",
    description="Backend para el Dashboard AI SaaS - Día 4: Frontend Integration",
    version="1.0.0"
)

# 2. Configuración de CORS (Fundamental para que Next.js funcione)
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Inclusión de Routers (Sin duplicados)
app.include_router(auth.router, prefix="/api/v1", tags=["Auth"])
app.include_router(users.router, prefix="/api/v1", tags=["Users"])

# 4. Endpoints generales
@app.get("/", tags=["General"])
def read_root():
    return {
        "status": "online",
        "message": "Bienvenido al AI SaaS Dashboard 2026",
        "day": 4 
    }

@app.get("/db-test", tags=["General"])
def test_db_connection():
    from app.core.db import engine
    try:
        with engine.connect() as connection:
            return {"status": "success", "detail": "Conexión a PostgreSQL en Fedora exitosa"}
    except Exception as e:
        return {"status": "error", "detail": str(e)}