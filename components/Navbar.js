import React from "react";
import { useEffect, useState } from 'react';
import { ConnectButton } from "web3uikit"

function Navbar() {
    
    return (
        <div>
            <div className="Navbar">
                <img src="./Web3Drive.png" width={150} height={100} className="logo"></img>
                <div className="ConnectButton">
                    <ConnectButton moralisAuth={false}/>
                </div>
            </div>
        </div>
        
    )
}
export default Navbar;



