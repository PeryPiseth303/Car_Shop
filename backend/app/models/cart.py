import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database import Base

class CartItemModel(Base):
    __tablename__ = "cart_items"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_email = Column(String, index=True, nullable=False)
    car_id = Column(String, ForeignKey("cars.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    car = relationship("CarModel", lazy="joined")

    __table_args__ = (
        UniqueConstraint("user_email", "car_id", name="uq_user_car_cart"),
    )
