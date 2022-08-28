// *** DEPENDENCIES ***
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Spinner from '../components/Spinner';
import Form from 'react-bootstrap/Form';

// *** CONTEXTS ***
import ProductsContext from '../contexts/ProductsContext';
import { toast } from 'react-toastify';

export default function ProductDetails(props) {
	// Get product ID from params
	const { productId } = useParams();

	// Consume products context
	const productsContext = useContext(ProductsContext);

	// State
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
			await setVariant(product.variants[0]);
			await setFormFields({
				color_id: product.variants[0].color_id,
				nib_material_id: product.variants[0].nib_material_id,
				nib_shape_id: product.variants[0].nib_shape_id,
				nib_size_id: product.variants[0].nib_size_id,
				nib_flexibility_id: product.variants[0].nib_flexibility_id
			});
			await setSearchOptions(searchOptions);
			await setContentLoaded(true);
		})();
	}, [productId]);

	useEffect(() => {
		if (product.variants) {
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
			console.log(variants);

			// If there is variant with the selected specifications
			if (variants.length) {
				setVariant(variants[0]);
			}
			// If there is no variant with the selected specifications
			// set previous variant to the last selected variant in state
			else {
				toast.error('There is no variant by the specifications');
				setError(true);
			}
		}
	}, [formFields]);

	useEffect(() => {
		// Trigger if there is an error
		if (error) {
			// Set form back to last selected variant specifications
			setFormFields({
				color_id: variant.color_id,
				nib_material_id: variant.nib_material_id,
				nib_shape_id: variant.nib_shape_id,
				nib_size_id: variant.nib_size_id,
				nib_flexibility_id: variant.nib_flexibility_id
			});
			setError(false); // Reset error state
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

	return (
		<React.Fragment>
			<section className='container adjust-margin-top'>
				{contentLoaded ? (
					<React.Fragment>
						{/* Product View (Desktop) */}
						<div className='container pt-5'>
							<div className='row'>
								{/* Product Image Section */}
								<div className='d-flex justify-content-end col-5'>
									<div className='variant-img-box'>
										<img
											className='variant-img'
											src={variant.image_url}
											alt='Product image of fountain pen'
										/>
									</div>
								</div>
								{/* Divider */}
								<div className='col bg-primary'></div>
								{/* Product Details Section */}
								<div className='d-flex flex-column justify-content-start col-5'>
									<h3 className='product-header'>
										{product.brand.brand} {product.model}
									</h3>

									<div className='product-specs-box'>
										<ul>
											<li>Weight: {product.weight}g</li>
											<li>Length: {product.length}mm</li>
											<li>
												Diameter: {product.diameter}mm
											</li>
											<li>
												Description: <br />
												<p>{product.description}</p>
											</li>
											<li>
												Cap Type:{' '}
												{product.capType.cap_type}
											</li>
											<li>
												Cost: $
												{(variant.cost / 100).toFixed(
													2
												)}
											</li>
											<li>Stock: {variant.stock}</li>
										</ul>
									</div>

									{/* Variant Selection */}
									<div className='variant-selection-box'>
										{/* Color */}
										<Form.Group className='mb-3'>
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
										<Form.Group className='mb-3'>
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
										<Form.Group className='mb-3'>
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
										<Form.Group className='mb-3'>
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
										<Form.Group className='mb-3'>
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
