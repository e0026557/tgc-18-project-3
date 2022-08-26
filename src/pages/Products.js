// *** DEPENDENCIES ***
import React, { useContext, useEffect, useState } from 'react';
import Spinner from '../components/Spinner';
import Button from 'react-bootstrap/Button';
import ProductCard from '../components/ProductCard';

// *** CONTEXTS ***
import ProductsContext from '../contexts/ProductsContext';

export default function Products() {
	// Consume products context
	const productsContext = useContext(ProductsContext);

	// States
	const [query, setQuery] = useState({});
	const [products, setProducts] = useState([]);
	const [contentLoaded, setContentLoaded] = useState(false);

	useEffect(() => {
		(async () => {
			const products = await productsContext.getProducts(query);
			await setProducts(products);
			await setContentLoaded(true);
		})();
	}, [query]);

	return (
		<React.Fragment>
			{/* Hero Section */}
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

				{contentLoaded ? (
					<div className='row'>
						{/* Search Panel */}
						<div className='d-none d-lg-block col-lg-4'>
							<div className='search-box'>
								<h5>Search</h5>

								<div>
									<label className='form-label'></label>
								</div>
							</div>
						</div>
						{/* Product Listing */}
						<div className='col-12 col-lg-8'>
							<div className='row px-5'>
								{products.map((product) => {
									return (
										<div
											key={product.id}
											className='col-12 col-md-6 col-lg-4 d-flex justify-content-center my-3'
										>
											<ProductCard product={product} />
										</div>
									);
								})}
							</div>
						</div>
					</div>
				) : (
					<Spinner />
				)}
			</section>
		</React.Fragment>
	);
}
