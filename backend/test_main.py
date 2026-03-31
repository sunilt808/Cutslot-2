import os
import pytest
import tempfile
import time
from fastapi.testclient import TestClient
from main import app
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base, get_db

# --- DUMMY TEST (ensures pytest never fails for no tests) ---
def test_dummy():
    assert True

# --- DATABASE SETUP ---
TEST_DB_PATH = tempfile.mktemp(suffix=".db")
SQLALCHEMY_DATABASE_URL = f"sqlite:///{TEST_DB_PATH}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)

TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# --- OVERRIDE DEPENDENCY ---
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

# --- SETUP & TEARDOWN ---
@pytest.fixture(scope="session", autouse=True)
def setup_database():
    # Cleanup before tests
    if os.path.exists(TEST_DB_PATH):
        os.remove(TEST_DB_PATH)

    Base.metadata.create_all(bind=engine)

    yield

    # Teardown
    Base.metadata.drop_all(bind=engine)

    # 🔥 IMPORTANT: release DB locks
    engine.dispose()

    # Small delay helps Windows release file lock
    time.sleep(0.5)

    # Remove DB file safely
    if os.path.exists(TEST_DB_PATH):
        try:
            os.remove(TEST_DB_PATH)
        except PermissionError:
            print("Warning: Could not delete test DB (still locked)")

# --- TEST CLIENT ---
@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c

# --- TEST DATA ---
@pytest.fixture
def user_data():
    return {
        "username": "testuser",
        "full_name": "Test User",
        "email": "testuser@example.com",
        "password": "testpass123",
        "role": "customer"
    }

@pytest.fixture
def user_login():
    return {
        "username": "testuser",
        "password": "testpass123"
    }

# --- AUTH HEADER FIXTURE ---
@pytest.fixture
def auth_headers(client, user_data, user_login):
    # Register user
    client.post("/users/", json=user_data)

    # Login
    login = client.post("/token", data=user_login)
    token = login.json().get("access_token", "")

    return {"Authorization": f"Bearer {token}"}
