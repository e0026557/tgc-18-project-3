// *** DEPENDENCIES ***
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

// *** CONTEXTS ***
import UserContext from '../contexts/UserContext';
export default function Navigation() {
	// Consume user context
	const userContext = useContext(UserContext);

	return (
		<Navbar bg='light' expand='lg' fixed='top' collapseOnSelect>
			<Container className='d-flex align-items-center'>
				<Navbar.Brand className='logo' as={Link} to='/'>
					InkStone
				</Navbar.Brand>
				<Navbar.Toggle
					children={
						<FontAwesomeIcon
							className='navbar-toggle-icon'
							icon={faBars}
						/>
					}
					aria-controls='basic-navbar-nav'
				/>
				<Navbar.Collapse id='basic-navbar-nav'>

					{
						userContext.checkIfAuthenticated() ? (
							// If user is logged in
							<Nav className='ms-auto'>
								{/* Shopping cart */}
								<Nav.Link as={Link} to='/cart'>
									Cart
								</Nav.Link>
								{/* Accounts */}
								<NavDropdown
									title="Account"
								>
									<NavDropdown.Item as={Link} to='/orders'>Orders</NavDropdown.Item>
									<NavDropdown.Divider />
									<NavDropdown.Item as={Link} to='/logout'>
										Logout
									</NavDropdown.Item>
								</NavDropdown>
							</Nav>) : (
							// If user is not logged in
							<Nav className='ms-auto'>
								<Nav.Link as={Link} to='/login'>
									Login
								</Nav.Link>
								<Nav.Link as={Link} to='/register'>
									Register
								</Nav.Link>
							</Nav>)
					}
					{/* <Nav className='ms-auto'>
						<Nav.Link as={Link} to='/login'>
							Login
						</Nav.Link>
						<Nav.Link as={Link} to='/register'>
							Register
						</Nav.Link>
					</Nav> */}
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}
