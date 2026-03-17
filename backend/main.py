from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from rembg import remove
from PIL import Image
import io
import os
import uuid
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="Image Tools API", version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
MAX_FILE_SIZE = int(os.getenv("MAX_FILE_SIZE", 10 * 1024 * 1024))  # 10MB default
UPLOAD_DIR = Path(os.getenv("UPLOAD_DIR", "uploads"))
UPLOAD_DIR.mkdir(exist_ok=True)

# Supported image formats
SUPPORTED_FORMATS = {'.jpg', '.jpeg', '.png', '.webp', '.bmp'}

def validate_image(file: UploadFile):
    """Validate uploaded image file"""
    # Check file extension
    ext = Path(file.filename).suffix.lower()
    if ext not in SUPPORTED_FORMATS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported format. Supported formats: {', '.join(SUPPORTED_FORMATS)}"
        )

@app.get("/")
async def root():
    return {
        "message": "Image Tools API",
        "version": "1.0.0",
        "features": ["remove-background", "remove-watermark (coming soon)"]
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/api/remove-background")
async def remove_background(file: UploadFile = File(...)):
    """Remove background from image using AI"""
    try:
        # Validate file
        validate_image(file)
        
        # Read image
        image_bytes = await file.read()
        
        # Check file size
        if len(image_bytes) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"File too large. Maximum size: {MAX_FILE_SIZE / 1024 / 1024:.1f}MB"
            )
        
        # Open image
        input_image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB if needed
        if input_image.mode in ('RGBA', 'P'):
            input_image = input_image.convert('RGBA')
        elif input_image.mode != 'RGB':
            input_image = input_image.convert('RGB')
        
        # Remove background
        output_image = remove(input_image)
        
        # Save output
        output_id = str(uuid.uuid4())
        output_path = UPLOAD_DIR / f"{output_id}.png"
        
        # Optimize PNG
        output_image.save(output_path, format="PNG", optimize=True)
        
        return {
            "success": True,
            "output_id": output_id,
            "message": "背景移除成功！",
            "filename": file.filename
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"处理失败: {str(e)}")

@app.post("/api/remove-watermark")
async def remove_watermark(file: UploadFile = File(...)):
    """Remove watermark from image (LaMa integration coming soon)"""
    try:
        # Validate file
        validate_image(file)
        
        # Read image
        image_bytes = await file.read()
        
        # Check file size
        if len(image_bytes) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"File too large. Maximum size: {MAX_FILE_SIZE / 1024 / 1024:.1f}MB"
            )
        
        # Open image
        input_image = Image.open(io.BytesIO(image_bytes))
        
        # TODO: Integrate LaMa model here
        # For now, just return the original image with a note
        output_id = str(uuid.uuid4())
        output_path = UPLOAD_DIR / f"{output_id}.png"
        
        input_image.save(output_path, format="PNG", optimize=True)
        
        return {
            "success": True,
            "output_id": output_id,
            "message": "去水印功能开发中，敬请期待！(LaMa 模型集成中)",
            "note": "This is a placeholder. Full LaMa integration coming soon.",
            "filename": file.filename
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"处理失败: {str(e)}")

@app.get("/api/output/{output_id}")
async def get_output(output_id: str):
    """Get processed image"""
    # Validate output_id to prevent path traversal
    if not output_id or not all(c.isalnum() or c in '-_' for c in output_id):
        raise HTTPException(status_code=400, detail="Invalid output ID")
    
    output_path = UPLOAD_DIR / f"{output_id}.png"
    if not output_path.exists():
        raise HTTPException(status_code=404, detail="Output not found")
    
    return FileResponse(
        output_path,
        media_type="image/png",
        filename=f"processed-{output_id[:8]}.png"
    )

@app.delete("/api/output/{output_id}")
async def delete_output(output_id: str):
    """Delete processed image"""
    # Validate output_id
    if not output_id or not all(c.isalnum() or c in '-_' for c in output_id):
        raise HTTPException(status_code=400, detail="Invalid output ID")
    
    output_path = UPLOAD_DIR / f"{output_id}.png"
    if output_path.exists():
        output_path.unlink()
        return {"success": True, "message": "Output deleted"}
    return {"success": False, "message": "Output not found"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run(app, host=host, port=port)
