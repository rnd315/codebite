from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import auth, lessons, progress, community, curriculum

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

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://codebite.crystalmind.ro",
        "http://codebite.crystalmind.ro",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
