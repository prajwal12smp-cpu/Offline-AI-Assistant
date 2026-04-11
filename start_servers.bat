@echo off
echo Starting Backend Server...
start "Backend Server" cmd /k "cd /d %~dp0backend && .\venv\Scripts\python.exe -m pip install -r requirements.txt && .\venv\Scripts\python.exe -m uvicorn main:app --reload"

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd /d %~dp0smart-study-hub && npm run dev"

echo Both servers are starting in separate windows.
