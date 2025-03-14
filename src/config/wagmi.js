import { http, createConfig } from "wagmi";
import { mainnet, polygon, sepolia, base } from "wagmi/chains";
import { walletConnect } from "wagmi/connectors";
export const config = createConfig({
  chains: [mainnet, sepolia,polygon, base],
  connectors: [
    walletConnect({
      projectId: import.meta.env.VITE_PROVIDER,
    }),
  ],
  multiInjectedProviderDiscovery: true,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [base.id]: http(),
  },
});
