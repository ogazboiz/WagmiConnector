
import { useEffect, useState } from "react"
import "./App.css"
import { useAccount, useConnectors, useConnect, useDisconnect, useSwitchChain } from "wagmi"
import { mainnet, sepolia, polygon, base } from "wagmi/chains"
import { reconnect } from "@wagmi/core"
import { UserPlus, LogOut, ChevronRight, X, Wallet,PaintBucket, WalletMinimal  } from "lucide-react"


function App() {
  const { address, chain, isConnected, connector } = useAccount()
  const connectors = useConnectors()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()
  const [showModal, setShowModal] = useState(false)

  const supportedChains = [mainnet, sepolia, polygon, base]

  useEffect(() => {
    reconnect()
  }, [])

  useEffect(() => {
    if (isConnected) {
      setShowModal(false)
    }
  }, [isConnected])

  const handleConnectClick = async (_connector) => {
    try {
      await connect({ connector: _connector })
    } catch (error) {
      console.error("Connection error:", error)
    }
  }

  const handleDisconnect = () => {
    disconnect()
  }

  const handleSwitchChain = async (chainId) => {
    try {
      await switchChain({ chainId: Number(chainId) })
    } catch (error) {
      console.error("Error switching chain:", error)
    }
  }

  const truncateAddress = (address) => {
    if (!address) return ""
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
      <header className="mb-8">
        <h1 className="text-xl font-semibold text-gray-800">Wallet Connect</h1>
        <h3 className="flex justify-center items-center gap-1">ogazboizKit <PaintBucket className="h-5 w-5 text-blue-500" />      </h3> 
      </header>

      <div className="w-full max-w-md">
        {isConnected ? (
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 bg-gray-50">
                <Wallet className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">{truncateAddress(address)}</span>
                <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                  {chain?.name || "Unknown"}
                </span>
              </div>

              <button
                onClick={handleDisconnect}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 transition text-red-500 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Disconnect
              </button>
            </div>

            <div className="w-full bg-gray-50 p-4 rounded-xl">
              <h3 className="text-sm font-medium mb-3 text-gray-700">Switch Network</h3>
              <div className="relative">
                <select
                  value={chain?.id || ""}
                  onChange={(e) => handleSwitchChain(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-200 text-gray-700 py-2.5 px-5 pr-10 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                >
                  <option value="" disabled>
                    Select Network
                  </option>
                  {supportedChains.map((supportedChain) => (
                    <option key={supportedChain.id} value={supportedChain.id}>
                      {supportedChain.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <ChevronRight className="h-4 w-4 transform rotate-90" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center mx-auto gap-2 px-5 py-2.5 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition shadow-sm"
          >
            <UserPlus className="h-4 w-4" />
            Connect Wallet
          </button>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-xl font-semibold mb-6">Connect Wallet</h2>

            <div className="space-y-3">
              {connectors.map((connector) => (
                <button
                  key={connector.id}
                  onClick={() => handleConnectClick(connector)}
                  className="flex items-center gap-3 w-full px-5 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition text-left"
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    {connector.id === "io.metamask" && <span className="text-lg">🦊</span>}
                    {connector.id === "app.phantom" && <span className="text-lg">👻</span>}
                    {connector.id === "coinbaseWallet" && <span className="text-lg">📱</span>}
                    {connector.id === "walletConnect" && <span className="text-lg"><WalletMinimal  className="text-blue-500"/></span>}
                    {!["metaMask", "coinbaseWallet", "walletConnect"].includes(connector.id) && (
                      <Wallet className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{connector.name}</p>
                    <p className="text-xs text-gray-500">Connect using {connector.name}</p>
                  </div>
                </button>
              ))}
            </div>
            <footer className="mt-6 text-center text-gray-500 text-sm">
              Made by <span className="font-semibold text-blue-600">Ogazboiz</span>
            </footer>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
