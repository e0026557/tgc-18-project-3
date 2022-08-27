// *** DEPENDENCIES ***
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/style.css';
import './assets/css/spinner.css';

// *** COMPONENTS ***
import Toastify from './components/Toastify';
import Navigation from './components/Navigation';
import Products from './pages/Products';
import Login from './pages/Login';
import Register from './pages/Register';
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

						{/* Accounts Routes */}
						<Route path='/login' element={<Login />} />
						<Route path='/register' element={<Register />} />

						{/* 404 Not Found Page */}
						<Route path='*' element={<NotFound />} />
					</Routes>
				</UserProvider>
			</Router>
		</React.Fragment>
	);
}

export default App;
