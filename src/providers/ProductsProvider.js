// *** DEPENDENCIES ***
import React, { useEffect, useState } from "react";
import axios from "axios";

// *** CONTEXTS ***
import ProductsContext from "../contexts/ProductsContext";

const BASE_API_URL = 'https://inkstone-express.herokuapp.com/api';

export default function ProductsProvider(props) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await axios.get(BASE_API_URL + '/products');
      const products = response.data.data.products;
      setProducts(products);
    })();
  }, []);

  const productsContext = {
    getProducts: () => {
      return products;
    }
  }

  return (
    <ProductsContext.Provider value={productsContext}>
      {/* To access child components nested inside ProductsProvider */}
      {props.children}
    </ProductsContext.Provider>
  )
}