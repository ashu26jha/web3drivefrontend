import { useQuery,gql } from "@apollo/client";
const GET_ACTIVE_ITEM = gql`
{
    activeFiles(first: 5) {
      id
      tokenId
      ipfsHash
      Account
    }
  }
`
export default function GraphExample(){
    const {loading, error, data} = useQuery(GET_ACTIVE_ITEM);
    console.log(data)
}
