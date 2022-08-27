import React, { useState, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import UserContext from '../contexts/UserContext';

export default function Login(props) {
	// Consume user context
	const userContext = useContext(UserContext);

	// States
	const [errors, setErrors] = useState([]);
	const [formFields, setFormFields] = useState({
		username: '',
		password: ''
	});

	// --- FUNCTIONS ---
	const updateFormFields = (event) => {
		setFormFields({
			...formFields,
			[event.target.name]: event.target.value
		});
	};

	const loginUser = async () => {
		const result = await userContext.loginUser(formFields);
		if (!result) {
			setErrors(['error']);
		}
	};

	return (
		<React.Fragment>
			<section className='container-fluid section-login adjust-margin-top'>
				<div className='container container-login py-4 py-lg-5'>
					<h1>Login</h1>

					{/* Login Form */}
					<div className='form-login row mt-3 mt-md-4 px-2 py-3 px-md-3 py-md-4 px-lg-4'>
						{/* Username */}
						<Form.Group className='col-12 mb-2 mb-md-3'>
							<Form.Label>Username</Form.Label>
							<Form.Control
								type='text'
								name='username'
								value={formFields.username}
								onChange={updateFormFields}
							/>
						</Form.Group>
						{/* Password */}
						<Form.Group className='mb-2 mb-md-3'>
							<Form.Label>Password</Form.Label>
							<Form.Control
								type='password'
								name='password'
								value={formFields.password}
								onChange={updateFormFields}
							/>
							{errors.includes('error') ? (
								<Form.Text className='error'>
									Invalid username and/or password
								</Form.Text>
							) : (
								''
							)}
						</Form.Group>

						<div className='d-flex justify-content-center mt-3 mt-md-4'>
							{/* Login Button */}
							<Button variant='primary' onClick={loginUser}>
								Login
							</Button>
						</div>
					</div>
				</div>
			</section>
		</React.Fragment>
	);
}
