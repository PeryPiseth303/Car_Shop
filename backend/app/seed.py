import sys
import os

# Ensure backend folder is on sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import engine, Base, SessionLocal
from app.models.car import CarModel
from app.models.brand import BrandModel
from app.models.inquiry import InquiryModel
from app.models.sell_request import SellRequestModel
from app.models.test_drive import TestDriveModel
from app.models.user import UserModel
from app.models.otp import OTPModel
from app.models.cart import CartItemModel
from app.utils.security import hash_password

# Seed Data matching frontend lib/data.ts
photos = [
    "photo-1503376780353-7e6692767b70", "photo-1618843479313-40f8afb4b4d8", "photo-1555215695-3004980ad54e",
    "photo-1492144534655-ae79c964c9d7", "photo-1583121274602-3e2820c69888", "photo-1549317661-bd32c8ce0db2",
    "photo-1504215680853-026ed2a45def", "photo-1511919884226-fd3cad34687c", "photo-1549317661-bd32c8ce0db2",
    "photo-1606664515524-ed2f786a0bd6"
]

def img(i: int) -> str:
    return f"https://images.unsplash.com/{photos[i % len(photos)]}?auto=format&fit=crop&w=1400&q=85"

base_cars = [
    ["Porsche","911 Carrera","Coupe",114800,379,"3.0L Twin-Turbo Flat-6"],
    ["BMW","M4 Competition","Coupe",87900,503,"3.0L Twin-Turbo I6"],
    ["Mercedes-Benz","AMG GT 55","Coupe",136050,469,"4.0L Biturbo V8"],
    ["Audi","RS e-tron GT","Sedan",147100,637,"Dual Electric Motors"],
    ["Land Rover","Range Rover Sport","SUV",92300,395,"3.0L Turbo I6"],
    ["Tesla","Model S Plaid","Sedan",89990,1020,"Tri-Motor Electric"],
    ["Lexus","LC 500","Coupe",99550,471,"5.0L V8"],
    ["Ford","Mustang Dark Horse","Coupe",63480,500,"5.0L V8"],
    ["Toyota","GR Supra","Coupe",58200,382,"3.0L Turbo I6"],
    ["Honda","Civic Type R","Hatchback",45990,315,"2.0L Turbo I4"],
    ["Lamborghini","Huracán Tecnica","Coupe",244795,631,"5.2L V10"],
    ["Porsche","Cayenne S","SUV",97800,468,"4.0L Twin-Turbo V8"],
    ["BMW","i7 xDrive60","Sedan",124200,536,"Dual Electric Motors"],
    ["Mercedes-Benz","G 550","SUV",143000,416,"3.0L Turbo I6"],
    ["Audi","Q8 e-tron","SUV",74800,402,"Dual Electric Motors"],
    ["Ford","Bronco Raptor","SUV",91200,418,"3.0L Twin-Turbo V6"],
    ["Toyota","Land Cruiser","SUV",57900,326,"2.4L Hybrid Turbo"],
    ["Lexus","RX 500h F Sport","SUV",66550,366,"2.4L Hybrid Turbo"],
    ["Tesla","Model X","SUV",79990,670,"Dual Motor Electric"],
    ["Honda","Pilot Elite","SUV",52980,285,"3.5L V6"]
]

brands_list = [
    ("Toyota", "toyota"),
    ("BMW", "bmw"),
    ("Mercedes-Benz", "mercedesbenz"),
    ("Audi", "audi"),
    ("Porsche", "porsche"),
    ("Ford", "ford"),
    ("Honda", "honda"),
    ("Tesla", "tesla"),
    ("Lexus", "lexus"),
    ("Lamborghini", "lamborghini"),
]

