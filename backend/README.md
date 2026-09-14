# Aurelia Motors — FastAPI Backend & PostgreSQL Database

High-performance, modular backend API built with **FastAPI**, **SQLAlchemy 2.0**, and **PostgreSQL**.

---

## 🚀 Quick Start

### 1. Prerequisites
- **Python 3.10+**
- **PostgreSQL 14+** running on `localhost:5432` with password `piseth123`

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Environment Configuration (`.env`)
```env
DATABASE_URL=postgresql://postgres:piseth123@localhost:5432/car_shop
APP_NAME="Aurelia Motors API"
DEBUG=True
PORT=8000
HOST=0.0.0.0
```

### 4. Run Seed & Start Server
```bash
# Seed database with all 20 vehicles, 10 brands, inquiries, and test drives
python app/seed.py

# Start the development server
python run.py
```
- **API Base URL:** `http://localhost:8000`
- **Interactive Swagger Docs:** `http://localhost:8000/docs`
- **Alternative ReDoc:** `http://localhost:8000/redoc`

---

## 🏗 Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                # FastAPI app, CORS middleware, lifespan startup
│   ├── config.py              # Pydantic BaseSettings (.env loading)
│   ├── database.py            # SQLAlchemy engine, sessionmaker, get_db dependency
│   ├── models/                # SQLAlchemy database models
│   │   ├── car.py             # CarModel
│   │   ├── brand.py           # BrandModel
│   │   ├── inquiry.py         # InquiryModel (messages & leads)
│   │   ├── sell_request.py    # SellRequestModel (sell wizard submissions)
│   │   └── test_drive.py      # TestDriveModel (appointments)
│   ├── schemas/               # Pydantic v2 validation & serialization schemas
│   │   ├── car.py             # CarBase, CarCreate, CarUpdate, CarResponse
│   │   ├── brand.py           # BrandBase, BrandResponse
│   │   ├── inquiry.py         # InquiryCreate, InquiryResponse, InquiryUpdate
│   │   ├── sell_request.py    # SellRequestCreate, SellRequestResponse
│   │   ├── test_drive.py      # TestDriveCreate, TestDriveResponse
│   │   └── analytics.py       # DashboardAnalyticsResponse
│   ├── routers/               # API endpoint routers
│   │   ├── cars.py            # /api/cars CRUD, search, filter, sort
│   │   ├── brands.py          # /api/brands
│   │   ├── inquiries.py       # /api/inquiries
│   │   ├── sell_requests.py   # /api/sell-requests
│   │   ├── test_drives.py     # /api/test-drives
│   │   └── analytics.py       # /api/analytics/dashboard
│   └── seed.py                # Database seeder & table generator
├── .env                       # Environment variables
├── requirements.txt           # Python dependencies
└── run.py                     # Convenience runner script
```

---

## 📡 API Endpoints

### 🚗 Vehicles (`/api/cars`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/cars` | Filter, search, and sort all vehicles |
| `GET` | `/api/cars/{id}` | Retrieve single vehicle details |
| `POST` | `/api/cars` | Create a new vehicle listing |
| `PUT` | `/api/cars/{id}` | Update existing vehicle |
| `PATCH` | `/api/cars/{id}/featured` | Toggle featured showcase status |
| `DELETE` | `/api/cars/{id}` | Delete vehicle from database |

### 📊 Analytics & KPIs (`/api/analytics`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/analytics/dashboard` | Aggregated metrics, total inventory value, lead counts |

### 💬 Inquiries & Leads (`/api/inquiries`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/inquiries` | List all inquiries |
| `POST` | `/api/inquiries` | Submit customer message |
| `PATCH` | `/api/inquiries/{id}/status` | Update status (`Pending`, `Contacted`, `Resolved`, `Archived`) |
| `DELETE` | `/api/inquiries/{id}` | Delete inquiry |

### 💰 Sell Submissions (`/api/sell-requests`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/sell-requests` | List vehicle sell requests from wizard |
| `POST` | `/api/sell-requests` | Submit customer vehicle for sale |
| `PATCH` | `/api/sell-requests/{id}/status` | Update review status |
| `DELETE` | `/api/sell-requests/{id}` | Delete request |

### 📅 Test Drives (`/api/test-drives`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/test-drives` | List scheduled test drives |
| `POST` | `/api/test-drives` | Book appointment |
| `PATCH` | `/api/test-drives/{id}/status` | Update appointment status |
| `DELETE` | `/api/test-drives/{id}` | Cancel/delete appointment |
