import { useState } from "react"
import axios from 'axios'

export default function Cards({ ipfs, index }) {
    function handleClick() {
        localStorage.setItem("Index Clicked", index);
        console.log(localStorage.getItem("Index Clicked"));
        document.getElementById("hideNavbar").style.display = 'flex';
    }
    let name = "";

    const [imageHash, setImageHash] = useState(ipfs);
    if (ipfs) {
        axios.get(`https://ipfs.io/ipfs/${ipfs}`)
            .then(function (response) {
                console.log();
                setImageHash(response.data.imageHash)
                name = response.data.name;
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    console.log(imageHash)
    const extension = name.slice(name.indexOf('.') + 1,);
    return (
        <div className="card select" onClick={handleClick}>
            <div class="top-left"></div>
            <div className="extension">{extension}</div>
            <div className="name">{name ? name : <>No Name</>}</div>
            {imageHash ? <div className="ipfs">IPFS: {imageHash.slice(0, 4)}...{imageHash.slice(40,)}</div> : <div>Hash unavailable..</div>}
        </div>
    )
}


