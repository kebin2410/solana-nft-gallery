import React, {useEffect, useState} from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { getParsedNftAccountsByOwner, isValidSolanaAddress, createConnectionConfig, } from "@nfteyez/sol-rayz";
import { Col, Row, Button, Form, Card, Badge, Container } from "react-bootstrap";
import { useDispatch, useSelector } from 'react-redux';
import AlertDismissible from '../alert/alertDismissible';

const Warriors = (props) => {
	const dispatch = useDispatch();
	const { publicKey } = useWallet();
  const { connection } = props;

  // state change
  useEffect(() => {
    setNfts([]);
    setView("nft-grid");
    setGroupedNfts([]);
    setShow(false);
     if (publicKey) {
       dispatch({type: "set", "wallet": publicKey + ""})
       setstate({
         ...state,
         walletAddress: publicKey + ""
       })
     }
  }, [publicKey, connection]);

  const [state, setstate] = useState({
    walletAddress: ''
  })
  const [nfts, setNfts] = useState([]);
  const [groupedNfts, setGroupedNfts] = useState([]);
  const [view, setView] = useState('collection');
  //alert props
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [show, setShow] = useState(false);

  //loading props
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getNfts = async (e) => {
      setShow(false);
  
      let address = state.walletAddress;
  
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
      // console.log(nftArray);
      // return;
  
      if (nftArray.length === 0) {
        setTitle("No NFTs found in " + props.title);
        setMessage("No NFTs found for address: " + address);
        setLoading(false);
        setView('collection');
        setShow(true);
        return;
      }
  
      const metadatas = await fetchMetadata(nftArray);

      setLoading(false);
			dispatch({type: "set", nfts: metadatas})
      return setNfts(metadatas);
    };
    getNfts();
  }, [state])


  const fetchMetadata = async (nftArray) => {
    let metadatas = [];
    console.log(nftArray)
    for (const nft of nftArray) {
      if (nft.data.symbol === "Warrior") {
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


	return (
		<>
			<Row>
				<h1>Your avaiable Warriors</h1>
			</Row>
			{loading && (
				<div className="loading">
					<img src="loading.gif" alt="loading" style={{ height: '100px'}}/>
					</div>
			)}
			{!loading &&
					<Row>
					{!loading &&
							view === "nft-grid" &&
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
									</Card.Body>
									</Card>
							</Col>
							))}
					</Row>
			}
			{show && (
        <AlertDismissible title={title} message={message} setShow={setShow} />
      )}
		</>
	)
}

export default Warriors;