from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.models import User
from app.schemas import UserCreate, UserOut
from app.core.security import get_password_hash
from app.core.deps import get_current_user # Importamos la dependencia

# 1. Definimos el router primero
router = APIRouter(prefix="/users", tags=["users"])

# 2. Endpoint PROTEGIDO (Requiere Token)
@router.get("/me", response_model=UserOut)
def read_user_me(current_user: User = Depends(get_current_user)):
    """
    Retorna el perfil del usuario autenticado mediante el Token JWT.
    """
    return current_user

# 3. Endpoint PÚBLICO (Para registro)
@router.post("/", response_model=UserOut)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    # Verificar si el usuario ya existe
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="El email ya está registrado")
    
    # Encriptar y guardar
    hashed_pwd = get_password_hash(user.password)
    new_user = User(
        email=user.email,
        hashed_password=hashed_pwd,
        full_name=user.full_name
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user