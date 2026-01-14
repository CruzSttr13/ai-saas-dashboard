from passlib.context import CryptContext

# Configuramos passlib para usar bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    """Transforma una contraseña plana en un hash seguro."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Compara una contraseña plana con el hash guardado en la DB."""
    return pwd_context.verify(plain_password, hashed_password)