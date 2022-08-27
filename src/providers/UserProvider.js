// *** DEPENDENCIES ***
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// *** CONTEXTS ***
import UserContext from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const BASE_API_URL = 'https://inkstone-express.herokuapp.com/api';

export default function UserProvider(props) {
	// States
	const [user, setUser] = useState({});

	const navigateTo = useNavigate();

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
			if (user.accessToken && user.refreshToken) {
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

				setUser({
					accessToken: response.data.data.accessToken,
					refreshToken: response.data.data.refreshToken
				});

				// Redirect to home page
				navigateTo('/');
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
					refreshToken: user.refreshToken
				}, {
					headers: {
						Authorization: `Bearer ${user.accessToken}`
					}
				});

				// Clear state
				setUser({});

				toast.success('Logged out successfully');
				navigateTo('/');
			} catch (error) {
				console.log(error);
				toast.error('An error occurred while logging out. Please try again');
			}
		},
		refreshToken: async () => {
			// Check if jwt token has expired or not

			// If jwt token has expired, redirect to login page

			// Else refresh tokens
		}
	};

	return (
		<UserContext.Provider value={userContext}>
			{/* To access child components nested inside ProductsProvider */}
			{props.children}
		</UserContext.Provider>
	);
}
