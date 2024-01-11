import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Button } from 'react-bootstrap'
import { getParsedNftAccountsByOwner, isValidSolanaAddress, createConnectionConfig, } from "@nfteyez/sol-rayz";
import { useDispatch, useSelector } from 'react-redux';
import { useWallet } from '@solana/wallet-adapter-react';
// pkg for connect to solana program
import { Program, Provider, web3 } from '@project-serum/anchor';
import { Connection, PublicKey } from '@solana/web3.js';

import { mintLootBox, getProvider, openLootBox } from '../../../utils/utils';
import AlertDismissible from '../../../alert/alertDismissible';

const Lootboxs = ({ connection, show, setShow }) => {
	const {provider} = useSelector(state => {
		return {
			provider: state.provider,
		}
	})
	const dispatch = useDispatch();
	const { publicKey } = useWallet();
	const wallet = useWallet();
	const [nfts, setNfts] = useState([]);
  //alert props
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  // const [show, setShow] = useState(false);
	// const [lootShow, setLootShow] = useState(false);

  //loading props
  const [loading, setLoading] = useState(false);

  // state change
  useEffect(() => {
    setNfts([]);
		
    getNfts();

  }, [publicKey, connection]);

	useEffect(() => {
		if (show) {
			getNfts()
		}
	}, [show])

	const getNfts = async (e) => {
		setShow(false);

		let address = publicKey + "";

		if (address.length === 0) {
			address = publicKey;
		}

		if (!isValidSolanaAddress(address)) {
			setTitle("Invalid address");
			setMessage("Please enter a valid Solana address or Connect your wallet");
			setLoading(false);
			setShow(true);
			return;
		}

		const connect = createConnectionConfig(connection);

		setLoading(true);
		const nftArray = await getParsedNftAccountsByOwner({
			publicAddress: address,
			connection: connect,
			serialization: true,
		});
		// return;

		if (nftArray.length === 0) {
			setTitle("No NFTs found in Your wallet");
			setMessage("No NFTs found for address: " + address);
			setLoading(false);
			setShow(true);
			return;
		}

		const metadatas = await fetchMetadata(nftArray);

		setLoading(false);
		dispatch({type: "set", nfts: metadatas})
		return setNfts(metadatas);
	};

  const fetchMetadata = async (nftArray) => {
    let metadatas = [];
    for (const nft of nftArray) {
      if (nft.data.symbol === "Lootbox") {
        try {
          await fetch(nft.data.uri)
          .then((response) => response.json())
          .then((meta) => { 
            metadatas.push({...meta, ...nft});
          });
        } catch (error) {
          console.log(error);
        }
      }
    }
    return metadatas;
  };

	const mintLootbox = async () => {
		const provider = await getProvider(wallet);
		const tx = await mintLootBox(provider, wallet, "https://arweave.net/Isuue2pI2LM3gGozamGPX2YHNRFlLHXWFc60otl8WnY", "Red Box", "Lootbox");
		setShow(true)
	}

	const openLootbox = async () => {
		const provider = await getProvider(wallet);
		const tx = await openLootBox(provider, wallet, "Item", "loot");
		setShow(true)
	}

	return (
		<>
			<Row style={{ marginTop: 30 }}>
				<Col lg={10}>	
					<h1>Your Lootboxs</h1>
				</Col>
				<Col lg={2}>
					<Button onClick={mintLootbox}>Mint Lootbox</Button>
				</Col>
			</Row>
			<Row>
				{loading && (
					<div className="loading">
						<img src="loading.gif" alt="loading" style={{ height: '100px'}}/>
					</div>
				)}
				{!loading &&
					<Row>
					{!loading &&
						nfts.map((metadata, index) => (
						<Col xs="12" md="6" lg="2" key={index}>
								<Card
								onClick={() => {
										console.log(nfts.length);
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
										<Button onClick={() => openLootbox(metadata)}>Open</Button>
								</Card.Body>
								</Card>
						</Col>
					))}
				</Row>
			}
			{show && (
        <AlertDismissible title={title} message={message} setShow={setShow} />
      )}
			</Row>
		</>
	)
}

export default Lootboxs;