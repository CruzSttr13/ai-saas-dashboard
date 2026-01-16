from fastapi import APIRouter, Query
import random

router = APIRouter()

@router.get("/generate")
async def generate_image(
    prompt: str = Query(..., description="Descripción de la imagen a generar")
):
    import urllib.parse
    
    # Generamos un número aleatorio para que la imagen sea única cada vez
    seed = random.randint(1, 999999)
    
    # Formato: https://image.pollinations.ai/prompt/{encoded_prompt}?width=1024&height=1024&seed={seed}&model=turbo
    encoded_prompt = urllib.parse.quote(prompt)
    image_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=1024&height=1024&seed={seed}&nologo=true&model=turbo"
    
    return {
        "url": image_url,
        "prompt": prompt,
        "seed": seed
    }