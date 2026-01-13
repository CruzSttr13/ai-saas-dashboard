from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

# El motor que hablará con Postgres
engine = create_engine(settings.DATABASE_URL)

# La fábrica de sesiones para las consultas
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# La clase base de la que heredarán nuestros modelos (Tablas)
Base = declarative_base()

# Dependencia para obtener la DB en los endpoints
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()