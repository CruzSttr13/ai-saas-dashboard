from fastapi import APIRouter, HTTPException
from groq import Groq # Cambiamos la librería
from app.core.config import settings

router = APIRouter()
client = Groq(api_key=settings.GROQ_API_KEY) # Usamos el cliente de Groq

@router.post("/chat")
async def chat_with_ai(prompt: str):
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile", 
            messages=[{"role": "user", "content": prompt}]
        )
        
        ai_message = response.choices[0].message.content
        return {"response": ai_message}
        
    except Exception as e:
        print(f"DEBUG ERROR GROQ: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/code")
async def code_generation(prompt: str):
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile", 
            messages=[
                {"role": "system", "content": "You are a code generator. You must answer only in markdown code snippets. Use concise explanations."},
                {"role": "user", "content": prompt}
            ]
        )
        
        ai_message = response.choices[0].message.content
        return {"response": ai_message}
        
    except Exception as e:
        print(f"DEBUG ERROR GROQ: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))