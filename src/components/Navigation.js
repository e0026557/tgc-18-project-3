// *** DEPENDENCIES ***
import React, { useEffect } from 'react';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import CartItem from './CartItem';
import Spinner from '../components/Spinner';

// *** CONTEXTS ***
import UserContext from '../contexts/UserContext';

export default function Navigation() {
	// Consume user context
	const userContext = useContext(UserContext);

	// States
	const [reload, setReload] = useState(false); // Triggered by cart item 
	const [cartItems, setCartItems] = useState([]);
	const [cartLoaded, setCartLoaded] = useState(false);
	const [show, setShow] = useState(false); // For offcanvas

	const navigateTo = useNavigate();

	useEffect(() => {
		(async () => {
			if (reload) {
				// Get cart (reload)
				setCartLoaded(false); // Trigger spinner animation

				// Refresh token
				const valid = await userContext.refreshToken();

				if (!valid) {
					setShow(false); // Close cart offcanvas if open
				}

				const cartItems = await userContext.getCart();
				setCartItems(cartItems);
				setCartLoaded(true);
				setReload(false);
			}
		})();
	}, [reload]);

	// Functions
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const getCartItems = async () => {
		setCartLoaded(false);
		// Refresh token
		const valid = await userContext.refreshToken();
		if (!valid) {
			return;
		}
		handleShow();

		const cartItems = await userContext.getCart();
		setCartItems(cartItems);
		setCartLoaded(true);
	}

	const renderCartItems = () => {
		if (cartItems.length) {
			return (
				<ListGroup variant="flush">
					{
						cartItems.map(cartItem => {
							return <CartItem key={cartItem.id} cartItem={cartItem} reloadCart={reloadCart} />
						})
					}
				</ListGroup>
			)
		}
		else {
			return (
				<div className='container mt-4'>
					<h5>There are no items in your cart</h5>
				</div>
			)
		}
	}

	const reloadCart = () => {
		setReload(true);
	}

	const checkout = () => {
		setShow(false); // Close cart offcanvas
		navigateTo('/checkout')
	}

	return (
		<React.Fragment>

			<Navbar bg='light' expand='lg' fixed='top' collapseOnSelect={true}>
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
									<Nav.Link eventKey="1" onClick={getCartItems}>
										Cart
									</Nav.Link>
									{/* Accounts */}
									<NavDropdown
										title="Account"
									>
										<NavDropdown.Item eventKey="2" as={Link} to='/orders'>Orders</NavDropdown.Item>
										<NavDropdown.Divider />
										<NavDropdown.Item eventKey="3" onClick={userContext.logoutUser}>
											Logout
										</NavDropdown.Item>
									</NavDropdown>
								</Nav>) : (
								// If user is not logged in
								<Nav className='ms-auto'>
									<Nav.Link eventKey="4" as={Link} to='/login'>
										Login
									</Nav.Link>
									<Nav.Link eventKey="5" as={Link} to='/register'>
										Register
									</Nav.Link>
								</Nav>)
						}
					</Navbar.Collapse>
				</Container>
			</Navbar>

			{/* Offcanvas (Cart) */}
			<Offcanvas show={show} onHide={handleClose} placement="end">
				<Offcanvas.Header closeButton>
					<Offcanvas.Title>
						Cart
					</Offcanvas.Title>
				</Offcanvas.Header>
				<Offcanvas.Body>
					{
						cartLoaded ? renderCartItems() : <Spinner />
					}

					{/* Checkout */}
					{
						cartLoaded && cartItems.length ? (<div className='d-flex justify-content-center mt-4'>
							<Button variant="primary" onClick={checkout}>Checkout</Button>
						</div>) : ''
					}

				</Offcanvas.Body>
			</Offcanvas>
		</React.Fragment>
	);
}
