import React, { useState } from 'react'
import { Container } from 'react-bootstrap'

import Lootboxs from './components/lootboxs'
import Loots from './components/loots'

const Lootbox = ({ connection }) => {
	const [show, setShow] = useState(false)
	return (
		<>
			<Container className="content">
				<Lootboxs connection={connection} show={show} setShow={setShow} />
				<Loots connection={connection} show={show} setShow={setShow}/>
			</Container>
		</>
	)
}

export default Lootbox;