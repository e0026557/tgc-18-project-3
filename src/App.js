// *** DEPENDENCIES ***
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/style.css';

// *** COMPONENTS ***
import Navigation from './components/Navigation';
import Products from './pages/Products';
import NotFound from './pages/NotFound';

// *** PROVIDERS ***
import ProductsProvider from './providers/ProductsProvider';

function App() {
	return (
		<React.Fragment>
			<Router>
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
					<Route path='/login' element={<h1>login</h1>} />
					<Route path='/register' element={<h1>register</h1>} />

					{/* 404 Not Found Page */}
					<Route path='*' element={<NotFound />} />
				</Routes>
			</Router>
		</React.Fragment>
	);
}

export default App;
