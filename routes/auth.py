from fastapi import APIRouter, Response, HTTPException, status, Request, Depends
from pydantic import BaseModel, Field

from services import auth

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

class LoginRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=20)
    password: str = Field(..., min_length=8)

@router.post("/login")
async def login(data: LoginRequest, response: Response):
    result = auth.login_user(data.username, data.password)
    
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Wrong username or password"
        )
    
    response.set_cookie( # Cookie HTTPOnly
        key="session_token",
        value=result["token"],
        httponly=True,       # Anti-XSS
        max_age=7 * 24 * 60 * 60, # 7 days
        samesite="lax"       # Anti-CSRF
    )
    
    return {"success": True, "message": "Login succesfuly", "user_id": result["user_id"]}

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
            detail="Session invalid or expired"
        )
        
    return user
    
@router.get("/me")
async def get_me(user: dict = Depends(get_current_user)):
    return {"success": True, "user": user}