def seed_database():
    print("Creating all database tables...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 1. Seed Brands
        print("Checking Brands...")
        for name, slug in brands_list:
            existing_brand = db.query(BrandModel).filter(BrandModel.name == name).first()
            if not existing_brand:
                db.add(BrandModel(name=name, logo_slug=slug))
        db.commit()

        # 2. Seed Cars
        print("Checking Cars...")
        car_count = db.query(CarModel).count()
        if car_count == 0:
            print(f"Seeding {len(base_cars)} vehicles...")
            for i, c in enumerate(base_cars):
                cid = str(i + 1)
                fuel = "Electric" if "Electric" in str(c[5]) else "Hybrid" if "Hybrid" in str(c[5]) else "Gasoline"
                color = ["Obsidian Black", "Arctic White", "Nardo Grey", "Racing Red", "Midnight Blue"][i % 5]
                interior = "Black Nappa Leather" if i % 2 else "Cognac Leather"
                location = ["Norodom Blvd, Phnom Penh", "Toul Kork, Phnom Penh", "BKK1, Phnom Penh", "Koh Pich, Phnom Penh"][i % 4]
                
                car = CarModel(
                    id=cid,
                    brand=c[0],
                    model=c[1],
                    body_type=c[2],
                    price=c[3],
                    horsepower=c[4],
                    engine=c[5],
                    year=2026 - (i % 4),
                    mileage=int(round((950 + (i * 3721) % 42000) * 1.60934)),
                    transmission="Manual" if i == 9 else "Automatic",
                    fuel_type=fuel,
                    color=color,
                    interior_color=interior,
                    location=location,
                    description=f"This meticulously selected {c[0]} {c[1]} blends exceptional performance with everyday refinement. Fully inspected, beautifully presented, and ready for its next chapter.",
                    images=[img(i), img(i + 2), img(i + 4)],
                    features=["Premium sound system", "Adaptive cruise control", "360° camera", "Heated seats", "Wireless Apple CarPlay"],
                    featured=i < 6,
                    condition="New" if i % 3 == 0 else "Certified",
                    seats=4 if c[2] == "Coupe" else 5,
                    drive_type="All-wheel drive" if i % 3 == 0 else "Rear-wheel drive",
                )
                db.add(car)
            db.commit()
            print("Successfully seeded cars.")
        else:
            print(f"Database already has {car_count} cars.")

        # 3. Seed Sample Inquiries if empty
        inquiry_count = db.query(InquiryModel).count()
        if inquiry_count == 0:
            print("Seeding sample inquiries...")
            samples = [
                InquiryModel(
                    name="Sophea Rath",
                    email="sophea.rath@example.com",
                    phone="+855 12 345 678",
                    subject="Vehicle enquiry",
                    message="I am interested in scheduling a viewing for the Porsche 911 Carrera this weekend.",
                    car_id="1",
                    car_name="Porsche 911 Carrera",
                    status="Pending"
                ),
                InquiryModel(
                    name="David Chen",
                    email="david.chen@example.com",
                    phone="+855 96 888 999",
                    subject="Financing",
                    message="Could you provide details on your 5-year financing plan for the BMW M4 Competition?",
                    car_id="2",
                    car_name="BMW M4 Competition",
                    status="Contacted"
                ),
                InquiryModel(
                    name="Vannak Lim",
                    email="vannak.lim@example.com",
                    phone="+855 77 111 222",
                    subject="General question",
                    message="Do you handle vehicle registration and import paperwork directly at the dealership?",
                    status="Resolved"
                ),
            ]
            db.add_all(samples)
            db.commit()
            print("Sample inquiries seeded.")

        # 4. Seed Sample Sell Requests if empty
        sell_count = db.query(SellRequestModel).count()
        if sell_count == 0:
            print("Seeding sample sell requests...")
            sells = [
                SellRequestModel(
                    make="Mercedes-Benz",
                    model="C 300 AMG Line",
                    year=2023,
                    vin="WDD2050401R123456",
                    mileage="18,500 mi",
                    body_type="Sedan",
                    fuel_type="Gasoline",
                    transmission="Automatic",
                    engine="2.0L Turbo I4",
                    exterior_color="Polar White",
                    features="Panoramic Sunroof, Burmester Audio, AMG Styling",
                    asking_price="$48,000",
                    full_name="Chanthy Sok",
                    email="chanthy.sok@example.com",
                    phone="+855 89 222 333",
                    zip_code="12000",
                    status="Under Review"
                ),
                SellRequestModel(
                    make="Audi",
                    model="RS5 Coupe",
                    year=2024,
                    vin="WAUZZZF50PA654321",
                    mileage="9,200 mi",
                    body_type="Coupe",
                    fuel_type="Gasoline",
                    transmission="Automatic",
                    engine="2.9L Biturbo V6",
                    exterior_color="Nardo Grey",
                    features="Carbon Optics, Dynamic Plus Package, Bang & Olufsen",
                    asking_price="$78,000",
                    full_name="Kosal Meng",
                    email="kosal.m@example.com",
                    phone="+855 10 555 777",
                    zip_code="12301",
                    status="Approved"
                ),
            ]
            db.add_all(sells)
            db.commit()
            print("Sample sell requests seeded.")

        # 5. Seed Sample Test Drives if empty
        td_count = db.query(TestDriveModel).count()
        if td_count == 0:
            print("Seeding sample test drive appointments...")
            tds = [
                TestDriveModel(
                    car_id="2",
                    car_name="BMW M4 Competition",
                    customer_name="Alex Morgan",
                    customer_email="alex@example.com",
                    customer_phone="+855 96 407 6840",
                    appointment_date="Friday, Aug 15",
                    time_slot="2:30 PM",
                    location="Aurelia Downtown Flagship",
                    specialist="James (Senior Specialist)",
                    status="Confirmed"
                ),
                TestDriveModel(
                    car_id="3",
                    car_name="Mercedes-Benz AMG GT 55",
                    customer_name="Borey Sam",
                    customer_email="borey.sam@example.com",
                    customer_phone="+855 11 999 888",
                    appointment_date="Monday, Aug 18",
                    time_slot="10:00 AM",
                    location="Aurelia Downtown Flagship",
                    specialist="Elena (Client Advisor)",
                    status="Confirmed"
                ),
            ]
            db.add_all(tds)
            db.commit()
            print("Sample test drives seeded.")

        # 6. Seed / Sync Super Admin and default client from settings
        admin_email = settings.ADMIN_EMAIL.lower().strip()
        admin_pass = settings.ADMIN_PASSWORD.strip()
        admin_salt, admin_hash = hash_password(admin_pass)

        admin_user = db.query(UserModel).filter(UserModel.email == admin_email).first()
        if not admin_user:
            print(f"Creating super admin: {admin_email}...")
            admin_user = UserModel(
                email=admin_email,
                password_hash=admin_hash,
                password_salt=admin_salt,
                full_name="Seth (Super Admin)",
                role="admin",
                is_active=True
            )
            db.add(admin_user)
        else:
            admin_user.password_hash = admin_hash
            admin_user.password_salt = admin_salt
            admin_user.role = "admin"
            admin_user.is_active = True

        client_user = db.query(UserModel).filter(UserModel.email == "alex@example.com").first()
        if not client_user:
            user_salt, user_hash = hash_password("user123")
            client_user = UserModel(
                email="alex@example.com",
                password_hash=user_hash,
                password_salt=user_salt,
                full_name="Alex Morgan",
                role="user",
                is_active=True
            )
            db.add(client_user)

        db.commit()
        print(f"Super admin synced: {admin_email} (Role: admin)")

        print("Database seeding completed successfully!")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
