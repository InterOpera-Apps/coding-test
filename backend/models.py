from pydantic import BaseModel, EmailStr
from typing import List, Optional


class DealBase(BaseModel):
    client: str
    value: Optional[float] = None  
    status: Optional[str] = None  

class ClientBase(BaseModel):
    name: str
    industry: str
    contact: str

class ClientDealBase(BaseModel):
    client: str
    industry: Optional[str] = None 
    contact: Optional[str] = None
    value: Optional[float] = None  
    status: Optional[str] = None  

class SalesRepBase(BaseModel):
    id: int
    name: str
    role: str
    region: str
    skills: List[str]
    clients: List[ClientBase]
    deals: List[ClientDealBase]

class DealCountBase(BaseModel):
    in_progress: Optional[int] = 0  
    closed_won: Optional[int] = 0  
    closed_lost: Optional[int] = 0  
    
    def to_dict(self):
        return {
            'In Progress': self.in_progress,
            'Closed Won': self.closed_won,
            'Closed Lost': self.closed_lost
        }

class ClientBase(BaseModel):
    name: str
    industry: str
    contact: EmailStr  