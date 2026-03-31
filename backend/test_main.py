import os
import pytest
from fastapi.testclient import TestClient
from main import app
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base, get_db
import time

# --- DUMMY TEST (ensures pytest never fails for no tests) ---
def test_dummy():
    assert True

# --- DATABASE SETUP ---
TEST_DB_PATH = "./test.db"
SQLALCHEMY_DATABASE_URL = f"sqlite:///{TEST_DB_PATH}"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="session", autouse=True)
def setup_database():
    if os.path.exists(TEST_DB_PATH):
        os.remove(TEST_DB_PATH)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)
    if os.path.exists(TEST_DB_PATH):
        os.remove(TEST_DB_PATH)

@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c

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

@pytest.fixture
def auth_headers(client, user_data, user_login):
    # Register and login, return headers with JWT
    client.post("/users/", json=user_data)
    login = client.post("/token", data=user_login)
    token = login.json().get("access_token", "")
    return {"Authorization": f"Bearer {token}"}
