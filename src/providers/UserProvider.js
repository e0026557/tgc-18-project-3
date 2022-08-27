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
		getUser: () => {
			return user;
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
				console.log(error.response.data.data);
				toast.error('An error occurred while registering. Please try again');
			}
		},
		loginUser: async (userData) => {
			const response = await axios.post(BASE_API_URL + '/accounts/login', userData);
			const accessToken = response.data.data.accessToken;
			const refreshToken = response.data.data.refreshToken;

			setUser({
				accessToken,
				refreshToken
			});
		}
	};

	return (
		<UserContext.Provider value={userContext}>
			{/* To access child components nested inside ProductsProvider */}
			{props.children}
		</UserContext.Provider>
	);
}
