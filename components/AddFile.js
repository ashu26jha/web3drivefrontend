import { useState } from "react";
import { useMoralis } from "react-moralis"
import fs from 'fs';
import axios from "axios";

export default function AddFile({ abi, contractAddress }) {
    const { isWeb3Enabled } = useMoralis();
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("No file Selected")

    async function handleSubmit(e) {
        e.preventDefault();
        // console.log(e.target.files[0])
        if (file) {

            try {

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
                console.log(resFile)
            }
            catch (e) {
                console.log(e);
            }
        }
    }
    async function retrieveFile(e) {
        console.log(e.target.files[0]);
        const data = e.target.files[0];
        console.log(data);
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
                    <label htmlFor="file-upload"  class="custom-file-upload">
                        Click here to choose a file 📄<br/>
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
