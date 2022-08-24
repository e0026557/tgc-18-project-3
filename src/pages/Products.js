// *** DEPENDENCIES ***
import React, { useContext, useEffect, useState } from 'react';
import Spinner from '../components/Spinner';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

// *** CONTEXTS ***
import ProductsContext from '../contexts/ProductsContext';

export default function Products() {
	// Consume products context
	const productsContext = useContext(ProductsContext);

	// States
	const [products, setProducts] = useState([]);
	const [contentLoaded, setContentLoaded] = useState(false);

	useEffect(() => {
		(async () => {
			const products = await productsContext.getProducts();
			await setProducts(products);
			await setContentLoaded(true);
		})();
	}, []);

	return (
		<React.Fragment>
			<section className='container-fluid section-hero adjust-margin-top'>
				<div className='hero-text-box'>
					<h1 className='hero-heading'>InkStone</h1>
					<p className='hero-description'>Elegance in writing</p>
					<Button
						href='#section-products'
						className='btn-cta btn-hero mt-2 mt-lg-3'
					>
						Shop Now
					</Button>
				</div>
			</section>

			<section
				className='container section-products pt-5'
				id='section-products'
			>
				<h1>Products</h1>
				{contentLoaded ? <h1>products listing</h1> : <Spinner />}
				{/* <ul>
				{products.map((product) => {
					return (
						<li>
							{product.brand.brand} {product.model}
						</li>
					);
				})}
			</ul> */}
			</section>
		</React.Fragment>
	);
}
