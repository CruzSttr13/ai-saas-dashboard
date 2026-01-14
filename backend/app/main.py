from fastapi import FastAPI
from app.api.v1 import users

app = FastAPI(
    title="AI SaaS Dashboard",
    description="Backend para el Dashboard AI SaaS - Día 2 completado",
    version="1.0.0"
)

# Incluimos las rutas de usuarios con sus respectivos prefijos y etiquetas
app.include_router(users.router)

@app.get("/", tags=["General"])
def read_root():
    """
    Endpoint de bienvenida para verificar que el servidor está en línea.
    """
    return {
        "status": "online",
        "message": "Bienvenido al AI SaaS Dashboard 2026",
        "day": 2
    }

# Si quieres mantener el endpoint de prueba de base de datos de ayer, 
# asegúrate de que app.core.db tenga la lógica de conexión.
@app.get("/db-test", tags=["General"])
def test_db_connection():
    from app.core.db import engine
    try:
        with engine.connect() as connection:
            return {"status": "success", "detail": "Conexión a PostgreSQL en Fedora exitosa"}
    except Exception as e:
        return {"status": "error", "detail": str(e)}