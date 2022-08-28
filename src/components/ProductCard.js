import React from "react";
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

export default function ProductCard(props) {
  // Collate product data
  const imageUrl = props.product.image_url;
  const productName = `${props.product.brand.brand} ${props.product.model}`;

  const variants = props.product.variants;
  // Get min cost of product variant
  let minCost = Infinity;
  for (let variant of variants) {
    if (variant.cost < minCost) {
      minCost = variant.cost;
    }
  }
  // Format min cost
  minCost = Math.floor(minCost / 100);

  return (
    <Card className="card-product">
      <Card.Img variant="top" src={imageUrl} />
      <Card.Body className="d-flex flex-column justify-content-between">
        <Card.Title>{productName}</Card.Title>
        <Card.Text>From ${minCost}</Card.Text>
        <Button className="mt-3" variant="primary" as={Link} to={`/products/${props.product.id}/view`}>View</Button>
      </Card.Body>
    </Card>
  )
}