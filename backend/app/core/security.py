from datetime import datetime, timedelta
from typing import Optional
from jose import jwt
from passlib.context import CryptContext

# --- CONFIGURACIÓN DE SEGURIDAD ---
# En un entorno real, estos valores irían en un archivo .env
SECRET_KEY = "UNA_LLAVE_MUY_SECRETA_Y_LARGA_QUE_NADIE_DEBE_SABER"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Configuración de Passlib para el hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- FUNCIONES DE CONTRASEÑA ---

def get_password_hash(password: str) -> str:
    """Transforma una contraseña plana en un hash seguro."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Compara una contraseña plana con el hash guardado en la DB."""
    return pwd_context.verify(plain_password, hashed_password)

# --- FUNCIONES DE TOKEN (JWT) ---

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """
    Crea un token JWT firmado.
    :param data: Diccionario con los datos a guardar (ej: {"sub": email})
    :param expires_delta: Tiempo de expiración personalizado
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    # Añadimos la fecha de expiración al payload del token
    to_encode.update({"exp": expire})
    
    # Firmamos el token con nuestra SECRET_KEY
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    
    return encoded_jwt