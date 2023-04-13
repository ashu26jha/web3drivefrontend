import Head from 'next/head';
import Navbar from "../components/Navbar";
import Cards from "../components/Cards";
import { useMoralis, useWeb3Contract } from "react-moralis";
import AddFile from "../components/AddFile";
import Footer from "../components/Footer";
import contractAddresses from '../constants/networkMapping.json';
import abi from "../constants/web3drive.json";
import { gql, useQuery } from '@apollo/client';
import axios from 'axios'



export default function Home() {

  const { chainId: chainIdHex } = useMoralis()
  const chainId = parseInt(chainIdHex);
  const web3driveAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
  let account = '0x74c7b157af4E5418F03eb928DF309cc98CE38E66';
  if (typeof (window) != 'undefined') {
    account = window.ethereum.selectedAddress;
  }
  const GET_ACTIVE_ITEM = gql`
  {
    activeFiles(
      first: 10
    ) {
      id
      tokenId
      ipfsHash
      Account
      Privilege
    }
  }
`

  const GET_DELETE_ITEM = gql`
  {
    fileDeleteds(first: 10) {
      token
      whoDeleted
    }
  }
  `

  const { data: dataRecievedActiveFiles } = useQuery(GET_ACTIVE_ITEM);
  const { data: dataRecievedDeletedFiles } = useQuery(GET_DELETE_ITEM);
  const activeItems = [];
  if (dataRecievedActiveFiles) {
    for (let i = 0; i < dataRecievedActiveFiles.activeFiles.length; i++) {
      if (dataRecievedActiveFiles.activeFiles[i].Account == account) {
        const temp = {
          tokenId: dataRecievedActiveFiles.activeFiles[i].tokenId,
          ipfs: dataRecievedActiveFiles.activeFiles[i].ipfsHash,
          account: dataRecievedActiveFiles.activeFiles[i].Account
        }
        activeItems.push(temp);
      }
    }
  }
  console.log('Active Items', activeItems)
  console.log(dataRecievedActiveFiles)


  const activeFilesTokens = [];
  const deletedFileTokens = [];

  if (dataRecievedActiveFiles) {
    for (let i = 0; i < dataRecievedActiveFiles.activeFiles.length; i++) {
      if (dataRecievedActiveFiles.activeFiles[i].Account == account) {
        activeFilesTokens.push(dataRecievedActiveFiles.activeFiles[i].tokenId);
      }
    }
  }

  if (dataRecievedDeletedFiles) {
    for (let i = 0; i < dataRecievedDeletedFiles.fileDeleteds.length; i++) {
      console.log("HEL")
      deletedFileTokens.push(dataRecievedDeletedFiles.fileDeleteds[i].token);
    }
  }

  const tokens = [];
  for (let i = 0; i < activeFilesTokens.length; i++) {
    if (deletedFileTokens.indexOf(activeFilesTokens[i]) == -1) {
      tokens.push(activeFilesTokens[i]);
    }
  }

  console.log('Tokens active', tokens);

  const { runContractFunction: changeAccessLevel } = useWeb3Contract({
    abi: abi,
    contractAddress: web3driveAddress,
    functionName: "changeAccessLevel",
    params: {
      account: '0x62273214392D066823750fDaf449C57f608Fc26B',
      tokenId: 1,
      level: 3
    },
  });

  const { runContractFunction: deleteFile } = useWeb3Contract({
    abi: abi,
    contractAddress: web3driveAddress,
    functionName: "deleteFile",
    params: {
      tokenId: 3,
    },
  });

  async function Share() {

    const web3driveAddress = contractAddresses['80001'][0]
    async function RunContractFunction() {
      const txResponse = await changeAccessLevel();
      console.log()
    }

    const a = await RunContractFunction()
  }

  async function Delete() {
    async function RunDeleteFunction() {
      const txResponse = await deleteFile();
    }

    await RunDeleteFunction()

    // Unpin from pinata
    const index = localStorage.getItem("Index Clicked");
    let imageIPFShash;
    await axios.get(`https://ipfs.io/ipfs/${activeItems[index].ipfs}`)
      .then(function (response) {
        imageIPFShash = (response.data.imageHash);
        console.log(imageIPFShash)
      })
      .catch(function (error) {
        console.log(error);
      });

    const JSONurl = 'https://api.pinata.cloud/pinning/unpin/' + activeItems[index].ipfs;
    const IMGurl = 'https://api.pinata.cloud/pinning/unpin/' + imageIPFShash;
    console.log('Unpining from pinata')
    var configJSON = {
      method: 'delete',
      url: JSONurl,
      headers: {
        pinata_api_key: `577cdfa2517b73ed5ed1`,
        pinata_secret_api_key: `135beabb2b4aa3e5939bb6ea4dde06356d96b3fc99cb953d383817d1befd5049`,
      }
    };
    const resJSON = await axios(configJSON);
    console.log('JSON unpined',resJSON.data)
    
    var configIMG = {
      method: 'delete',
      url: IMGurl,
      headers: {
        pinata_api_key: `577cdfa2517b73ed5ed1`,
        pinata_secret_api_key: `135beabb2b4aa3e5939bb6ea4dde06356d96b3fc99cb953d383817d1befd5049`,
      }
    };
    const resIMG = await axios(configIMG);
    console.log(resIMG.data)

  }

  function Open() {
    const index = localStorage.getItem("Index Clicked");
    let url = "https://ipfs.io/ipfs/" + activeItems[index].ipfs
    window.open(url);
  }

  return (
    <>

      <Head>
        <title>Web3 Drive</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <AddFile web3driveAddress={web3driveAddress} abi={abi} />
      {console.log("SS")}
      <div id='hideNavbar'><button id='internal' onClick={Open}>Open</button><button id='internal'>Comment</button><button id='internal' onClick={Share}>Share</button><button id='internal' onClick={Delete}>Delete</button></div>
      <div className='wrapper'>
        {activeItems ? activeItems.map((a, index) => {
          console.log(a)
          return (
            <>
              {tokens.indexOf(a.tokenId) != -1 ? <Cards ipfs={a.ipfs} index={index} /> : <div></div>}
            </>
          )
        }) : <div className='loading'>Loading...</div>}

      </div>
      <Footer web3driveAddress={web3driveAddress} abi={abi} />
    </>
  )
}
