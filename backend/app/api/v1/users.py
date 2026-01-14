from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.models import User
from app.schemas import UserCreate, UserOut
from app.core.security import get_password_hash

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=UserOut)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    # 1. Verificar si el usuario ya existe
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="El email ya está registrado")
    
    # 2. Encriptar la contraseña y crear el objeto
    hashed_pwd = get_password_hash(user.password)
    new_user = User(
        email=user.email,
        hashed_password=hashed_pwd,
        full_name=user.full_name
    )
    
    # 3. Guardar en la base de datos
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user