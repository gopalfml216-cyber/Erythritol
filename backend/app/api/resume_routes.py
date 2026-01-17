from fastapi import APIRouter, UploadFile, File, HTTPException
# ... imports

router = APIRouter()

# 🚨 CRITICAL CHECK: Does this say "/parse"?
# If it says "/" or "", CHANGE IT TO "/parse"
@router.post("/parse") 
async def parse_resume(file: UploadFile = File(...)):
    # ... your code ...
    return {"name": "Test", "email": "test@test.com", "skills": ["Python"]}