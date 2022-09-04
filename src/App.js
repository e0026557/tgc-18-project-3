// *** DEPENDENCIES ***
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/style.css';
import './assets/css/spinner.css';

// *** COMPONENTS ***
import Toastify from './components/Toastify';
import Navigation from './components/Navigation';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Orders from './pages/Orders';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import Fail from './pages/Fail';
import NotFound from './pages/NotFound';

// *** PROVIDERS ***
import ProductsProvider from './providers/ProductsProvider';
import UserProvider from './providers/UserProvider';

function App() {
	return (
		<React.Fragment>
			{/* React Toastify Component */}
			<Toastify />
			<Router>
				<UserProvider>
					{/* Navbar */}
					<Navigation />

					{/* Routes */}
					<Routes>
						{/* Products Route */}
						<Route
							path='/'
							element={
								<ProductsProvider>
									<Products />
								</ProductsProvider>
							}
						/>
						<Route
							path='/products/:productId/view'
							element={
								<ProductsProvider>
									<ProductDetails />
								</ProductsProvider>
							}
						/>

						{/* Accounts Routes */}
						<Route path='/login' element={<Login />} />
						<Route path='/register' element={<Register />} />

						{/* Order Routes */}
						<Route path='/orders' element={<Orders />} />

						{/* Checkout Routes */}
						<Route path='/checkout' element={<Checkout />} />
						<Route path='/checkout/success' element={<Success />} />
						<Route path='/checkout/fail' element={<Fail />} />

						{/* 404 Not Found Page */}
						<Route path='*' element={<NotFound />} />
					</Routes>
				</UserProvider>
			</Router>
		</React.Fragment>
	);
}

export default App;
