# Start Backend
cd backend
# Recommended: python -m venv venv; .\venv\Scripts\Activate.ps1
pip install fastapi "uvicorn[standard]" sqlalchemy "passlib[bcrypt]" "python-jose[cryptography]" python-multipart "pydantic[email-validator]"
Start-Process powershell -ArgumentList "uvicorn main:app --reload --port 8000"

# Wait for backend to start
Write-Host "Waiting for backend to initialize (10s)..."
Start-Sleep -s 10

# Seed data
Write-Host "Seeding luxury services data..."
Invoke-RestMethod -Uri "http://localhost:8000/seed/" -Method Post

# Start Frontend
cd ../frontend
npm install
npm run dev
