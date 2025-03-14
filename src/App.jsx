import { useEffect, useState } from "react";
import "./App.css";
import { useAccount, useConnectors, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { mainnet, sepolia, polygon, base } from "wagmi/chains";
import { reconnect } from "@wagmi/core";

function App() {
  const { address, chain, isConnected, connector } = useAccount();
  const connectors = useConnectors();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const [click, setClick] = useState(false);

  const supportedChains = [mainnet, sepolia, polygon, base];

 
  useEffect(() => {
    reconnect(); 
  }, []);

  useEffect(() => {
    if (isConnected) {
      setClick(true); 
    }
  }, [isConnected]);

  const handleConnectClick = async (_connector) => {
    try {
      await connect({ connector: _connector });
      setClick(true);
    } catch (error) {
      console.error("Connection error:", error);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setClick(false);
  };

  const handleSwitchChain = async (chainId) => {
    try {
      await switchChain({ chainId: Number(chainId) });
    } catch (error) {
      console.error("Error switching chain:", error);
    }
  };

  return (
    <>
      {isConnected && address ? (
        <div>
          <h2>Address: {address}</h2>
          <p>Chain: {chain?.name || "Unknown"}</p>

          
          <label>Switch Chain:</label>
          <select value={chain?.id} onChange={(e) => handleSwitchChain(e.target.value)}>
            {supportedChains.map((chain) => (
              <option key={chain.id} value={chain.id}>
                {chain.name}
              </option>
            ))}
          </select>

          <br />
          <button onClick={handleDisconnect}>Disconnect</button>
        </div>
      ) : (
        <button onClick={() => setClick(true)}>Connect Wallet</button>
      )}

      {click && !isConnected && (
        <div>
          {connectors.map((connector) => (
            <button key={connector.id} onClick={() => handleConnectClick(connector)}>
              {connector.name}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

export default App;
