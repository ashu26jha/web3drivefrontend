import React from "react";
import { useEffect, useState } from 'react';

function Navbar() {
    const [walletAddress, setwalletAddress] = useState("");
    useEffect(() => {
        if (walletAddress) {
            document.getElementById("button").classList.add("accountActive");
        }
        else {
            console.log(walletAddress)
            document.getElementById("button").classList.remove("accountActive");
        }
        getcurrentconnectedAccounts();
        addWalletListener();
    })
    const connectWallet = async () => {
        if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                setwalletAddress(accounts[0]);
            }
            catch (e) {
                console.log(e);
            }
        }
        else {
            console.log("Please install metamask")
        }
    }

    const addWalletListener = async () => {
        if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
            window.ethereum.on("accountsChanged", (accounts) => {
                setwalletAddress(accounts[0])
                console.log(accounts[0])
            })
        }
        else {
            setwalletAddress("");
        }
    }

    const getcurrentconnectedAccounts = async () => {
        if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await window.ethereum.request({ method: "eth_accounts" });
                if (accounts[0].length > 0) {
                    setwalletAddress(accounts[0]);
                    console.log(accounts[0])
                }
            }
            catch (e) {
                console.log(e);
            }
        }
        else {
            console.log("Please install metamask")
        }
    }
    return (
        <div>
            <img src="./Web3Drive.png" width={150} height={100} className="logo"></img>
            <button className="connectButton" id="button" onClick={connectWallet} >{(walletAddress && walletAddress.length > 0) ? `Connected to ${walletAddress.substring(0, 4)}...${walletAddress.substring(38, 42)}` : "Connect to Metamask 🦊"}</button>
        </div>
    )
}
export default Navbar;
