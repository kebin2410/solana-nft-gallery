import React from 'react';
import { Modal, Button, Col, Card, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

const AddWarriorModal = ({show, setshow, setSelectedNFT}) => {
	const {nfts} = useSelector((state) => {
    return {
      nfts: state.nfts,
    }
  })

	const handleClose = () => {
		setshow(false)
	}

  return (
		<>
			<Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Choose Warrior</Modal.Title>
        </Modal.Header>
        <Modal.Body>
					<Row>
						{nfts ? nfts.map((metadata, index) => (
							<Col xs="12" md="12" lg="4" key={index}>
								<Card
									onClick={() => {
											setSelectedNFT(metadata)
											handleClose()
									}}
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
											src={metadata?.image}
											alt={metadata?.name}
									/>
									<Card.Body>
											<Card.Title style={{ color: "#fff" }}>
											{metadata?.name}
											</Card.Title>
									</Card.Body>
								</Card>
							</Col>
							)) : (<p>There is no NFT</p>)}
					</Row>
				</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
		</>
	)
}

export default AddWarriorModal;