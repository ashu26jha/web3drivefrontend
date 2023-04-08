import { useEffect, useState } from 'react';
import { useMoralis, useWeb3Contract } from "react-moralis"
import axios from "axios";

export default function AddFile({ web3driveAddress, abi }) {
    const { isWeb3Enabled } = useMoralis();
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("No file Selected");
    const [IPFSHASH, setipfshash] = useState(null);
    // const {isWeb3Enabled} = useMoralis()
    const { runContractFunction: addFile } = useWeb3Contract({
        abi: abi,
        contractAddress: web3driveAddress,
        functionName: "addFile",
        params: { name: fileName, ipfshash: IPFSHASH },
    })
    useEffect(() => {
        if (IPFSHASH) {
            async function updateUI() {
                const response = await addFile();
                console.log(response);
                setipfshash(null)
            }
            updateUI()
        }
    }, [IPFSHASH])

    async function handleSubmit(e) {
        e.preventDefault();

        // console.log(e.target.files[0])
        if (file) {

            try {

                const formData = new FormData();
                formData.append("file", file);
                console.log("Uploading to pinata")

                const resFile = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
                    maxBodyLength: "Infinity",
                    headers: {
                        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                        pinata_api_key: `577cdfa2517b73ed5ed1`,
                        pinata_secret_api_key: `135beabb2b4aa3e5939bb6ea4dde06356d96b3fc99cb953d383817d1befd5049`,
                    }
                });
                console.log("File uploaded to pinata");
                const hash = resFile.data.IpfsHash;

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

                console.log(res.data.IpfsHash);
                setipfshash(res.data.IpfsHash)

            }
            catch (e) {
                console.log(e);
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

        console.log(data);
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
                        Click here to choose a file 📄<br />
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
