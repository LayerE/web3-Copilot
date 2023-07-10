import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import {
  mainnet,
  optimism,
  polygon,
  polygonMumbai,
  polygonZkEvm,
  polygonZkEvmTestnet,
} from "wagmi/chains";
import Layout from "@/layouts/app.layout";
import ThemeProvider, { ThemedGlobalStyle } from "@/theme";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { AppContextProvider } from "@/context/app.context";
import "tippy.js/dist/tippy.css"; // optional
import { TourProvider } from "@reactour/tour";
import { disableBody, enableBody, useSteps } from "@/utils/onboard.config";
import ErrorBoundary from "@/components/ErrorBoundries";
const projectId = "828203d46d0e4b5f290a0bc2946a2ee4";

// 2. Configure wagmi client
const chains = [
  mainnet,
  polygon,
  optimism,
  polygonMumbai,
  polygonZkEvm,
  polygonZkEvmTestnet,
];

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    ...w3mConnectors({ version: 2, chains, projectId }),
    new CoinbaseWalletConnector({
      options: {
        appName: "polygon copilot",
        darkMode: true,
      },
      chains,
    }),
  ],
  publicClient,
});

// 3. Configure modal ethereum client
const ethereumClient = new EthereumClient(wagmiConfig, chains);
export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <WagmiConfig config={wagmiConfig}>
        <ThemeProvider>
          <ThemedGlobalStyle />
          <AppContextProvider>
            <TourProvider
              steps={useSteps()}
              afterOpen={disableBody}
              beforeClose={enableBody}
              styles={{
                popover: (base) => ({
                  ...base,
                  "--reactour-accent":
                    "radial-gradient(100% 100% at 50% 0%, #9659FF 0%, #5A2EA8 99.95%)",
                  background: "black",
                  borderRadius: 10,
                }),

                maskArea: (base) => ({ ...base, rx: 10 }),
                maskWrapper: (base) => ({ ...base, color: "#313131" }),
                badge: (base) => ({
                  ...base,
                  left: "auto",
                  right: "-1em",
                  color: "black",
                }),
                controls: (base) => ({ ...base, marginTop: 20, color: "red" }),
                arrow: (base) => ({ ...base, color: "#A976FF" }),
                close: (base) => ({
                  ...base,
                  right: "auto",
                  left: 10,
                  top: 10,
                  color: "white",
                  margin: ".25rem",
                }),
              }}
              position="left"
              disableInteraction={true}
              scrollSmooth={true}
              onClickMask={() => {}} //disables mask onClick close event listener
            >
              <Layout>
                <Component {...pageProps} />
                <Toaster position="top-right" reverseOrder={false} />
              </Layout>
            </TourProvider>
          </AppContextProvider>
        </ThemeProvider>
      </WagmiConfig>
      <Web3Modal
        projectId={projectId}
        ethereumClient={ethereumClient}
        themeMode="dark"
        explorerRecommendedWalletIds={[
          "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96",
          "1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369",
          "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0",
        ]}
        themeVariables={{
          "--w3m-background-color": "#7b3fe3",
          "--w3m-logo-image-url":
            "https://assets.polygon.technology/brandAssets/polygon_logo_monochrome_white.svg",
        }}
        walletImages={{
          coinbaseWallet:
            "https://explorer-api.walletconnect.com/v3/logo/lg/a5ebc364-8f91-4200-fcc6-be81310a0000?projectId=2f05ae7f1116030fde2d36508f472bfb",
        }}
      />
    </ErrorBoundary>
  );
}
