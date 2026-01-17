import asyncio
from pathlib import Path
from app.services.parser_service import ResumeParser

async def test_parser():
    """Quick manual test"""
    parser = ResumeParser()
    
    # Test with a PDF file
    test_file = Path("test_resume.pdf")  # Put a test PDF here
    
    if not test_file.exists():
        print("❌ Create test_resume.pdf in backend/ folder")
        return
    
    with open(test_file, "rb") as f:
        file_bytes = f.read()
    
    result = await parser.parse(file_bytes)
    
    print("\n" + "="*50)
    print("✅ PARSED RESUME:")
    print("="*50)
    print(f"Name: {result['name']}")
    print(f"Email: {result['email']}")
    print(f"Phone: {result['phone']}")
    print(f"Skills ({len(result['skills'])}): {', '.join(result['skills'][:10])}")
    print(f"\nConfidence Scores:")
    for field, score in result['confidence_scores'].items():
        print(f"  {field}: {int(score * 100)}%")
    print("="*50)

if __name__ == "__main__":
    asyncio.run(test_parser())