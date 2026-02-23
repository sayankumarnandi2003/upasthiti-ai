@echo off
echo Starting Upasthiti Backend Server...
set PYTHONPATH=.\vendor
python -m uvicorn main:app --reload
pause
