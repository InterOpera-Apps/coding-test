import json
from pathlib import Path
from models import SalesRepBase, DealCountBase, ClientBase

# Load dummy data
with open("dummyData.json", "r") as f:
    sales_data = json.load(f)

def get_all_sales_reps():
    sales_reps = []
    for rep in sales_data["salesReps"]:
        clients = rep.get("clients", [])
        for deal in rep.get("deals", []):
            matching_deals = [
                client for client in clients if client["name"] == deal["client"]
            ]
            if matching_deals:
                deal["industry"] = matching_deals[0]["industry"]
                deal["contact"] = matching_deals[0]["contact"]
            else:
                deal["industry"] = None
                deal["contact"] = None
        
        sales_rep = SalesRepBase(**rep)
        sales_reps.append(sales_rep)
    
    return sales_reps


def get_sales_rep_by_id(rep_id: int):
    rep = next((rep for rep in sales_data["salesReps"] if rep["id"] == rep_id), None)
    if not rep:
        return None  

    return SalesRepBase(**rep) if rep else None

def get_deal_count_by_id(rep_id: int):
    deal_count_by_status = {}
    rep = next((rep for rep in sales_data["salesReps"] if rep["id"] == rep_id), None)
    if not rep:
        return None  
    deals = rep.get("deals", [])
    for deal in deals:
        status = deal["status"]
        value = deal["value"]
        if status == 'In Progress':
            status_key = 'in_progress'
        elif status == 'Closed Won':
            status_key = 'closed_won'
        elif status == 'Closed Lost':
            status_key = 'closed_lost'
        else:
            continue  
        if status_key in deal_count_by_status:
            deal_count_by_status[status_key] += value
        else:
            deal_count_by_status[status_key] = value
    if deal_count_by_status:
        return DealCountBase(**deal_count_by_status).to_dict()
    else:
        return None

def get_client_by_contact(rep_id: int, contact: str):
    rep = next((rep for rep in sales_data["salesReps"] if rep["id"] == rep_id), None)
    if not rep:
        return None
    clients = rep.get("clients", [])
    for client in clients:
        if client["contact"].lower() == contact.lower():
            return ClientBase(**client)  
    return None

def get_all_deals():
    return [deal for rep in sales_data["salesReps"] for deal in rep["deals"]]

def get_all_clients():
    return [client for rep in sales_data["salesReps"] for client in rep["clients"]]
