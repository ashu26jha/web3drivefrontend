import {gql} from "@apollo/client"
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

export default GET_ACTIVE_ITEM
