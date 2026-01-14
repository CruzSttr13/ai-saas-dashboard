from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.core.security import SECRET_KEY, ALGORITHM
from app.models import User

# Este esquema le dice a FastAPI que el token vendrá en el header 'Authorization'
# y la URL donde se obtiene el token es /api/v1/login
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/login")

def get_current_user(
    db: Session = Depends(get_db), 
    token: str = Depends(oauth2_scheme)
) -> User:
    """
    Dependencia para validar el token JWT y retornar el usuario actual.
    Si el token es inválido o el usuario no existe, lanza una excepción 401.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudieron validar las credenciales o el token ha expirado",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # 1. Decodificamos el token JWT
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        
        if email is None:
            raise credentials_exception
            
    except JWTError:
        # Si el token está mal formado o la firma no coincide
        raise credentials_exception
    
    # 2. Buscamos al usuario en la base de datos de Fedora
    user = db.query(User).filter(User.email == email).first()
    
    if user is None:
        raise credentials_exception
        
    # 3. Retornamos el objeto usuario completo (será inyectado en el endpoint)
    return user