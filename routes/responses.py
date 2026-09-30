from fastapi.responses import JSONResponse

def error_response(error: str, status_code: int = 500):
    return JSONResponse(
        status_code=status_code,
        content={
            "success": False,
            "error": error
        }
    )