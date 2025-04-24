from dotenv import load_dotenv
from fastapi import FastAPI
import uvicorn

from starlette.middleware.sessions import SessionMiddleware
from fastapi.middleware.cors import CORSMiddleware

from app.utils.logger import get_logger
from app.config import settings
from app.api.routes.health import router as health_router
from app.api.routes.login import router as login_router
from app.api.routes.report import router as report_router

load_dotenv()

logger = get_logger("main")

app = FastAPI(title="Samurai")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

app.add_middleware(SessionMiddleware, secret_key="secret-string")

# Include the routers
logger.info("Registering API routers")
app.include_router(health_router)
app.include_router(login_router)
app.include_router(report_router)
logger.info("API routers registered successfully")


if __name__ == "__main__":
    import uvicorn
    logger.info(f"Starting Samurai API on {settings.HOST}:{settings.PORT}")
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True
    )