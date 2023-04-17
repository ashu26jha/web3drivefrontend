import { useEffect, useState } from 'react';
import { useMoralis, useWeb3Contract } from "react-moralis"
import axios from "axios";
export default function AddFile({ web3driveAddress, abi, tokenId }) {
    const { isWeb3Enabled } = useMoralis();
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("No file Selected");
    const [IPFSHASH, setipfshash] = useState(null);
    const [UpdateHash,setUpdateHash] = useState(null);

    const { runContractFunction: addFile } = useWeb3Contract({
        abi: abi,
        contractAddress: web3driveAddress,
        functionName: "addFile",
        params: { 
            ipfsHash: IPFSHASH 
        },
    });

    const { runContractFunction: tokenIDtoIPFS } = useWeb3Contract({
        abi: abi,
        contractAddress: web3driveAddress,
        functionName: "tokenIDtoIPFS",
        params: { 
            tokenId: tokenId 
        },
    });

    const { runContractFunction: updateIPFS } = useWeb3Contract({
        abi: abi,
        contractAddress: web3driveAddress,
        functionName: "updateIPFS",
        params: { 
            tokenId: tokenId,
            ipfsHash: UpdateHash
        },
    });

    useEffect(() => {
        if (IPFSHASH) {
            async function updateUI() {
                const txResponse = await addFile();
                setipfshash(null)
            }
            updateUI()
        }
    }, [IPFSHASH])

    useEffect(()=>{
        if(UpdateHash){
            async function RunFunction(){
                const txResponse = await updateIPFS();
            }
            RunFunction();
        }
    },[UpdateHash])

    async function handleSubmit(e) {
        e.preventDefault();

        if (file) {
            if (tokenId) {
                console.log("Good")
                // Pin to IPFS
                const formData = new FormData();
                formData.append("file", file);

                const resFile = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
                    maxBodyLength: "Infinity",
                    headers: {
                        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                        pinata_api_key: `577cdfa2517b73ed5ed1`,
                        pinata_secret_api_key: `135beabb2b4aa3e5939bb6ea4dde06356d96b3fc99cb953d383817d1befd5049`,
                    }
                });
                const hash = resFile.data.IpfsHash;
                console.log('IMAGE TO IPFS :' ,hash);
                // Now creating URI for the corresponding
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const owner = accounts[0];

                var data = JSON.stringify({
                    "pinataOptions": {
                        "cidVersion": 1
                    },
                    "pinataMetadata": {
                        "name": "testing",
                        "keyvalues": {
                            "customKey": "customValue",
                            "customKey2": "customValue2"
                        }
                    },
                    "pinataContent": {
                        "name": `${fileName}`,
                        "imageHash": `${hash}`,
                        "owner": `${owner}`,
                        "comments": [{
                            "": ""
                        }]
                    }
                });
                var config = {
                    method: 'post',
                    url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
                    headers: {
                        'Content-Type': 'application/json',
                        pinata_api_key: `577cdfa2517b73ed5ed1`,
                        pinata_secret_api_key: `135beabb2b4aa3e5939bb6ea4dde06356d96b3fc99cb953d383817d1befd5049`,
                    },
                    data: data
                };

                const res = await axios(config);
                console.log("JSON TO IPFS",res)
                // Unpin from IPFS
                const hashfromtoken = await tokenIDtoIPFS();
                console.log('HASH FROM TOKEN',hashfromtoken)
                let imageIPFShash;
                await axios.get(`https://ipfs.io/ipfs/${hashfromtoken}`)
                .then(function (response) {
                    imageIPFShash = (response.data.imageHash);
                })
                .catch(function (error) {
                    console.log(error);
                });
                console.log('IMAGE TO BE UNPINNED',imageIPFShash)

                const JSONurl = 'https://api.pinata.cloud/pinning/unpin/' + hashfromtoken;
                const IMGurl = 'https://api.pinata.cloud/pinning/unpin/' + imageIPFShash;

                var configJSON = {
                    method: 'delete',
                    url: JSONurl,
                    headers: {
                      pinata_api_key: `577cdfa2517b73ed5ed1`,
                      pinata_secret_api_key: `135beabb2b4aa3e5939bb6ea4dde06356d96b3fc99cb953d383817d1befd5049`,
                    }
                };
                const resJSON = await axios(configJSON);
                console.log('JSON DELETED : ',resJSON)
              
                var configIMG = {
                    method: 'delete',
                    url: IMGurl,
                    headers: {
                      pinata_api_key: `577cdfa2517b73ed5ed1`,
                      pinata_secret_api_key: `135beabb2b4aa3e5939bb6ea4dde06356d96b3fc99cb953d383817d1befd5049`,
                    }
                };
                const resIMG = await axios(configIMG);
                console.log('IMAGE DELETED',resIMG)
                // //Edit the smart contract
                console.log(res.data.IpfsHash);
                setUpdateHash(res.data.IpfsHash)
                
            }
            else {
                try {
                    console.log(tokenId);

                    console.log("Bahar")
                    const formData = new FormData();
                    formData.append("file", file);

                    const resFile = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
                        maxBodyLength: "Infinity",
                        headers: {
                            'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                            pinata_api_key: `577cdfa2517b73ed5ed1`,
                            pinata_secret_api_key: `135beabb2b4aa3e5939bb6ea4dde06356d96b3fc99cb953d383817d1befd5049`,
                        }
                    });
                    const hash = resFile.data.IpfsHash;
                    console.log(hash);
                    // Now creating URI for the corresponding
                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    const owner = accounts[0];

                    var data = JSON.stringify({
                        "pinataOptions": {
                            "cidVersion": 1
                        },
                        "pinataMetadata": {
                            "name": "testing",
                            "keyvalues": {
                                "customKey": "customValue",
                                "customKey2": "customValue2"
                            }
                        },
                        "pinataContent": {
                            "name": `${fileName}`,
                            "imageHash": `${hash}`,
                            "owner": `${owner}`,
                            "comments": [{
                                "": ""
                            }]
                        }
                    });
                    var config = {
                        method: 'post',
                        url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
                        headers: {
                            'Content-Type': 'application/json',
                            pinata_api_key: `577cdfa2517b73ed5ed1`,
                            pinata_secret_api_key: `135beabb2b4aa3e5939bb6ea4dde06356d96b3fc99cb953d383817d1befd5049`,
                        },
                        data: data
                    };

                    const res = await axios(config);
                    setipfshash(res.data.IpfsHash);
                }
                catch (e) {
                    console.log(e);
                }
            }

        }
    }
    async function retrieveFile(e) {
        const data = e.target.files[0];
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(data);
        reader.onloadend = () => {
            setFile(e.target.files[0]);
        }
        setFileName(e.target.files[0].name)
        e.preventDefault()
    }

    async function dropHandler(e) {
        e.preventDefault()
        const data = e.dataTransfer.files[0]

        const reader = new window.FileReader();
        reader.readAsArrayBuffer(data);
        reader.onloadend = () => {
            setFile(data);
        }
        setFileName(data.name)

    }


    function dragOverHandler(e) {
        e.preventDefault();
    }

    return (
        <div id="drop_zone" onDrop={dropHandler} onDragOver={dragOverHandler} >
            <form className="form-input" onSubmit={handleSubmit}>
                <div className="choose">
                    <label htmlFor="file-upload" class="custom-file-upload">
                        Click here to {tokenId ? <div id='push-right'>edit the file</div> : <div id='push-right'>choose a file 📄</div>}<br />
                    </label>
                </div>

                <input
                    disabled={!isWeb3Enabled}
                    type="file"
                    id="file-upload"
                    name="data"
                    onChange={retrieveFile}
                >
                </input>
                <div className="textArea">
                    <span className="">File: {fileName}</span>
                    <button type="submit" className="upload">Submit</button>
                </div>
            </form>

            <div className="dragndrop">
                {!file ? <div>Drag one or more files to this <i>drop zone</i>.</div> : <div></div>}
            </div>
        </div>
    )
}
