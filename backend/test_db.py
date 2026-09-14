import psycopg2

try:
    conn = psycopg2.connect(
        'postgresql://postgres:piseth123@localhost:5432/postgres',
        connect_timeout=5
    )
    conn.autocommit = True
    cur = conn.cursor()
    cur.execute("SELECT 1 FROM pg_database WHERE datname = 'car_shop'")
    exists = cur.fetchone()
    if not exists:
        cur.execute('CREATE DATABASE car_shop')
        print('Database car_shop created successfully')
    else:
        print('Database car_shop already exists')
    cur.close()
    conn.close()

    test_conn = psycopg2.connect(
        'postgresql://postgres:piseth123@localhost:5432/car_shop',
        connect_timeout=5
    )
    print('Connected to car_shop successfully!')
    test_conn.close()
except Exception as e:
    print('DB Connection error:', e)
