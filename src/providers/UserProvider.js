// *** DEPENDENCIES ***
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// *** CONTEXTS ***
import UserContext from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const BASE_API_URL = 'https://inkstone-express.herokuapp.com/api';

export default function UserProvider(props) {
	// States
	// const [user, setUser] = useState({});
	const [redirectTo, setRedirectTo] = useState('');

	const navigateTo = useNavigate();

	// useEffect(() => {
	// 	if (!user.accessToken || !user.refreshToken) {
	// 		// Retrieve stored tokens from local storage (if any)
	// 		const accessToken = JSON.parse(localStorage.getItem('accessToken'));
	// 		const refreshToken = JSON.parse(localStorage.getItem('refreshToken'));

	// 		if (accessToken && refreshToken) {
	// 			setUser({
	// 				accessToken,
	// 				refreshToken
	// 			});
	// 		}
	// 	}
	// }, []);

	// User context
	const userContext = {
		isUsernameTaken: async (username) => {
			const response = await axios.get(BASE_API_URL + '/accounts/username_taken', {
				params: {
					username
				}
			});

			const result = response.data.data.message;

			if (result === 'not available') {
				return true;
			}
			else {
				return false;
			}
		},
		checkIfAuthenticated: () => {
			if (JSON.parse(localStorage.getItem('accessToken')) && JSON.parse(localStorage.getItem('refreshToken'))) {
				return true;
			}
			return false;
		},
		registerUser: async (userData) => {
			try {
				const response = await axios.post(BASE_API_URL + '/accounts/register', userData);
				const status = response.data.status;
				if (status === 'success') {
					toast.success('Account registered successfully');

					const loginCredentials = {
						username: userData.username,
						password: userData.password
					};

					// Log in new user
					await userContext.loginUser(loginCredentials);

					// Redirect to home page
					navigateTo('/');
				}
			} catch (error) {
				console.log(error);
				toast.error('An error occurred while registering. Please try again');
			}
		},
		loginUser: async (userData) => {
			try {
				const response = await axios.post(BASE_API_URL + '/accounts/login', userData);

				const accessToken = response.data.data.accessToken;
				const refreshToken = response.data.data.refreshToken;

				localStorage.setItem('accessToken', JSON.stringify(accessToken));
				localStorage.setItem('refreshToken', JSON.stringify(refreshToken));

				// setUser({
				// 	accessToken,
				// 	refreshToken
				// });

				// Redirect to home page or intended route
				if (redirectTo) {
					navigateTo(redirectTo);
					setRedirectTo('');
				}
				else {
					navigateTo('/');
				}
				return true;

			} catch (error) {
				console.log(error);
				if (error.response.data.status === 'fail') {
					toast.error('Invalid username and/or password');
				}
				else {
					toast.error('An error occurred while logging in. Please try again');
				}
			}
		},
		logoutUser: async () => {
			try {
				await axios.post(BASE_API_URL + '/accounts/logout', {
					refreshToken: JSON.parse(localStorage.getItem('refreshToken'))
				}, {
					headers: {
						Authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`
					}
				});

				// Clear state
				// setUser({});
				localStorage.removeItem('accessToken');
				localStorage.removeItem('refreshToken');

				toast.success('Logged out successfully');
				navigateTo('/');
			} catch (error) {
				console.log(error);
				toast.error('An error occurred while logging out. Please try again');
			}
		},
		refreshToken: async () => {
			// Attempt to refresh token using current JWT and refresh tokens
			try {
				const response = await axios.post(BASE_API_URL + '/accounts/refresh', {
					refreshToken: JSON.parse(localStorage.getItem('refreshToken'))
				}, {
					headers: {
						Authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`
					}
				});

				const accessToken = response.data.data.accessToken;
				localStorage.setItem('accessToken', JSON.stringify(accessToken));

				// await setUser({
				// 	...user,
				// 	accessToken: accessToken
				// });
				return true; // Indicate success
			}
			// If jwt token has expired or is invalid, redirect to login page
			catch (error) {
				console.log(error);
				await userContext.logoutUser();
				navigateTo('/login');
				return false; // Indicate failure
			}
		},
		addToCart: async (variantId, quantity) => {
			// Check that user is logged in
			if (!userContext.checkIfAuthenticated()) {
				setRedirectTo(`/products/${variantId}/view`);
				toast.error('You must be logged in first');
				navigateTo('/login');
			}
			else {
				try {
					const response = await axios.post(BASE_API_URL + `/cart/${variantId}/add`, {
						quantity: parseInt(quantity)
					}, {
						headers: {
							Authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`
						}
					});

					const result = response.data.status;
					if (result === 'success') {
						toast.success('Item added to cart successfully');
					}
				} catch (error) {
					console.log(error);
					toast.error('An occurred while adding to cart. Please try again');
				}
			}
		},
		getCart: async () => {
			try {
				const response = await axios.get(BASE_API_URL + '/cart', {
					headers: {
						Authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`
					}
				});
				const cart = response.data.data.cartItems;
				return cart;
			} catch (error) {
				console.log(error);
				toast.error('An error occurred while getting cart. Please try again');
			}
		},
		updateCartItem: async (variantId, quantity) => {
			// Attempt to update cart item
			try {
				const response = await axios.put(BASE_API_URL + `/cart/${variantId}/update`, {
					quantity: parseInt(quantity)
				}, {
					headers: {
						Authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`
					}
				});

				const result = response.data.status;
				if (result === 'success') {
					toast.success('Cart item updated successfully');
					return true;
				}

			} catch (error) {
				console.log(error);
				toast.error('An error occurred while updating cart item. Please try again');
				return false; // Indicate failure / error
			}
		},
		deleteCartItem: async (variantId) => {
			// Attempt to delete cart item
			try {
				const response = await axios.delete(BASE_API_URL + `/cart/${variantId}/delete`, {
					headers: {
						Authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`
					}
				});

				const result = response.data.status;
				if (result === 'success') {
					toast.success('Cart item removed successfully');
					return true;
				}

			} catch (error) {
				console.log(error);
				toast.error('An error occurred while deleting cart item. Please try again');
				return false; // Indicate failure / error
			}
		},
		checkout: async () => {
			try {
				// Get user cart
				const cartItems = await userContext.getCart();

				// Check that cart is not empty
				if (!cartItems || !cartItems.length) {
					toast.error('An error occurred while checking out. Please try again');
					return false;
				}

				const response = await axios.get(BASE_API_URL + '/checkout', {
					headers: {
						Authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`
					}
				});

				return response.data.data; // stripe session id and publishable key
			} catch (error) {
				console.log(error);
				toast.error('An error occurred while checking out. Please try again');
				return false;
			}


		}
	};

	return (
		<UserContext.Provider value={userContext}>
			{/* To access child components nested inside ProductsProvider */}
			{props.children}
		</UserContext.Provider>
	);
}
