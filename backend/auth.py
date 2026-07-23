from jose import jwt
from jose.exceptions import JWTError
from passlib.context import CryptContext
from fastapi import Depends,HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from database import get_db
from models import User

SECRET_KEY="supersecretkey"

ALGORITHM="HS256"

pwd_context=CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

oauth2_scheme=OAuth2PasswordBearer(
    tokenUrl="login"
)


def hash_password(password):

    return pwd_context.hash(password)


def verify_password(
    plain,
    hashed
):

    return pwd_context.verify(
        plain,
        hashed
    )


def create_token(data):

    return jwt.encode(
        data,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


def get_current_user(
    token:str=Depends(oauth2_scheme),
    db:Session=Depends(get_db)
):

    try:

        payload=jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id=payload.get("id")

        user=db.query(User).filter(
            User.id==user_id
        ).first()

        if not user:

            raise HTTPException(
                401,
                "Invalid token"
            )

        return user

    except JWTError:

        raise HTTPException(
            401,
            "Invalid token"
        )