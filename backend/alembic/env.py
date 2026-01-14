import os
import sys
from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context

# 1. Añadimos la raíz del proyecto al path para que Python encuentre la carpeta 'app'
sys.path.insert(0, os.path.realpath(os.path.join(os.path.dirname(__file__), '..')))

# 2. Importamos la configuración de tu DB y tus modelos
from app.core.db import Base
from app.models import User  # Esto es lo que permite que Alembic 'vea' la tabla de usuarios

# Interpretamos el archivo de configuración para el logging
config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# 3. Vinculamos los metadatos de tus modelos
target_metadata = Base.metadata

def run_migrations_offline() -> None:
    """Ejecutar migraciones en modo 'offline'."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    """Ejecutar migraciones en modo 'online'."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()