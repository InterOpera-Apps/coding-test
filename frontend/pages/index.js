import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";

import { useState, useEffect, useMemo } from "react";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/api/sales")
      .then((res) => {
        if (!res.ok) {
          setLoading(false)
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json()
      })
      .then((data) => {
        setUsers(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch data:", err);
        setLoading(false);
      });
  }, []);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getClassNamesFor = (name) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  // sorting
  const sortedUsers = useMemo(() => {
    let sortableUsers = [...users];
    if (sortConfig !== null) {
      sortableUsers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableUsers;
  }, [users, sortConfig]);

  // search
  const filteredUsers = sortedUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
        <h4>Sales Data</h4>
       
        <Row>
          <Col>
            <InputGroup size="sm" className="mb-1">
            <InputGroup.Text id="basic-addon1">Search</InputGroup.Text>
              <Form.Control
                placeholder="By Name"
                aria-label="By Name"
                aria-describedby="basic-addon1"
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ padding: "0.5rem", width: "300px" }}
              />
            </InputGroup>
          </Col>
          <Col></Col>
          <Col></Col>
        </Row>

        {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>No</th>
                <th>Name</th>
                <th>Role</th>
                <th>Region</th>
                <th onClick={() => requestSort('total_deals')} className={getClassNamesFor('total_deals')}>
                  Total Projects
                  {sortConfig.key === 'total_deals' ? (
                    sortConfig.direction === 'ascending' ? <FaSortUp style={{ float: 'right' }} /> : <FaSortDown style={{ float: 'right' }} />
                  ) : (
                    <FaSort style={{ float: 'right' }}/>
                  )}
                </th>
                <th>Won</th>
                <th>In Progress</th>
                <th>Lost</th>
                <th>Action</th>
              </tr>
            </thead>
            
            <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user.id}>
                <td>{index+1}</td>
                <td>{user.name}</td>
                <td>{user.role}</td>
                <td>{user.region}</td>
                <td>{user.total_deals}</td>
                <td style={{ color: 'green' }}>{user.total_won}</td>
                <td style={{ color: 'orange' }}>{user.total_progress}</td>
                <td style={{ color: 'red' }}>{user.total_lost}</td>
                <td>
                  <Nav.Link href={`/sales/${user.id}`} style={{ cursor: 'pointer', color: 'blue' }}>Detail</Nav.Link>
                </td>
              </tr>
              ))}
            </tbody>
          </Table>
        )}
    </>
  );
}
