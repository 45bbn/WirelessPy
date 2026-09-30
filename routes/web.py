import os
from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates

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
async def main(request: Request):
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