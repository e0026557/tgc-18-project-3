// *** DEPENDENCIES ***
import React, { useContext, useEffect, useState } from 'react';
import Spinner from '../components/Spinner';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import ProductCard from '../components/ProductCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faMagnifyingGlass,
	faBarsStaggered
} from '@fortawesome/free-solid-svg-icons';

// *** CONTEXTS ***
import ProductsContext from '../contexts/ProductsContext';

export default function Products() {
	// Consume products context
	const productsContext = useContext(ProductsContext);
	const products = productsContext.getProducts() || [];

	// States
	const [query, setQuery] = useState({});
	const [searchOptions, setSearchOptions] = useState({});
	const [contentLoaded, setContentLoaded] = useState(false);
	const [costError, setCostError] = useState(false);
	const [show, setShow] = useState(false); // For offcanvas
	const [formFields, setFormFields] = useState({
		brand_id: '0',
		model: '',
		filling_mechanisms: '0',
		cap_type_id: '0',
		properties: '0',
		min_cost: '',
		max_cost: '',
		nib_material_id: '0',
		nib_size_id: '0',
		nib_shape_id: '0',
		nib_flexibility_id: '0',
		color_id: '0'
	});

	// Retrieve all search options
	useEffect(() => {
		(async () => {
			const searchOptions = await productsContext.getSearchOptions();
			await setSearchOptions(searchOptions);
		})();
	}, []);

	// Trigger new product search on change of state variable for query
	useEffect(() => {
		(async () => {
			await productsContext.getProductsByQuery(query);
			// await setProducts(products);
			await setContentLoaded(true);
		})();
	}, [query]);

	// --- FUNCTIONS ---
	const updateFormFields = (event) => {
		setFormFields({
			...formFields,
			[event.target.name]: event.target.value
		});
	};

	const searchProducts = () => {
		// Close advanced search panel (for mobile only)
		handleClose();

		// Check that min and max cost are valid
		if (
			formFields.min_cost !== '' &&
			formFields.max_cost !== '' &&
			Number(formFields.min_cost) > Number(formFields.max_cost)
		) {
			setCostError(true);
			return;
		} else {
			setCostError(false);
		}

		const query = {
			...formFields,
			min_cost: formFields.min_cost
				? parseInt(formFields.min_cost * 100)
				: '',
			max_cost: formFields.max_cost
				? parseInt(formFields.max_cost * 100)
				: ''
		};
		setQuery(query);
	};

	const resetSearchFields = () => {
		setFormFields({
			brand_id: '0',
			model: '',
			filling_mechanisms: '0',
			cap_type_id: '0',
			properties: '0',
			min_cost: '',
			max_cost: '',
			nib_material_id: '0',
			nib_size_id: '0',
			nib_shape_id: '0',
			nib_flexibility_id: '0',
			color_id: '0'
		});
	};

	const generateSelectOptions = (choices) => {
		if (choices) {
			return choices.map((choice, index) => {
				return (
					<option key={index} value={choice[0]}>
						{choice[1]}
					</option>
				);
			});
		}
	};

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

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
				className='container section-products py-5'
				id='section-products'
			>
				<h1>Products</h1>

				{contentLoaded ? (
					<div className='row mt-5'>
						{/* Search Panel (Mobile) */}
						<div className='d-flex justify-content-center align-items-center d-lg-none'>
							{/* Model */}
							<Form.Group>
								<Form.Control
									type='text'
									name='model'
									placeholder='Search model'
									value={formFields.model}
									onChange={updateFormFields}
								/>
							</Form.Group>
							{/* Search Button */}
							<Button
								variant='primary'
								className='border-radius-left-none'
								onClick={searchProducts}
							>
								<FontAwesomeIcon icon={faMagnifyingGlass} />
							</Button>
							{/* Advanced Search Button */}
							<Button
								variant='primary'
								className='ms-1'
								onClick={handleShow}
							>
								<FontAwesomeIcon icon={faBarsStaggered} />
							</Button>
						</div>

						{/* Offcanvas */}
						<Offcanvas show={show} onHide={handleClose}>
							<Offcanvas.Header closeButton>
								<Offcanvas.Title>
									Advanced Search
								</Offcanvas.Title>
							</Offcanvas.Header>
							<Offcanvas.Body>
								<div className='row mt-3'>
									{/* Brand */}
									<Form.Group className='col-6 mb-3'>
										<Form.Label>Brand</Form.Label>
										<Form.Select
											name='brand_id'
											value={formFields.brand_id}
											onChange={updateFormFields}
										>
											{generateSelectOptions(
												searchOptions.brands
											)}
										</Form.Select>
									</Form.Group>
									{/* Model */}
									<Form.Group className='col-6 mb-3'>
										<Form.Label>Model</Form.Label>
										<Form.Control
											type='text'
											name='model'
											value={formFields.model}
											onChange={updateFormFields}
										/>
									</Form.Group>
									{/* Filling mechanism */}
									<Form.Group className='mb-3'>
										<Form.Label>
											Filling Mechanism
										</Form.Label>
										<Form.Select
											name='filling_mechanisms'
											value={
												formFields.filling_mechanisms
											}
											onChange={updateFormFields}
										>
											{generateSelectOptions(
												searchOptions.fillingMechanisms
											)}
										</Form.Select>
									</Form.Group>
									{/* Nib Size */}
									<Form.Group className='col-6 mb-3'>
										<Form.Label>Nib Size</Form.Label>
										<Form.Select
											name='nib_size_id'
											value={formFields.nib_size_id}
											onChange={updateFormFields}
										>
											{generateSelectOptions(
												searchOptions.nibSizes
											)}
										</Form.Select>
									</Form.Group>
									{/* Nib Shape */}
									<Form.Group className='col-6 mb-3'>
										<Form.Label>Nib Shape</Form.Label>
										<Form.Select
											name='nib_shape_id'
											value={formFields.nib_shape_id}
											onChange={updateFormFields}
										>
											{generateSelectOptions(
												searchOptions.nibShapes
											)}
										</Form.Select>
									</Form.Group>
									{/* Nib Flexibility */}
									<Form.Group className='col-6 mb-3'>
										<Form.Label>Nib Flexibility</Form.Label>
										<Form.Select
											name='nib_flexibility_id'
											value={
												formFields.nib_flexibility_id
											}
											onChange={updateFormFields}
										>
											{generateSelectOptions(
												searchOptions.nibFlexibilities
											)}
										</Form.Select>
									</Form.Group>
									{/* Nib Material */}
									<Form.Group className='col-6 mb-3'>
										<Form.Label>Nib Material</Form.Label>
										<Form.Select
											name='nib_material_id'
											value={formFields.nib_material_id}
											onChange={updateFormFields}
										>
											{generateSelectOptions(
												searchOptions.nibMaterials
											)}
										</Form.Select>
									</Form.Group>
									{/* Min Cost */}
									<Form.Group className='col-6 mb-3'>
										<Form.Label>Min Cost</Form.Label>
										<Form.Control
											type='number'
											name='min_cost'
											min='0'
											value={formFields.min_cost}
											onChange={updateFormFields}
										/>
										{costError ? (
											<Form.Text className='error'>
												Min cost must be less than max
												cost
											</Form.Text>
										) : (
											''
										)}
									</Form.Group>
									{/* Max Cost */}
									<Form.Group className='col-6 mb-3'>
										<Form.Label>Max Cost</Form.Label>
										<Form.Control
											type='number'
											name='max_cost'
											min='1'
											value={formFields.max_cost}
											onChange={updateFormFields}
										/>
										{costError ? (
											<Form.Text className='error'>
												Max cost must be greater than
												min cost
											</Form.Text>
										) : (
											''
										)}
									</Form.Group>

									<div className='d-flex gap-2'>
										{/* Search button */}
										<Button
											variant='primary'
											className='flex-grow-1 mt-3'
											onClick={searchProducts}
										>
											Search
										</Button>

										{/* Reset button */}
										<Button
											variant='danger'
											className='flex-grow-1 mt-3'
											onClick={resetSearchFields}
										>
											Reset
										</Button>
									</div>
								</div>
							</Offcanvas.Body>
						</Offcanvas>

						{/* Search Panel (Desktop) */}
						<div className='d-none d-lg-block col-lg-4'>
							<div className='container search-box px-4 py-4'>
								<h5>Search</h5>

								<div className='row'>
									{/* Brand */}
									<Form.Group className='col-6 mb-3'>
										<Form.Label>Brand</Form.Label>
										<Form.Select
											name='brand_id'
											value={formFields.brand_id}
											onChange={updateFormFields}
										>
											{generateSelectOptions(
												searchOptions.brands
											)}
										</Form.Select>
									</Form.Group>
									{/* Model */}
									<Form.Group className='col-6 mb-3'>
										<Form.Label>Model</Form.Label>
										<Form.Control
											type='text'
											name='model'
											value={formFields.model}
											onChange={updateFormFields}
										/>
									</Form.Group>
									{/* Filling mechanism */}
									<Form.Group className='mb-3'>
										<Form.Label>
											Filling Mechanism
										</Form.Label>
										<Form.Select
											name='filling_mechanisms'
											value={
												formFields.filling_mechanisms
											}
											onChange={updateFormFields}
										>
											{generateSelectOptions(
												searchOptions.fillingMechanisms
											)}
										</Form.Select>
									</Form.Group>
									{/* Nib Size */}
									<Form.Group className='col-6 mb-3'>
										<Form.Label>Nib Size</Form.Label>
										<Form.Select
											name='nib_size_id'
											value={formFields.nib_size_id}
											onChange={updateFormFields}
										>
											{generateSelectOptions(
												searchOptions.nibSizes
											)}
										</Form.Select>
									</Form.Group>
									{/* Nib Shape */}
									<Form.Group className='col-6 mb-3'>
										<Form.Label>Nib Shape</Form.Label>
										<Form.Select
											name='nib_shape_id'
											value={formFields.nib_shape_id}
											onChange={updateFormFields}
										>
											{generateSelectOptions(
												searchOptions.nibShapes
											)}
										</Form.Select>
									</Form.Group>
									{/* Nib Flexibility */}
									<Form.Group className='col-6 mb-3'>
										<Form.Label>Nib Flexibility</Form.Label>
										<Form.Select
											name='nib_flexibility_id'
											value={
												formFields.nib_flexibility_id
											}
											onChange={updateFormFields}
										>
											{generateSelectOptions(
												searchOptions.nibFlexibilities
											)}
										</Form.Select>
									</Form.Group>
									{/* Nib Material */}
									<Form.Group className='col-6 mb-3'>
										<Form.Label>Nib Material</Form.Label>
										<Form.Select
											name='nib_material_id'
											value={formFields.nib_material_id}
											onChange={updateFormFields}
										>
											{generateSelectOptions(
												searchOptions.nibMaterials
											)}
										</Form.Select>
									</Form.Group>
									{/* Min Cost */}
									<Form.Group className='col-6 mb-3'>
										<Form.Label>Min Cost</Form.Label>
										<Form.Control
											type='number'
											name='min_cost'
											min='0'
											value={formFields.min_cost}
											onChange={updateFormFields}
										/>
										{costError ? (
											<Form.Text className='error'>
												Min cost must be less than max
												cost
											</Form.Text>
										) : (
											''
										)}
									</Form.Group>
									{/* Max Cost */}
									<Form.Group className='col-6 mb-3'>
										<Form.Label>Max Cost</Form.Label>
										<Form.Control
											type='number'
											name='max_cost'
											min='1'
											value={formFields.max_cost}
											onChange={updateFormFields}
										/>
										{costError ? (
											<Form.Text className='error'>
												Max cost must be greater than
												min cost
											</Form.Text>
										) : (
											''
										)}
									</Form.Group>

									<div className='d-flex gap-2'>
										{/* Search button */}
										<Button
											variant='primary'
											className='flex-grow-1 mt-3'
											onClick={searchProducts}
										>
											Search
										</Button>

										{/* Reset button */}
										<Button
											variant='danger'
											className='flex-grow-1 mt-3'
											onClick={resetSearchFields}
										>
											Reset
										</Button>
									</div>
								</div>
							</div>
						</div>
						{/* Product Listing */}
						<div className='col-12 col-lg-8'>
							<div className='row px-5'>
								{products.length ? (
									products.map((product) => {
										return (
											<div
												key={product.id}
												className='col-12 col-md-6 col-lg-4 d-flex justify-content-center my-3'
											>
												<ProductCard
													product={product}
												/>
											</div>
										);
									})
								) : (
									<div className="mt-4 mb-5">
										<span className='product-message'>No products found</span>
									</div>
								)}
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
