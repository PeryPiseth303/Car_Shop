import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

def check_and_create_db():
    try:
        conn = psycopg2.connect(
            "postgresql://postgres:piseth123@localhost:5432/postgres",
            connect_timeout=5
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = conn.cursor()
        cur.execute("SELECT 1 FROM pg_database WHERE datname = 'car_shop'")
        exists = cur.fetchone()
        if not exists:
            cur.execute("CREATE DATABASE car_shop")
            print("Successfully created database 'car_shop'")
        else:
            print("Database 'car_shop' already exists")
        cur.close()
        conn.close()

        # Now test connecting directly to car_shop
        car_shop_conn = psycopg2.connect(
            "postgresql://postgres:piseth123@localhost:5432/car_shop",
            connect_timeout=5
        )
        print("Connected to 'car_shop' successfully!")
        car_shop_conn.close()
        return True
    except Exception as e:
        print("Error checking/creating database:", e)
        return False

if __name__ == "__main__":
    check_and_create_db()
