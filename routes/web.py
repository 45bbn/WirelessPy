import os
from fastapi import APIRouter, Request, Depends
from fastapi.templating import Jinja2Templates
from fastapi.responses import RedirectResponse
from routes.auth import get_current_user

router = APIRouter()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
templates = Jinja2Templates(directory=os.path.join(BASE_DIR, "templates"))

@router.get("/")
async def main(request: Request):
    token = request.cookies.get("session_token")

    if not token:
        return RedirectResponse(url="/login", status_code=303)

    return templates.TemplateResponse(
        request,
        name="index.html",
        context={"request": request}
    )

@router.get("/login")
async def login_page(request: Request):
    return templates.TemplateResponse(
        request,
        name="login.html", 
        context={"request": request})