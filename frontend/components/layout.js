import 'bootstrap/dist/css/bootstrap.min.css';
import { NavBar } from './navbar/navbar';
import Container from 'react-bootstrap/Container';
 
export default function Layout({ children }) {
  return (
    <>
      <NavBar />
      <Container>
        <div style={{ padding: "2rem" }}>
          <main>{children}</main>
        </div>
      </Container>
    </>
  )
}