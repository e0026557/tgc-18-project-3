// *** DEPENDENCIES ***
import React from 'react';
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

// *** CONTEXTS ***
import UserContext from '../contexts/UserContext';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';

export default function Navigation() {
	// Consume user context
	const userContext = useContext(UserContext);

	// States
	const [cartItems, setCartItems] = useState([]);
	const [cartLoaded, setCartLoaded] = useState(false);
	const [show, setShow] = useState(false); // For offcanvas

	// Functions
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const getCartItems = async () => {
		setCartLoaded(false);
		handleShow();
		const cartItems = await userContext.getCart();
		setCartItems(cartItems);
		setCartLoaded(true);
	}

	return (
		<React.Fragment>

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
									<Nav.Link onClick={getCartItems}>
										Cart
									</Nav.Link>
									{/* Accounts */}
									<NavDropdown
										title="Account"
									>
										<NavDropdown.Item as={Link} to='/orders'>Orders</NavDropdown.Item>
										<NavDropdown.Divider />
										<NavDropdown.Item onClick={userContext.logoutUser}>
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
					</Navbar.Collapse>
				</Container>
			</Navbar>

			{/* Offcanvas */}
			<Offcanvas show={show} onHide={handleClose} placement="end">
				<Offcanvas.Header closeButton>
					<Offcanvas.Title>
						Cart
					</Offcanvas.Title>
				</Offcanvas.Header>
				<Offcanvas.Body>
					{
						cartLoaded ? (cartItems ? cartItems.map( cartItem => {
							return <li key={cartItem.id}>{cartItem.variant.fountainPen.brand.brand} {cartItem.variant.fountainPen.model}</li>
						}) : '') : <Spinner />
					}
						
				</Offcanvas.Body>
			</Offcanvas>
		</React.Fragment>
	);
}
