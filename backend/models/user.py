from datetime import date, datetime
from sqlalchemy import Integer, String, Boolean, Date, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String, nullable=False)
    lives: Mapped[int] = mapped_column(Integer, default=5, nullable=False)
    streak: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    # Date only — used to check if a day was missed for streak reset
    last_active: Mapped[date | None] = mapped_column(Date, nullable=True)
    xp: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    last_token_loss_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
