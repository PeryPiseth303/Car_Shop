import uvicorn
from app.config import settings

if __name__ == "__main__":
    try:
        print(f"Starting {settings.APP_NAME} on http://{settings.HOST}:{settings.PORT}")
        print(f"Interactive API Docs available at http://localhost:{settings.PORT}/docs")
        # Set reload=False on Windows Python 3.14 to prevent WatchFiles crashes
        uvicorn.run(
            "app.main:app",
            host=settings.HOST,
            port=settings.PORT,
            reload=False,
        )
    except KeyboardInterrupt:
        print("\n[Server Shutdown] Server stopped safely by user interrupt.")

