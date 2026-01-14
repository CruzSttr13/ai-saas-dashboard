from fastapi import FastAPI
from app.api.v1 import users, auth  # Importamos ambos módulos juntos

# 1. Creamos la instancia de FastAPI (Esto debe ir antes de usar 'app')
app = FastAPI(
    title="AI SaaS Dashboard",
    description="Backend para el Dashboard AI SaaS - Día 3: Autenticación",
    version="1.0.0"
)

# 2. Ahora que 'app' ya existe, incluimos los routers
app.include_router(users.router, prefix="/api/v1", tags=["Users"])
app.include_router(auth.router, prefix="/api/v1", tags=["Auth"])

# 3. Endpoints generales
@app.get("/", tags=["General"])
def read_root():
    """
    Endpoint de bienvenida para verificar que el servidor está en línea.
    """
    return {
        "status": "online",
        "message": "Bienvenido al AI SaaS Dashboard 2026",
        "day": 3  # ¡Ya estamos en el día 3!
    }

@app.get("/db-test", tags=["General"])
def test_db_connection():
    from app.core.db import engine
    try:
        with engine.connect() as connection:
            return {"status": "success", "detail": "Conexión a PostgreSQL en Fedora exitosa"}
    except Exception as e:
        return {"status": "error", "detail": str(e)}