from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi.middleware import SlowAPIMiddleware
from slowapi.errors import RateLimitExceeded
from database import engine, Base
from routers import auth, lessons, progress, community, curriculum
from core.limiter import limiter
from core.config import settings

# Import models so SQLAlchemy registers them with Base.metadata
import models.user
import models.lesson
import models.progress
import models.community


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables if they don't exist (fallback for dev without running alembic)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield


app = FastAPI(title="CodeBite API", version="1.0.0", lifespan=lifespan)

# Rate limiting
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)

async def _rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(status_code=429, content={"detail": "Too many requests. Slow down."})

app.add_exception_handler(RateLimitExceeded, _rate_limit_handler)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

# Security headers
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response

app.include_router(auth.router)
app.include_router(lessons.router)
app.include_router(progress.router)
app.include_router(community.router)
app.include_router(curriculum.router)


@app.get("/")
async def root():
    return {
        "app": "CodeBite API",
        "version": "1.0.0",
        "frontend": "http://localhost:5173",
        "docs": "http://localhost:8000/docs",
        "health": "ok",
    }


@app.get("/health")
async def health():
    return {"status": "ok"}
