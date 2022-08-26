// *** DEPENDENCIES ***
import React, { useEffect, useState } from "react";
import axios from "axios";

// *** CONTEXTS ***
import ProductsContext from "../contexts/ProductsContext";

const BASE_API_URL = 'https://inkstone-express.herokuapp.com/api';

export default function ProductsProvider(props) {
  const productsContext = {
    getProducts: async (query={}) => {
      const response = await axios.get(BASE_API_URL + '/products', {
        params: query
      });
      const products = response.data.data.products;
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