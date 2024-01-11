import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import NavigationBar from "./navbar/NavigationBar";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import Footer from "./navbar/footer";
import store from "./redux/store";
import Lootbox from "./pages/lootbox";

// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");
const Main = () => {
  const [network, setNetwork] = useState(WalletAdapterNetwork.Devnet);
  const [variant, setVariant] = useState("success");
  const [title, setTitle] = useState("Devnet");

  useEffect(() => {
    console.log(`Network changed ${network}`);
  }, [network]);

  const endpoint = useMemo(
    () => "https://metaplex.devnet.rpcpool.com",
    [network]
  );

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
      new SolletWalletAdapter({ network }),
      new SolletExtensionWalletAdapter({ network }),
    ],
    [network]
  );

  return (
    <Provider store={store}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <Fragment>
              <NavigationBar
                setNetwork={setNetwork}
                variant={variant}
                setVariant={setVariant}
                title={title}
                setTitle={setTitle}
              />
              <BrowserRouter>
                <Routes>
                  <Route
                    path="/home"
                    element={
                      <App
                        connection={endpoint}
                        variant={variant}
                        title={title}
                      />
                    }
                  />
                  <Route path="/" element={<Lootbox connection={endpoint} />} />
                </Routes>
              </BrowserRouter>

              <Footer />
            </Fragment>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </Provider>
  );
};
export default Main;
