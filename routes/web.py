import os
from fastapi import APIRouter, Request, Depends
from fastapi.templating import Jinja2Templates
from routes.auth import get_current_user

router = APIRouter()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
templates = Jinja2Templates(
    directory=os.path.join(BASE_DIR, "templates")
)


@router.get("/home")
async def home(request: Request):
    return templates.TemplateResponse(
        name="home.html",
        request=request
    )

@router.get("/")
async def main(request: Request, current_user = Depends(get_current_user)):
    return templates.TemplateResponse(
        request,
        name="index.html",
        context={"request": request}
    )

@router.get("/example")
async def example(request: Request):
    return templates.TemplateResponse(
        request,
        name="example.html",
        context={"request": request}
    )