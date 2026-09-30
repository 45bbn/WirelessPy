from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from pathlib import Path

router = APIRouter()

templates = Jinja2Templates(directory="modules")

@router.get("/module/{module}", response_class=HTMLResponse)
async def load_module(request: Request, module: str):

    template = f"{module}/templates/dashboard.html"

    if not Path("modules", module, "templates", "dashboard.html").exists():
        raise HTTPException(status_code=404, detail="Module not found")

    return templates.TemplateResponse(
        request=request,
        name=template,
        context={},
    )

@router.get("/nav/{module}", response_class=HTMLResponse)
async def load_nav(request: Request, module: str):

    nav = f"{module}/templates/nav.html"

    if not Path("modules", module, "templates", "dashboard.html").exists():
        raise HTTPException(status_code=404, detail="navigation module not found")

    return templates.TemplateResponse(
        request=request,
        name=nav,
        context={},
    )