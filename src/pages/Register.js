// *** DEPENDENCIES ***
import React, { useContext, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {
	validateContactNumber,
	validateEmail,
	validatePassword
} from '../utilities';

// *** CONTEXTS ***
import UserContext from '../contexts/UserContext';

export default function Register(props) {
	// Consume user context
	const userContext = useContext(UserContext);

	// States
	const [errors, setErrors] = useState([]);
	const [formFields, setFormFields] = useState({
		name: '',
		username: '',
		email: '',
		password: '',
		confirm_password: '',
		contact_number: ''
	});

	// --- FUNCTIONS ---
	const updateFormFields = (event) => {
		setFormFields({
			...formFields,
			[event.target.name]: event.target.value
		});
	};

	const validateFormFields = async () => {
		const errors = [];

		// Check that name is at least 3 char and not more than 100 char
		if (formFields.name.length < 3 || formFields.name.length > 100) {
			errors.push('name');
		}

		// Check that username is at least 3 char and not more than 100 char and has no spaces
		if (
			formFields.username.length < 3 ||
			formFields.username.length > 100 ||
			formFields.username.includes(' ')
		) {
			errors.push('username');
		}
		// Check that username is not taken
		else if (await userContext.isUsernameTaken(formFields.username)) {
			errors.push('not_available');
		}

		// Check that email is valid
		if (!validateEmail(formFields.email)) {
			errors.push('email');
		}

		// Check that password is valid
		if (!validatePassword(formFields.password)) {
			errors.push('password');
		}

		// Check that confirm password matches password
		if (formFields.confirm_password !== formFields.password) {
			errors.push('confirm_password');
		}

		// Check that contact number does not contain any alphabets
		if (!validateContactNumber(formFields.contact_number)) {
			errors.push('contact_number');
		}

		// Set state
		setErrors(errors);
		return errors;
	};

	const registerUser = async () => {
		// Validate form fields before registering user
		const errors = await validateFormFields();
		if (errors.length) {
			return;
		}

		const userData = {
			name: formFields.name,
			username: formFields.username,
			email: formFields.email,
			password: formFields.password,
			contact_number: formFields.contact_number
		};

		await userContext.registerUser(userData);
	};

	return (
		<React.Fragment>
			<section className='container-fluid section-register adjust-margin-top'>
				<div className='container'>
					<h1>Register</h1>

					{/* Register Form */}
					<div className='row'>
						{/* Name */}
						<Form.Group className='mb-3'>
							<Form.Label>Name</Form.Label>
							<Form.Control
								type='text'
								name='name'
								value={formFields.name}
								onChange={updateFormFields}
								placeholder='Eg. John Smith'
							/>
							{errors.includes('name') ? (
								<Form.Text className='error'>
									Name must be between 3 to 100 characters
									long
								</Form.Text>
							) : (
								''
							)}
						</Form.Group>
						{/* Username */}
						<Form.Group className='mb-3'>
							<Form.Label>Username</Form.Label>
							<Form.Control
								type='text'
								name='username'
								value={formFields.username}
								onChange={updateFormFields}
							/>
							{errors.includes('username') ? (
								<Form.Text className='error'>
									Username must be between 3 to 100 characters
									long
								</Form.Text>
							) : (
								''
							)}
							{errors.includes('not_available') ? (
								<Form.Text className='error'>
									Username is already taken
								</Form.Text>
							) : (
								''
							)}
						</Form.Group>
						{/* Email */}
						<Form.Group className='mb-3'>
							<Form.Label>Email</Form.Label>
							<Form.Control
								type='email'
								name='email'
								placeholder='Eg. john_smith@gmail.com'
								value={formFields.email}
								onChange={updateFormFields}
							/>
							{errors.includes('email') ? (
								<Form.Text className='error'>
									Invalid email address
								</Form.Text>
							) : (
								''
							)}
						</Form.Group>
						{/* Password */}
						<Form.Group className='mb-3'>
							<Form.Label>Password</Form.Label>
							<Form.Control
								type='password'
								name='password'
								value={formFields.password}
								onChange={updateFormFields}
							/>
							{errors.includes('password') ? (
								<Form.Text className='error'>
									Password must be between 3 to 100 characters
									long
								</Form.Text>
							) : (
								''
							)}
						</Form.Group>
						{/* Confirm Password */}
						<Form.Group className='mb-3'>
							<Form.Label>Confirm Password</Form.Label>
							<Form.Control
								type='password'
								name='confirm_password'
								value={formFields.confirm_password}
								onChange={updateFormFields}
							/>
							{errors.includes('confirm_password') ? (
								<Form.Text className='error'>
									Passwords do not match
								</Form.Text>
							) : (
								''
							)}
						</Form.Group>
						{/* Contact Number */}
						<Form.Group className='mb-3'>
							<Form.Label>Contact Number</Form.Label>
							<Form.Control
								type='text'
								name='contact_number'
								value={formFields.contact_number}
								onChange={updateFormFields}
							/>
							{errors.includes('contact_number') ? (
								<Form.Text className='error'>
									Invalid contact number
								</Form.Text>
							) : (
								''
							)}
						</Form.Group>
						<Button
							variant='primary'
							className='mt-3'
							onClick={registerUser}
						>
							Register
						</Button>
					</div>
				</div>
			</section>
		</React.Fragment>
	);
}
