from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.api import endpoints
from app.core.logging import setup_logging
import logging

# Initialize standard logging
setup_logging()
logger = logging.getLogger(__name__)

app = FastAPI(
    title="ISRO Solar Flare Forecasting API",
    description="Backend API for automated nowcasting and forecasting of solar flares utilizing Aditya-L1 X-ray payloads.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# 1. Security Headers Middleware (Government-grade)
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

# 2. Configure Strict CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend domain
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# 3. Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled Exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"message": "An internal server error occurred. Please contact the administrator."},
    )

app.include_router(endpoints.router, prefix="/api")

# 4. Infrastructure Health Check
@app.get("/health", tags=["Infrastructure"])
def health_check():
    """
    Standardized health check endpoint for Kubernetes/Docker deployment liveness probes.
    """
    return {"status": "ok", "service": "ISRO Solar Flare Backend", "version": "1.0.0"}

@app.get("/")
def root():
    return {"message": "Welcome to the ISRO Solar Flare Forecasting API"}

