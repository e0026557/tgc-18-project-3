import React from "react";
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

export default function ProductCard(props) {
  // Collate product data
  const imageUrl = props.product.image_url;
  const productName = `${props.product.brand.brand} ${props.product.model}`;

  return (
    <Card className="card-product">
      <Card.Img variant="top" src={imageUrl} />
      <Card.Body className="d-flex flex-column">
        <Card.Title className="mb-4">{productName}</Card.Title>
        <Button variant="primary" as={Link} to={`/products/${props.product.id}/view`}>View</Button>
      </Card.Body>
    </Card>
  )
}