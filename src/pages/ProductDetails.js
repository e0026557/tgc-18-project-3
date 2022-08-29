// *** DEPENDENCIES ***
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Spinner from '../components/Spinner';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';

// *** CONTEXTS ***
import ProductsContext from '../contexts/ProductsContext';

export default function ProductDetails(props) {
	// Get product ID from params
	const { productId } = useParams();

	// Consume products context
	const productsContext = useContext(ProductsContext);

	// States
	const [product, setProduct] = useState({});
	const [variant, setVariant] = useState({});
	const [error, setError] = useState(false);
	const [searchOptions, setSearchOptions] = useState({});
	const [contentLoaded, setContentLoaded] = useState(false);
	const [formFields, setFormFields] = useState({});

	useEffect(() => {
		(async () => {
			const product = await productsContext.getProductById(productId);

			// Customise search options based on available variants
			const colors = [];
			const nibMaterials = [];
			const nibShapes = [];
			const nibSizes = [];
			const nibFlexibilities = [];

			// Keep track of which choices appeared before
			const selected = {
				colors: {},
				nibMaterials: {},
				nibShapes: {},
				nibSizes: {},
				nibFlexibilities: {}
			};

			for (let variant of product.variants) {
				const color = [variant.color_id, variant.color.color];
				const nibMaterial = [
					variant.nib_material_id,
					variant.nibMaterial.nib_material
				];
				const nibShape = [
					variant.nib_shape_id,
					variant.nibShape.nib_shape
				];
				const nibSize = [variant.nib_size_id, variant.nibSize.nib_size];
				const nibFlexiblity = [
					variant.nib_flexibility_id,
					variant.nibFlexibility.nib_flexibility
				];

				// Check if option is already added
				if (!selected.colors[color[0]]) {
					colors.push(color);
					selected.colors[color[0]] = color[1];
				}
				if (!selected.nibMaterials[nibMaterial[0]]) {
					nibMaterials.push(nibMaterial);
					selected.nibMaterials[nibMaterial[0]] = nibMaterial[1];
				}
				if (!selected.nibShapes[nibShape[0]]) {
					nibShapes.push(nibShape);
					selected.nibShapes[nibShape[0]] = nibShape[1];
				}
				if (!selected.nibSizes[nibSize[0]]) {
					nibSizes.push(nibSize);
					selected.nibSizes[nibSize[0]] = nibSize[1];
				}
				if (!selected.nibFlexibilities[nibFlexiblity[0]]) {
					nibFlexibilities.push(nibFlexiblity);
					selected.nibFlexibilities[nibFlexiblity[0]] =
						nibFlexiblity[1];
				}
			}

			const searchOptions = {
				colors,
				nibMaterials,
				nibShapes,
				nibSizes,
				nibFlexibilities
			};

			await setProduct(product);
			await setVariant(product.variants[0]); // Select the first variant by default
			await setSearchOptions(searchOptions);
			await setFormFields({
				color_id: product.variants[0].color_id,
				nib_material_id: product.variants[0].nib_material_id,
				nib_shape_id: product.variants[0].nib_shape_id,
				nib_size_id: product.variants[0].nib_size_id,
				nib_flexibility_id: product.variants[0].nib_flexibility_id
			});
			await setContentLoaded(true);
		})();
	}, [productId]);

	useEffect(() => {
		// If product is rendered
		if (product.variants) {
			// Check if there is any variant based on the current selected specifications
			const variants = product.variants.filter((variant) => {
				if (
					variant.color_id == formFields.color_id &&
					variant.nib_flexibility_id ==
						formFields.nib_flexibility_id &&
					variant.nib_material_id == formFields.nib_material_id &&
					variant.nib_shape_id == formFields.nib_shape_id &&
					variant.nib_size_id == formFields.nib_size_id
				) {
					return true;
				}
				return false;
			});

			// If there is variant based on the selected specifications
			if (variants.length) {
				setVariant(variants[0]); // Set the variant as selected
				setError(false); // Reset error state
				setSearchOptions(getAvailableOptions()); // Render all available options based on current selected specifications
			}

			// If there is no variant based on the selected specifications, mark as error
			else {
				setError(true);
			}
		}
	}, [formFields]);

	useEffect(() => {
		// Trigger if there is an error (when there is no variant by the selected specifications)
		if (error) {
			// Get the variant with the closest specifications that matches the current selected specifications

			// Check if there is any variant that matches the current specified color, nib shape, nib size, and nib flexibility (4 fields matched)
			// -> Set the form fields to match the specification of the first variant
			let variants = product.variants.filter((variant) => {
				return (
					parseInt(variant.color_id) ===
						parseInt(formFields.color_id) &&
					parseInt(variant.nib_shape_id) ===
						parseInt(formFields.nib_shape_id) &&
					parseInt(variant.nib_size_id) ===
						parseInt(formFields.nib_size_id) &&
					parseInt(variant.nib_flexibility_id) ===
						parseInt(formFields.nib_flexibility_id)
				);
			});

			if (variants.length) {
				setFormFields({
					color_id: variants[0].color_id,
					nib_material_id: variants[0].nib_material_id,
					nib_shape_id: variants[0].nib_shape_id,
					nib_size_id: variants[0].nib_size_id,
					nib_flexibility_id: variants[0].nib_flexibility_id
				});
				return;
			}

			// Check if there is any variant that matches the current specified color, nib shape, and nib size (3 fields matched)
			// -> Set the form fields to match the specification of the first variant
			variants = product.variants.filter((variant) => {
				return (
					parseInt(variant.color_id) ===
						parseInt(formFields.color_id) &&
					parseInt(variant.nib_shape_id) ===
						parseInt(formFields.nib_shape_id) &&
					parseInt(variant.nib_size_id) ===
						parseInt(formFields.nib_size_id)
				);
			});

			if (variants.length) {
				setFormFields({
					color_id: variants[0].color_id,
					nib_material_id: variants[0].nib_material_id,
					nib_shape_id: variants[0].nib_shape_id,
					nib_size_id: variants[0].nib_size_id,
					nib_flexibility_id: variants[0].nib_flexibility_id
				});
				return;
			}

			// Check if there is any variant that matches the current specified color, and nib shape (2 fields matched)
			// -> Set the form fields to match the specification of the first variant
			variants = product.variants.filter((variant) => {
				return (
					parseInt(variant.color_id) ===
						parseInt(formFields.color_id) &&
					parseInt(variant.nib_shape_id) ===
						parseInt(formFields.nib_shape_id)
				);
			});

			if (variants.length) {
				setFormFields({
					color_id: variants[0].color_id,
					nib_material_id: variants[0].nib_material_id,
					nib_shape_id: variants[0].nib_shape_id,
					nib_size_id: variants[0].nib_size_id,
					nib_flexibility_id: variants[0].nib_flexibility_id
				});
				return;
			}

			// Check if there is any variant that matches the current specified color (1 field matched)
			// -> Set the form fields to match the specification of the first variant
			variants = product.variants.filter((variant) => {
				return (
					parseInt(variant.color_id) === parseInt(formFields.color_id)
				);
			});

			if (variants.length) {
				setFormFields({
					color_id: variants[0].color_id,
					nib_material_id: variants[0].nib_material_id,
					nib_shape_id: variants[0].nib_shape_id,
					nib_size_id: variants[0].nib_size_id,
					nib_flexibility_id: variants[0].nib_flexibility_id
				});
				return;
			}
		}
	}, [error]);

	// --- FUNCTIONS ---
	const updateFormFields = (event) => {
		setFormFields({
			...formFields,
			[event.target.name]: event.target.value
		});
	};

	const generateSelectOptions = (choices) => {
		return choices.map((choice, index) => {
			return (
				<option key={index} value={choice[0]}>
					{choice[1]}
				</option>
			);
		});
	};

	const getAvailableOptions = () => {
		const colors = getColorOptions();
		const nibShapes = getNibShapeOptions();
		const nibSizes = getNibSizeOptions();
		const nibFlexibilities = getNibFlexibilityOptions();
		const nibMaterials = getNibMaterialOptions();

		return {
			colors,
			nibMaterials,
			nibShapes,
			nibSizes,
			nibFlexibilities
		};
	};

	const getColorOptions = () => {
		// Get all colors of variants
		const variants = product.variants;
		const colors = [];

		// Keep track of which choices appeared
		const selectedColors = {};

		for (let variant of variants) {
			const color = [variant.color_id, variant.color.color];

			// Check if option is already added
			if (!selectedColors[color[0]]) {
				colors.push(color);
				selectedColors[color[0]] = color[1];
			}
		}

		return colors;
	};

	const getNibShapeOptions = () => {
		// Get all nib shapes of variants with the current specified color
		const variants = product.variants.filter((variant) => {
			return parseInt(variant.color_id) === parseInt(formFields.color_id);
		});
		const nibShapes = [];

		// Keep track of which choices appeared
		const selectedNibShapes = {};

		for (let variant of variants) {
			const nibShape = [variant.nib_shape_id, variant.nibShape.nib_shape];

			// Check if option is already added
			if (!selectedNibShapes[nibShape[0]]) {
				nibShapes.push(nibShape);
				selectedNibShapes[nibShape[0]] = nibShape[1];
			}
		}

		return nibShapes;
	};

	const getNibSizeOptions = () => {
		// Get all nib sizes of variants with the current specified color and nib shape
		const variants = product.variants.filter((variant) => {
			return (
				parseInt(variant.color_id) === parseInt(formFields.color_id) &&
				parseInt(variant.nib_shape_id) ===
					parseInt(formFields.nib_shape_id)
			);
		});
		const nibSizes = [];

		// Keep track of which choices appeared
		const selectedNibSizes = {};

		for (let variant of variants) {
			const nibSize = [variant.nib_size_id, variant.nibSize.nib_size];

			// Check if option is already added
			if (!selectedNibSizes[nibSize[0]]) {
				nibSizes.push(nibSize);
				selectedNibSizes[nibSize[0]] = nibSize[1];
			}
		}

		return nibSizes;
	};

	const getNibFlexibilityOptions = () => {
		// Get all nib flexibilities of variants with the current specified color, nib shape and nib size
		const variants = product.variants.filter((variant) => {
			return (
				parseInt(variant.color_id) === parseInt(formFields.color_id) &&
				parseInt(variant.nib_shape_id) ===
					parseInt(formFields.nib_shape_id) &&
				parseInt(variant.nib_size_id) ===
					parseInt(formFields.nib_size_id)
			);
		});
		const nibFlexibilities = [];

		// Keep track of which choices appeared
		const selectedNibFlexibilities = {};

		for (let variant of variants) {
			const nibFlexiblity = [
				variant.nib_flexibility_id,
				variant.nibFlexibility.nib_flexibility
			];

			// Check if option is already added
			if (!selectedNibFlexibilities[nibFlexiblity[0]]) {
				nibFlexibilities.push(nibFlexiblity);
				selectedNibFlexibilities[nibFlexiblity[0]] = nibFlexiblity[1];
			}
		}

		return nibFlexibilities;
	};

	const getNibMaterialOptions = () => {
		// Get all nib materials of variants with the current specified color, nib shape, nib size, and nib flexibility
		const variants = product.variants.filter((variant) => {
			return (
				parseInt(variant.color_id) === parseInt(formFields.color_id) &&
				parseInt(variant.nib_shape_id) ===
					parseInt(formFields.nib_shape_id) &&
				parseInt(variant.nib_size_id) ===
					parseInt(formFields.nib_size_id) &&
				parseInt(variant.nib_flexibility_id) ===
					parseInt(formFields.nib_flexibility_id)
			);
		});
		const nibMaterials = [];

		// Keep track of which choices appeared
		const selectedNibMaterials = {};

		for (let variant of variants) {
			const nibMaterial = [
				variant.nib_material_id,
				variant.nibMaterial.nib_material
			];

			// Check if option is already added
			if (!selectedNibMaterials[nibMaterial[0]]) {
				nibMaterials.push(nibMaterial);
				selectedNibMaterials[nibMaterial[0]] = nibMaterial[1];
			}
		}

		return nibMaterials;
	};

	return (
		<React.Fragment>
			<section className='container adjust-margin-top'>
				{contentLoaded ? (
					<React.Fragment>
						{/* Product View (Desktop) */}
						<div className='container pt-4'>
							<div className='d-flex justify-content-center gap-5'>
								{/* Product Image Section */}
								<div className='d-flex justify-content-center col-5'>
									<div className='variant-img-box p-5'>
										<img
											className='variant-img'
											src={variant.image_url}
											alt='Product image of fountain pen'
										/>
									</div>
								</div>
								{/* Product Details Section */}
								<div className='d-flex flex-column justify-content-start col-5'>
									<h2 className='product-header pt-4'>
										{product.brand.brand} {product.model}
									</h2>

									<h4 className='mt-1 mb-2'>
										${(variant.cost / 100).toFixed(2)}
									</h4>

									{/*  Render quantity info when low on stock */}
									{variant.stock <= 30 ? (
										<span className='product-quantity-info'>
											Only {variant.stock} left
										</span>
									) : (
										''
									)}

									{/* Product Details */}
									<Accordion
										defaultActiveKey={['0']}
										alwaysOpen
										className='mt-3 mb-4'
									>
										<Accordion.Item eventKey='0'>
											<Accordion.Header>
												Specifications
											</Accordion.Header>
											<Accordion.Body>
												<ul>
													<li>
														<span className='product-specification-header'>
															Weight:{' '}
														</span>
														{product.weight}g
													</li>
													<li>
														<span className='product-specification-header'>
															Length:{' '}
														</span>
														{product.length}
														mm
													</li>
													<li>
														<span className='product-specification-header'>
															Diameter:{' '}
														</span>
														{product.diameter}mm
													</li>
													<li>
														<span className='product-specification-header'>
															Cap Type:{' '}
														</span>
														{
															product.capType
																.cap_type
														}
													</li>
												</ul>
											</Accordion.Body>
										</Accordion.Item>
										<Accordion.Item eventKey='1'>
											<Accordion.Header>
												Description
											</Accordion.Header>
											<Accordion.Body className='px-4 py-4'>
												{product.description}
											</Accordion.Body>
										</Accordion.Item>
									</Accordion>

									{/* Variant Selection */}
									<div className='container variant-selection-box px-4 py-3 mb-4'>
										<h5>Select variant:</h5>
										{/* Color */}
										<Form.Group className='mb-2'>
											<Form.Label>Color</Form.Label>
											<Form.Select
												name='color_id'
												value={formFields.color_id}
												onChange={updateFormFields}
											>
												{generateSelectOptions(
													searchOptions.colors
												)}
											</Form.Select>
										</Form.Group>
										{/* Nib Shape */}
										<Form.Group className='mb-2'>
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
										{/* Nib Size */}
										<Form.Group className='mb-2'>
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
										{/* Nib Flexibility */}
										<Form.Group className='mb-2'>
											<Form.Label>
												Nib Flexibility
											</Form.Label>
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
										<Form.Group className='mb-2'>
											<Form.Label>
												Nib Material
											</Form.Label>
											<Form.Select
												name='nib_material_id'
												value={
													formFields.nib_material_id
												}
												onChange={updateFormFields}
											>
												{generateSelectOptions(
													searchOptions.nibMaterials
												)}
											</Form.Select>
										</Form.Group>

										{/* Add to cart button */}
										<div className='d-flex justify-content-center mt-4'>
											{variant.stock ? (
												<Button variant='primary'>
													Add to Cart
												</Button>
											) : (
												<Button
													disabled
													variant='primary'
												>
													Out of Stock
												</Button>
											)}
										</div>
									</div>
								</div>
							</div>
						</div>
					</React.Fragment>
				) : (
					<Spinner />
				)}
			</section>
		</React.Fragment>
	);
}
