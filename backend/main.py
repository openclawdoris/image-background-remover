from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from rembg import remove
from PIL import Image
import io
import os
import uuid
from pathlib import Path

app = FastAPI(title="Image Tools API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

@app.get("/")
async def root():
    return {"message": "Image Tools API", "version": "1.0.0"}

@app.post("/api/remove-background")
async def remove_background(file: UploadFile = File(...)):
    """Remove background from image"""
    try:
        # Read image
        image_bytes = await file.read()
        input_image = Image.open(io.BytesIO(image_bytes))
        
        # Remove background
        output_image = remove(input_image)
        
        # Save output
        output_id = str(uuid.uuid4())
        output_path = UPLOAD_DIR / f"{output_id}.png"
        
        output_image.save(output_path, format="PNG")
        
        return {
            "success": True,
            "output_id": output_id,
            "message": "Background removed successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/remove-watermark")
async def remove_watermark(file: UploadFile = File(...)):
    """Remove watermark from image (placeholder - will integrate LaMa)"""
    try:
        # Read image
        image_bytes = await file.read()
        input_image = Image.open(io.BytesIO(image_bytes))
        
        # TODO: Integrate LaMa model here
        # For now, just return the original image with a note
        output_id = str(uuid.uuid4())
        output_path = UPLOAD_DIR / f"{output_id}.png"
        
        input_image.save(output_path, format="PNG")
        
        return {
            "success": True,
            "output_id": output_id,
            "message": "Watermark removal coming soon! (LaMa integration in progress)",
            "note": "This is a placeholder. Full LaMa integration coming soon."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/output/{output_id}")
async def get_output(output_id: str):
    """Get processed image"""
    output_path = UPLOAD_DIR / f"{output_id}.png"
    if not output_path.exists():
        raise HTTPException(status_code=404, detail="Output not found")
    
    return FileResponse(output_path, media_type="image/png")

@app.delete("/api/output/{output_id}")
async def delete_output(output_id: str):
    """Delete processed image"""
    output_path = UPLOAD_DIR / f"{output_id}.png"
    if output_path.exists():
        output_path.unlink()
        return {"success": True, "message": "Output deleted"}
    return {"success": False, "message": "Output not found"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
