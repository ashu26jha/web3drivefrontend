import { useEffect, useState } from "react";

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

function Metamask() {
    
    
    
    return (

        <>
            <button onClick={connectWallet}> Connect</button>
        </>
    )
}
export { Metamask,getcurrentconnectedAccounts,connectWallet,addWalletListener };
