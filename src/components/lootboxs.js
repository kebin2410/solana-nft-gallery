import React from 'react';
import { Col, Row, Button, Form, Card, Badge, Container } from "react-bootstrap";

const Lootboxs = () => {
    return (
        <>
					<Row>
						<h1 className='title'>Avaiable Loot boxs</h1>
						<Col xs="12" md="6" lg="2">
							<Card
								className="imageGrid"
								lg="3"
								style={{
										backgroundColor: "#2B3964",
										padding: "10px",
										borderRadius: "10px",
								}}
								>
								<Card.Img
										variant="top"
										src='./0.png'
										
								/>
								<Card.Body>
										<Card.Title style={{ color: "#fff" }}>
										Red Box
										</Card.Title>
								</Card.Body>
							</Card>
						</Col>
						<Col xs="12" md="6" lg="2">
							<Card
								className="imageGrid"
								lg="3"
								style={{
										backgroundColor: "#2B3964",
										padding: "10px",
										borderRadius: "10px",
								}}
								>
								<Card.Img
										variant="top"
										src='./1.png'
										
								/>
								<Card.Body>
										<Card.Title style={{ color: "#fff" }}>
										Black Box
										</Card.Title>
								</Card.Body>
								</Card>
							</Col>
					</Row>
        </>
    );
}

export default Lootboxs;