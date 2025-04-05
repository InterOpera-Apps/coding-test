import {Navbar, Nav, Container} from "react-bootstrap";
import Link from 'next/link'

export const NavBar = () => {
    return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand>Sales Dashboard</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/ai">Ask AI</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}