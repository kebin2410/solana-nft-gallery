import {
  Container,
  Dropdown,
  DropdownButton,
  Nav,
  Navbar,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { useWallet } from "@solana/wallet-adapter-react";

const Navigationbar = (props) => {
  function onChange(val) {
    if (val === "devnet") {
      props.setNetwork(WalletAdapterNetwork.Devnet);
      props.setTitle("Devnet");
      props.setVariant("primary");
    } else if (val === "testnet") {
      props.setNetwork(WalletAdapterNetwork.Testnet);
      props.setTitle("Testnet");
      props.setVariant("warning");
    } else if (val === "mainnet") {
      props.setNetwork(WalletAdapterNetwork.Mainnet);
      props.setTitle("Mainnet");
      props.setVariant("success");
    }
  }

  return (
    <Navbar collapseOnSelect expand="lg" style={{ backgroundColor: "#111827" }}>
      <WalletMultiButton className="wallet-btn" />
      <Container>
        <Navbar.Brand href="/" style={{ color: "#fff" }}>
          Solana Gallery
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto"></Nav>
          <Nav>
            <DropdownButton
              variant={props.variant.toLowerCase()}
              id="dropdown-basic-button"
              title={props.title}
              onSelect={(evt) => onChange(evt)}
            >
              <Dropdown.Item eventKey="mainnet">Mainnet</Dropdown.Item>
              <Dropdown.Item eventKey="devnet">Devnet</Dropdown.Item>
              <Dropdown.Item eventKey="testnet">Testnet</Dropdown.Item>
            </DropdownButton>
          </Nav>
          <Nav>
            <Nav.Link></Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
export default Navigationbar;
