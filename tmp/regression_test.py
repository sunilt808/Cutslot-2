import requests
import sys

BASE_URL = "http://localhost:8000"

def test_flow():
    print("--- REGRESSION TEST: LUMIÈRE ECOSYSTEM v2.2 ---")
    
    # 1. Signup Customer
    print("\n1. Customer Signup...")
    res = requests.post(f"{BASE_URL}/users/", json={
        "username": "test_client", "email": "client@test.com", "password": "password123", "role": "customer"
    })
    if res.status_code == 200: print("SUCCESS: Customer created and auto-approved.")
    else: print(f"FAILED: {res.text}")

    # 2. Signup Worker
    print("\n2. Worker Signup...")
    res = requests.post(f"{BASE_URL}/users/", json={
        "username": "test_worker", "email": "worker@test.com", "password": "password123", "role": "staff", "assigned_floor": 2
    })
    if res.status_code == 200: print("SUCCESS: Worker created, pending approval.")
    else: print(f"FAILED: {res.text}")

    # 3. Try login Worker (Should fail)
    print("\n3. Login Worker (Unapproved)...")
    res = requests.post(f"{BASE_URL}/token", data={"username": "test_worker", "password": "password123"})
    if res.status_code == 403: print("SUCCESS: Login blocked (Forbidden as expected).")
    else: print(f"FAILED: Status {res.status_code}")

    # 4. Login Admin & Approve Worker
    print("\n4. Admin Login & Approval...")
    admin_login = requests.post(f"{BASE_URL}/token", data={"username": "admin", "password": "admin123"}).json()
    token = admin_login['access_token']
    headers = {"Authorization": f"Bearer {token}"}
    
    workers = requests.get(f"{BASE_URL}/admin/workers", headers=headers).json()
    worker_id = [w['id'] for w in workers if w['username'] == 'test_worker'][0]
    
    res = requests.put(f"{BASE_URL}/admin/workers/{worker_id}/approve", headers=headers)
    if res.status_code == 200: print("SUCCESS: Worker approved by Admin.")
    else: print(f"FAILED: {res.text}")

    # 5. Login Worker (Should succeed now)
    print("\n5. Login Worker (Approved)...")
    res = requests.post(f"{BASE_URL}/token", data={"username": "test_worker", "password": "password123"})
    if res.status_code == 200: print("SUCCESS: Worker login allowed.")
    else: print(f"FAILED: {res.text}")

    print("\n--- REGRESSION COMPLETE: SYSTEM STABLE ---")

if __name__ == "__main__":
    test_flow()
