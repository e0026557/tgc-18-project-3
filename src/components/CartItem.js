// *** DEPENDENCIES ***
import React from 'react';
import { useContext, useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrashCan, faCheck } from '@fortawesome/free-solid-svg-icons';

// *** CONTEXTS ***
import UserContext from '../contexts/UserContext';

export default function CartItem(props) {
	const variantId = props.cartItem.variant_id;

	// Consume user context
	const userContext = useContext(UserContext);

	// State
	const [quantity, setQuantity] = useState(props.cartItem.quantity);
	const [edit, setEdit] = useState(false); // To toggle between edit mode and display mode

	// Lookup table for nib specifications abbreviations
	const nibShape = {
		Round: 'Rd',
		'Italic/Stub': 'It',
		Oblique: 'Ob'
	};

	const nibSize = {
		'Extra Fine': 'XF',
		Fine: 'F',
		Medium: 'M',
		Broad: 'B',
		'Extra Broad': 'XB'
	};

	// Functions
	const updateQuantity = (event) => {
		if (
			parseInt(event.target.value) >
			parseInt(props.cartItem.variant.stock)
		) {
			setQuantity(props.cartItem.variant.stock);
		} else if (parseInt(event.target.value) <= 0) {
			setQuantity(1);
		} else {
			setQuantity(event.target.value);
		}
	};

	const deleteCartItem = async () => {
		// Refresh token
		await userContext.refreshToken();

		// Delete cart via axios
		await userContext.deleteCartItem(variantId);

		setEdit(false);
		// Trigger cart reload
		props.reloadCart();
	};

	const updateCartItem = async () => {
		// Refresh token
		await userContext.refreshToken();

		// Update cart via axios
		await userContext.updateCartItem(variantId, quantity);

		setEdit(false);
		// Trigger cart reload
		props.reloadCart();
	};

	return (
		<ListGroup.Item>
			<div className='container'>
				<div className='row'>
					{/* Cart Item Thumbnail Section */}
					<div className='col-3 d-flex align-items-center'>
						<img
							className='cart-item-img'
							src={props.cartItem.variant.thumbnail_url}
							alt='Thumbnail image of fountain pen'
						/>
					</div>
					{edit ? (
						<div className='col-9 d-flex flex-column justify-content-center align-items-start pt-2'>
							<h6 className='p-0 m-0'>
								{props.cartItem.variant.fountainPen.brand.brand}{' '}
								{props.cartItem.variant.fountainPen.model}
							</h6>
							<span className='input-cart-item-quantity-label mt-1'>
								Update Quantity:{' '}
							</span>
							<div className='d-flex align-items-center mt-1'>
								<Form.Control
									className='input-cart-item-quantity'
									name='quantity'
									type='number'
									min={1}
									max={props.cartItem.variant.stock}
									value={quantity}
									onChange={updateQuantity}
								/>

								{/* Update Cart Item Button */}
								<Button
									className='btn btn-cart-item'
									onClick={updateCartItem}
								>
									<FontAwesomeIcon
										className='btn-cart-item-delete-icon'
										icon={faCheck}
									/>
								</Button>

								{/* Delete Cart Item Button */}
								<Button
									className='btn btn-cart-item bg-danger ms-auto'
									onClick={deleteCartItem}
								>
									<FontAwesomeIcon
										className='btn-cart-item-delete-icon'
										icon={faTrashCan}
									/>
								</Button>
							</div>
						</div>
					) : (
						<React.Fragment>
							{/* Cart Item Details Section */}
							<div className='col-8 d-flex flex-column justify-content-center pt-2'>
								<h6 className='p-0 m-0'>
									{
										props.cartItem.variant.fountainPen.brand
											.brand
									}{' '}
									{props.cartItem.variant.fountainPen.model}
								</h6>
								<ul className='cart-item-specification-list pt-1'>
									<li>
										Color:{' '}
										{props.cartItem.variant.color.color}
									</li>
									<li>
										Nib:{' '}
										{
											nibShape[
												props.cartItem.variant.nibShape
													.nib_shape
											]
										}
										,{' '}
										{
											nibSize[
												props.cartItem.variant.nibSize
													.nib_size
											]
										}
										,{' '}
										{
											props.cartItem.variant
												.nibFlexibility.nib_flexibility
										}
										,{' '}
										{
											props.cartItem.variant.nibMaterial
												.nib_material
										}{' '}
									</li>
									<li>Price: ${(props.cartItem.variant.cost / 100).toFixed(2)}</li>
									<li>Qty: {props.cartItem.quantity}</li>
								</ul>
							</div>

							<div className='col-1 d-flex flex-column justify-content-start align-items-center'>
								<Button
									className='btn btn-cart-item'
									onClick={() => {
										setEdit(true);
									}}
								>
									<FontAwesomeIcon
										className='btn-cart-item-edit-icon'
										icon={faPen}
									/>
								</Button>
							</div>
						</React.Fragment>
					)}
				</div>
			</div>
		</ListGroup.Item>
	);
}
