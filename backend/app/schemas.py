from pydantic import BaseModel, EmailStr
from typing import Optional

# Lo que el usuario nos envía al registrarse
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None

# Lo que nosotros le respondemos al usuario (sin la contraseña)
class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: Optional[str] = None
    is_active: bool

    class Config:
        from_attributes = True