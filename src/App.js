import React from 'react'
import './App.css';
import { useWallet, WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import State from './context/State'

//all the pages
import Home from './components/pages/Home'
import Campaign from './components/pages/Campaign'
import CreateCampaign from './components/pages/CreateCampaign'

require('@solana/wallet-adapter-react-ui/styles.css')

const wallets = [ new PhantomWalletAdapter()]


function App() {
  const wallet = useWallet()


  return (
    <React.Fragment>
      {
      !wallet.connected &&
        (<div style={{display: 'flex', justifyContent: 'center', marginTop: '100px'}}>
          <WalletMultiButton />
        </div>)
    }
    {
     wallet.connected &&
      <State>
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/campaign/:id" element={<Campaign />} />
          <Route path="/create" element={<CreateCampaign />} />
        </Routes>
      </BrowserRouter>
    </div>
    </State>
    }
    </React.Fragment>
  );
}

const AppWithProvider = () => {
  return (
    <ConnectionProvider endpoint={clusterApiUrl("devnet")}>
      <WalletProvider wallets={wallets} autoConnect={true}>
        <WalletModalProvider>
          <App />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default AppWithProvider;
