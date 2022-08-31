// *** DEPENDENCIES ***
import React, { useEffect, useContext, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Spinner from '../components/Spinner';

// *** CONTEXTS ***
import UserContext from '../contexts/UserContext';

export default function Orders(props) {
	// Consume user context
	const userContext = useContext(UserContext);

	// States
	const [orders, setOrders] = useState([]);
	const [contentLoaded, setContentLoaded] = useState(false);

	useEffect(() => {
		(async () => {
			// Refresh token
			const valid = await userContext.refreshToken();
			if (!valid) {
				return;
			}

			// Get all orders
			const orders = await userContext.getOrders();
			setOrders(orders);
			setContentLoaded(true);
		})();
	}, []);

	// Functions
	const renderAllOrders = () => {
		return (
			<React.Fragment>
				<Table striped hover responsive>
					<thead>
						<tr>
							<th>ID</th>
							<th>Order Date</th>
							<th>Amount</th>
							<th>Shipping</th>
							<th>Status</th>
							<th>Receipt</th>
						</tr>
					</thead>
					<tbody>
						{orders.length ? (
							orders.map((order) => {
								return (
									<tr key={order.id}>
										<td>{order.id}</td>
										<td>
											{new Date(
												order.order_date.slice(0, -1)
											).toDateString()}
										</td>
										<td>
											$
											{(order.total_cost / 100).toFixed(
												2
											)}
										</td>
										<td>
											{order.shipping_address_line1}
											<br />
											{order.shipping_address_line2 ? (
												<React.Fragment>
													{
														order.shipping_address_line2
													}
													<br />
												</React.Fragment>
											) : (
												''
											)}
											{order.shipping_address_country}{' '}
											{order.shipping_address_postal}
										</td>
										<td>
											{order.orderStatus.order_status ===
											'Delivered' ? (
												<React.Fragment>
													{
														order.orderStatus
															.order_status
													}
													<br />(
													{new Date(
														order.delivery_date.slice(
															0,
															-1
														)
													).toDateString()}
													)
												</React.Fragment>
											) : (
												order.orderStatus.order_status
											)}
										</td>
										<td>
											<Button
												variant='primary'
												size='sm'
												target='_blank'
												href={order.receipt_url}
											>
												View
											</Button>
										</td>
									</tr>
								);
							})
						) : (
							<tr>
								<td className='text-center' colSpan={4}>
									No orders to display
								</td>
							</tr>
						)}
					</tbody>
				</Table>
			</React.Fragment>
		);
	};

	return (
		<React.Fragment>
			<div className='container adjust-margin-top pt-5'>
				<h1>Orders</h1>
				<div className='container mt-3 mt-md-4'>
					{contentLoaded ? renderAllOrders() : <Spinner />}
				</div>
			</div>
		</React.Fragment>
	);
}
