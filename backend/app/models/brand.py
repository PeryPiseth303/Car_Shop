from sqlalchemy import Column, Integer, String
from app.database import Base

class BrandModel(Base):
    __tablename__ = "brands"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, unique=True, nullable=False, index=True)
    logo_slug = Column(String, nullable=True)
