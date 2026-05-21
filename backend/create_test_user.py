"""
One-off script to create a demo user directly in the DB.
Run from backend/: python create_test_user.py

Credentials:
  username: demo
  email:    demo@codebite.dev
  password: Demo1234
"""
import asyncio
from sqlalchemy import select
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from database import Base
from models.user import User
from core.security import hash_password

DATABASE_URL = "sqlite+aiosqlite:///./codebite.db"


async def create_demo_user():
    engine = create_async_engine(DATABASE_URL, echo=False)
    Session = async_sessionmaker(engine, expire_on_commit=False)

    async with Session() as session:
        existing = await session.execute(
            select(User).where(User.username == "demo")
        )
        if existing.scalar_one_or_none():
            print("Demo user already exists — nothing to do.")
            print("  username: demo")
            print("  password: Demo1234")
            await engine.dispose()
            return

        user = User(
            username="demo",
            email="demo@codebite.dev",
            hashed_password=hash_password("Demo1234"),
        )
        session.add(user)
        await session.commit()
        print("Test user created successfully!")
        print("  username: demo")
        print("  email:    demo@codebite.dev")
        print("  password: Demo1234")

    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(create_demo_user())
