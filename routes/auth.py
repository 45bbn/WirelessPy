from fastapi import APIRouter, Response, HTTPException, status, Request, WebSocket, WebSocketException, Depends
from pydantic import BaseModel, Field
from typing import Literal
ALLOW_REGISTRATION = True
from services import auth

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


class RegisterRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=20)
    password: str = Field(..., min_length=8)
    role: Literal["admin", "viewer"] = "viewer"

class LoginRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=20)
    password: str = Field(..., min_length=8)


router.post("/register")
async def register(data: RegisterRequest):
    if not ALLOW_REGISTRATION:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Registrasi ditutup. Hubungi administrator."
        )

    assigned_role = "viewer"

    try:
        auth.register_user(data.username, data.password, assigned_role)
        return {
            "success": True,
            "message": "Register successfully",
            "username": data.username,
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail=str(e)
        )

@router.post("/login")
async def login(data: LoginRequest, response: Response):
    result = auth.login_user(data.username, data.password)

    if result is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Wrong username or password",
        )

    response.set_cookie(  # Cookie HTTPOnly
        key="session_token",
        value=result["token"],
        httponly=True,  # Anti-XSS
        max_age=7 * 24 * 60 * 60,  # 7 days
        samesite="lax",  # Anti-CSRF
    )

    return {
        "success": True,
        "message": "Login succesfuly",
        "username": result["username"],
    }


@router.post("/logout")
async def logout(request: Request, response: Response):
    token = request.cookies.get("session_token")
    
    if token:
        auth.logout_user(token)
        
    response.delete_cookie("session_token", httponly=True, samesite="lax")
    
    return {"success": True, "message": "Logout succesfuly"}



async def get_current_user(request: Request):
    token = request.cookies.get("session_token")

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="unauthorized"
        )

    user = auth.get_user_from_session(token)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session is invalid or expired",
        )

    return user


async def get_current_user_ws(websocket: WebSocket):
    token = websocket.cookies.get("session_token")

    if not token:
        raise WebSocketException(code=status.WS_1008_POLICY_VIOLATION)

    user = auth.get_user_from_session(token)

    if not user:
        raise WebSocketException(code=status.WS_1008_POLICY_VIOLATION)

    return user

@router.get("/me")
async def get_me(user: dict = Depends(get_current_user)):
    return {"user": user}
