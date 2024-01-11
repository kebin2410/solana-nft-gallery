import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import * as anchor from "@project-serum/anchor";
import {
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  createInitializeMintInstruction,
  MINT_SIZE,
} from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { Program, Provider, web3 } from "@project-serum/anchor";
import idl from "../contract/idl.json";
import AddWarriorModal from "./addWarriorModal";

const { SystemProgram, Keypair } = web3;
const baseAccount = Keypair.generate();
const programID = new PublicKey(idl.metadata.address);
const opts = {
  preflightCommitment: "processed",
};

const Quests = () => {
  const { nfts } = useSelector((state) => {
    return {
      nfts: state.nfts,
    };
  });
  const wallet = useWallet();
  const getProvider = async () => {
    /* create the provider and return it to the caller */
    /* network set to local network for now */
    const network = "https://metaplex.devnet.rpcpool.com";
    const connection = new Connection(network, opts.preflightCommitment);

    const provider = new Provider(connection, wallet, opts.preflightCommitment);
    return provider;
  };
  const [show, setshow] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState({});

  useEffect(() => {
    console.log(nfts);
  }, [nfts]);

  const showAddWarrior = () => {
    setshow(true);
  };

  const startExpedition = async () => {
    // Configure the client to use the local cluster.
    const provider = await getProvider();
    console.log(provider);
    /* create the program interface combining the idl, program ID, and provider */
    const program = new Program(idl, programID, provider);
    const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
      "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
    );
    const lamports =
      await program.provider.connection.getMinimumBalanceForRentExemption(
        MINT_SIZE
      );

    const getMetadata = async (mint) => {
      return (
        await anchor.web3.PublicKey.findProgramAddress(
          [
            Buffer.from("metadata"),
            TOKEN_METADATA_PROGRAM_ID.toBuffer(),
            mint.toBuffer(),
          ],
          TOKEN_METADATA_PROGRAM_ID
        )
      )[0];
    };
    const getMasterEdition = async (mint) => {
      return (
        await anchor.web3.PublicKey.findProgramAddress(
          [
            Buffer.from("metadata"),
            TOKEN_METADATA_PROGRAM_ID.toBuffer(),
            mint.toBuffer(),
            Buffer.from("edition"),
          ],
          TOKEN_METADATA_PROGRAM_ID
        )
      )[0];
    };
    const mintKey = anchor.web3.Keypair.generate();
    // console.log(mintKey.publicKey + "");
    const NftTokenAccount = await getAssociatedTokenAddress(
      mintKey.publicKey,
      provider.wallet.publicKey
    );
    console.log("NFT Account: ", NftTokenAccount.toBase58());

    const mint_tx = new anchor.web3.Transaction().add(
      anchor.web3.SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: mintKey.publicKey,
        space: MINT_SIZE,
        programId: TOKEN_PROGRAM_ID,
        lamports,
      }),
      createInitializeMintInstruction(
        mintKey.publicKey,
        0,
        wallet.publicKey,
        wallet.publicKey
      ),
      createAssociatedTokenAccountInstruction(
        wallet.publicKey,
        NftTokenAccount,
        wallet.publicKey,
        mintKey.publicKey
      )
    );
    const res = await program.provider.send(mint_tx, [mintKey]);
    console.log(
      await program.provider.connection.getParsedAccountInfo(mintKey.publicKey)
    );
    console.log("Account: ", res);
    console.log("Mint key: ", mintKey.publicKey.toString());
    console.log("User: ", program.provider.wallet.publicKey.toString());
    const metadataAddress = await getMetadata(mintKey.publicKey);
    const masterEdition = await getMasterEdition(mintKey.publicKey);
    console.log("Metadata address: ", metadataAddress.toBase58());
    console.log("MasterEdition: ", masterEdition.toBase58());
    console.log(SystemProgram.programId + "");
    const tx = await program.methods
      .mintNft(
        mintKey.publicKey,
        "https://arweave.net/Isuue2pI2LM3gGozamGPX2YHNRFlLHXWFc60otl8WnY",
        "Red Box",
        "Lootbox"
      )
      .accounts({
        mintAuthority: wallet.publicKey,
        mint: mintKey.publicKey,
        tokenAccount: NftTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        metadata: metadataAddress,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        payer: wallet.publicKey,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        masterEdition: masterEdition,
      })
      .rpc();
    console.log("Your transaction signature", tx);
  };

  return (
    <>
      <div>
        <h1 className="title">Quests</h1>
        <Row className="quest-item">
          <Col lg={6}>
            <h3>Quest1</h3>
            <p>This is the first Quest</p>
            <p>Cost: 10 Kage</p>
            <p>Warriors Required: 1 Minimum</p>
            <Button onClick={showAddWarrior}>Add Warrior</Button>
            <Button onClick={startExpedition} style={{ marginLeft: 10 }}>
              Start Expedition
            </Button>
          </Col>
          <Col lg={6}>
            <Row>
              <Col xs="12" md="12" lg="4">
                {selectedNFT.data ? (
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
                      src={selectedNFT?.image}
                      alt={selectedNFT?.name}
                    />
                    <Card.Body>
                      <Card.Title style={{ color: "#fff" }}>
                        {selectedNFT?.name}
                      </Card.Title>
                    </Card.Body>
                    <Card.Footer>
                      <Button onClick={() => setSelectedNFT({})}>Remove</Button>
                    </Card.Footer>
                  </Card>
                ) : (
                  <p>No NFT selected</p>
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      <AddWarriorModal
        setshow={setshow}
        show={show}
        setSelectedNFT={setSelectedNFT}
      />
    </>
  );
};

export default Quests;
