import '../styles/globals.css'
import { MoralisProvider } from "react-moralis";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: 'https://api.studio.thegraph.com/query/44491/web3drive_/0.0.2',
})

export default function App({ Component, pageProps }) {
  return (
    <MoralisProvider initializeOnMount={false}>
      <ApolloProvider client={client}>
        <Component {...pageProps} />
      </ApolloProvider>
    </MoralisProvider>
    )
}
