import { useRouter } from 'next/router'
import { useState, useEffect } from "react";

import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from "react-bootstrap/Table";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default function Page() {  
  const router = useRouter();
  const { id } = router.query; 
  const [user, setUser] = useState([]);
  const [deals, setDeals] = useState([]);
  const [clients, setClients] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  
  async function fetchData (id) {
    const response = await fetch(`http://localhost:8000/api/sales/${id}`)
    const data = await response.json()
    if (response.ok) {
      setUser(data)
      setDeals(data.deals)
      setClients(data.clients)
    } else {
      setError(data.detail)
    }
  }

  useEffect(()=> {
    if (id) {
      try {
        fetchData(id);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      }
    }
  }, [id]);

  const handleClientClick = async (clientName) => {
    const filteredClients = clients.filter(client =>
      client.name.toLowerCase().includes(clientName.toLowerCase())
    );
    
    const clientDetails = {
      name: clientName,
      industry: filteredClients[0] ? filteredClients[0].industry : "-",
      contact: filteredClients[0] ? filteredClients[0].contact : "-",
    };

    setSelectedClient(clientDetails);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedClient(null);
  };

  return (
    <>
      {error ? (
        <Card>
          <Card.Header>Error Message</Card.Header>
          <Card.Body>
            <Card.Title>
              <div style={{ color: "red" }} >
              {error}
              </div>
            </Card.Title>
          </Card.Body>
        </Card>
      ):(
        <Card>
          <Card.Header>Sales Profile</Card.Header>
          <Card.Body>
              <Row>
                <Col xs={1}>Name:</Col>
                <Col xs={1}>{user.name}</Col>
              </Row>
              <br></br>
              <Row>
                <Col xs={1}>Role:</Col>
                <Col xs={7}>{user.role}</Col>
              </Row>
              <br></br>
              <Row>
                <Col xs={1}>Region:</Col>
                <Col xs={7}>{user.region}</Col>
              </Row>
              <br></br>
              <Row>
                <Col xs={1}>Project:</Col>
                <Col>
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Client</th>
                        <th>Value</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    
                    <tbody>
                    {
                      deals.map((deal, index) => (
                      <tr key={index}>
                        <td>{index+1}</td>
                        <td onClick={() => handleClientClick(deal.client)} style={{ cursor: 'pointer', color: 'blue' }}>
                            {deal.client}
                        </td>
                        <td>{deal.value}</td>
                        <td>{deal.status}</td>
                      </tr>
                      ))}
                    </tbody>
                  </Table>
                </Col>
              </Row>
          </Card.Body>
        </Card>
      )}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Client Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedClient && (
            <>
              <Row>
                <Col xs={4}>Name:</Col>
                <Col xs={8}>{selectedClient.name}</Col>
              </Row>
              <Row>
                <Col xs={4}>Industry:</Col>
                <Col xs={8}>{selectedClient.industry}</Col>
              </Row>
              <Row>
                <Col xs={4}>Contact:</Col>
                <Col xs={8}>{selectedClient.contact}</Col>
              </Row>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
