import uvicorn
import json
import openai
import os

from fastapi import FastAPI, Request, Query, HTTPException, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict

from services import get_all_sales_reps, get_sales_rep_by_id, get_deal_count_by_id, \
        get_all_deals, get_all_clients, get_client_by_contact
from logger import LOGGER


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)
# Set OpenAI API Key (ensure to set this in your environment variables)
openai.api_key = os.getenv("OPENAI_API_KEY")


connections: List[WebSocket] = []

@app.websocket("/ws/chat")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connections.append(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            for connection in connections:
                await connection.send_text(data)  
    except Exception as e:
        LOGGER.warning(f"Client disconnected: {e}")
    finally:
        connections.remove(websocket)

@app.get("/api/sales-reps", response_model=Dict)
def get_sales_reps(page: int = Query(1, alias="page", ge=1), limit: int = Query(5, alias="limit", ge=1)):
    all_sales_data = get_all_sales_reps()
    sales_reps_dict = [sales_rep.dict() for sales_rep in all_sales_data]

    # Implement pagination
    start_idx = (page - 1) * limit
    end_idx = start_idx + limit
    paginated_data = sales_reps_dict[start_idx:end_idx]
    return {
        "sales_reps": paginated_data,
        "total": len(sales_reps_dict),
        "page": page,
        "limit": limit
    }

@app.get("/api/sales-reps/{rep_id}")
def get_sales_rep(rep_id: str):
    if not rep_id.isdigit():
        LOGGER.warning(f"Invalid sales representative ID format.")
        raise HTTPException(status_code=400, detail="Invalid sales representative ID format.")
    rep_id = int(rep_id)
    rep = get_sales_rep_by_id(rep_id)
    if rep is None:
        LOGGER.warning(f"Sales representative not found")
        raise HTTPException(status_code=400, detail="Sales representative not found")
    return rep

@app.get("/api/deal-count/{rep_id}")
def get_deal_count_sales(rep_id: str):
    rep_id = int(rep_id)
    rep = get_deal_count_by_id(rep_id)
    if rep is None:
        LOGGER.warning(f"Sales representative not found")
        return {"error": "Sales representative not found"}
    return rep

@app.get("/api/deals")
def get_deals():
    return get_all_deals()

@app.get("/api/clients")
def get_clients():
    return get_all_clients()

@app.get("/api/clients/{rep_id}/{contact}")
def read_client(rep_id: int, contact: str):
    client = get_client_by_contact(rep_id, contact)
    if client is None:
        LOGGER.warning(f"Client not found")
        return {"error": "Client not found"}
    return client

@app.post("/api/ai")
async def ai_endpoint(request: Request):
    body = await request.json()
    user_question = body.get("question", "")
    
    if not user_question:
        LOGGER.warning(f"Question is required")
        return {"error": "Question is required"}
    
    # Retrieve sales data
    sales_reps = get_all_sales_reps()
    deals = get_all_deals()
    clients = get_all_clients()
    
    # Format data for AI context
    context_data = {
        "sales_reps": [
            {"name": rep.name, "region": rep.region, "skills": rep.skills} for rep in sales_reps
        ],
        "deals": deals,
        "clients": clients
    }
    
    context_str = json.dumps(context_data, indent=2)
    
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an AI assistant with knowledge of sales data."},
                {"role": "system", "content": f"Here is the sales data you can reference: {context_str}"},
                {"role": "user", "content": user_question}
            ]
        )
        answer = response["choices"][0]["message"]["content"]
    except Exception as e:
        LOGGER.warning(f"error: {e}")
        return {"error": str(e)}
    
    return {"answer": answer}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)