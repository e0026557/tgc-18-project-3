// *** DEPENDENCIES ***
import React, { useContext, useEffect, useState } from 'react';

// *** CONTEXTS ***
import ProductsContext from '../contexts/ProductsContext';

export default function Products() {
	const productsContext = useContext(ProductsContext);
	const products = productsContext.getProducts();
	console.log(products);

	return (
		<React.Fragment>
			<h1>Products</h1>
			<ul>
				{products.map((product) => {
					return (
						<li>
							{product.brand.brand} {product.model}
						</li>
					);
				})}
			</ul>
		</React.Fragment>
	);
}
