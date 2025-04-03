from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import uvicorn
import json
import time

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define Models
class Deal(BaseModel):
    client: str
    value: int
    status: str

class Client(BaseModel):
    name: str
    industry: str
    contact: str

class SalesRep(BaseModel):
    id: int
    name: str
    role: str
    region: str
    skills: List[str]
    deals: List[Deal]
    clients: List[Client]

class SalesList(BaseModel):
    id: int
    name: str
    role: str
    region: str
    total_deals: int
    total_lost: int
    total_progress: int
    total_won: int

# Load dummy data
with open("dummyData.json", "r") as f:
    DUMMY_DATA = json.load(f)

@app.get("/api/sales", response_model=List[SalesList])
def get_list_of_sales():
    """
    Retrieve the list of sales
    """
    time.sleep(1)
    sales_list = []
    if len(DUMMY_DATA.get("salesReps", [])) == 0:
        return sales_list
    
    for sales_rep in DUMMY_DATA["salesReps"]:
        total_lost = 0;
        total_progress = 0;
        total_won = 0;
        
        total_deals = len(sales_rep.get("deals", []))
        if total_deals > 0:
            for deal in sales_rep["deals"]:
                if deal["status"] == "Closed Lost":
                    total_lost += 1
                elif deal["status"] == "In Progress":
                    total_progress += 1
                elif deal["status"] == "Closed Won":
                    total_won += 1

        sales_list.append(SalesList(
            id = sales_rep["id"],
            name = sales_rep["name"],
            role = sales_rep["role"],
            region = sales_rep["region"],
            total_deals = total_deals,
            total_lost = total_lost,
            total_progress = total_progress,
            total_won = total_won
        ))
    return sales_list

@app.get("/api/sales/{sales_id}", response_model=SalesRep)
def get_detail_of_sales(sales_id: int):
    """
    Retrieve a specific sales rep by ID
    """
    if len(DUMMY_DATA.get("salesReps", [])) == 0:
        raise HTTPException(status_code=404, detail="Sales representatives not found")
    
    for sales_rep in DUMMY_DATA["salesReps"]:
        if sales_rep["id"] == sales_id:
            return sales_rep
    raise HTTPException(status_code=404, detail="Sales representative not found")

@app.post("/api/ai")
async def ai_endpoint(request: Request):
    """
    Accepts a user question and returns a placeholder AI response.
    (Optionally integrate a real AI model or external service here.)
    """
    body = await request.json()
    user_question = body.get("question", "")
    
    # Placeholder logic: echo the question or generate a simple response
    # Replace with real AI logic as desired (e.g., call to an LLM).
    return {"answer": f"This is a placeholder answer to your question: {user_question}"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
