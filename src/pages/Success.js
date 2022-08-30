import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Success() {

	const navigateTo = useNavigate();

	useEffect(() => {
		setTimeout(() => {
			navigateTo("/");
		}, 3000);
	}, []);

	return (
		<React.Fragment>
			<div className='container d-flex flex-column justify-content-center align-items-center adjust-margin-top pt-5'>
				<h3>Checkout success</h3>
				<p>Redirecting ...</p>
			</div>
		</React.Fragment>
	);
}
