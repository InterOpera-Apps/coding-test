import pytest
from fastapi.testclient import TestClient
from main import app, DUMMY_DATA
from unittest.mock import patch
from pydantic import BaseModel

client = TestClient(app)

@pytest.fixture(scope="module")
def dummy_data():
    return {
        "salesReps": [
            {
                "id": 1,
                "name": "John Doe",
                "role": "Sales Executive",
                "region": "North",
                "skills": ["Negotiation", "Presentation"],
                "deals": [
                    {"client": "Client A", "value": 10000, "status": "Closed Won"},
                    {"client": "Client B", "value": 5000, "status": "In Progress"},
                    {"client": "Client C", "value": 2000, "status": "Closed Lost"}
                ],
                "clients": [
                    {"name": "Client A", "industry": "Tech", "contact": "contactA@example.com"},
                    {"name": "Client B", "industry": "Finance", "contact": "contactB@example.com"}
                ]
            },
            {
                "id": 2,
                "name": "Jane Smith",
                "role": "Sales Manager",
                "region": "South",
                "skills": ["Leadership", "Team Management"],
                "deals": [
                    {"client": "Client D", "value": 15000, "status": "Closed Won"},
                    {"client": "Client E", "value": 7000, "status": "In Progress"}
                ],
                "clients": [
                    {"name": "Client D", "industry": "Healthcare", "contact": "contactD@example.com"},
                    {"name": "Client E", "industry": "Retail", "contact": "contactE@example.com"}
                ]
            }
        ]
    }

@pytest.fixture(autouse=True)
def set_dummy_data(monkeypatch, dummy_data):
    monkeypatch.setattr("main.DUMMY_DATA", dummy_data)

@pytest.mark.asyncio
async def test_get_sales_list():
    response = client.get("/api/sales")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["id"] == 1
    assert data[0]["name"] == "John Doe"
    assert data[0]["total_deals"] == 3
    assert data[0]["total_won"] == 1
    assert data[0]["total_progress"] == 1
    assert data[0]["total_lost"] == 1

@pytest.mark.asyncio
async def test_get_sales_list_empty():
    with patch("main.DUMMY_DATA", {}):
        response = client.get("/api/sales")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 0

@pytest.mark.asyncio
async def test_get_sales_detail():
    response = client.get("/api/sales/1")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == 1
    assert data["name"] == "John Doe"
    assert len(data["deals"]) == 3
    assert len(data["clients"]) == 2

@pytest.mark.asyncio
async def test_get_sales_detail_not_found():
    response = client.get("/api/sales/999")
    assert response.status_code == 404
    assert response.json() == {"detail": "Sales representative not found"}

@pytest.mark.asyncio
@patch("main.genai.Client")
async def test_post_ai(mock_client):
    mock_client_instance = mock_client.return_value
    mock_client_instance.models.generate_content.return_value = type('obj', (object,), {'text': 'AI response to your question'})

    ai_request = {"question": "What is the weather today?"}
    response = client.post("/api/ai", json=ai_request)
    assert response.status_code == 200
    data = response.json()
    assert data["answer"] == "AI response to your question"

@pytest.mark.asyncio
@patch("main.genai.Client")
async def test_post_ai_invalid_input(mock_client):
    ai_request = {"question": 123}
    response = client.post("/api/ai", json=ai_request)
    assert response.status_code == 422
