import { useEffect, useState } from "react"


export default function Footer({web3driveAddress}) {


    return (
        <footer>
            <h3>{web3driveAddress ? <div>Deployed at {web3driveAddress}</div> : <div>Not connected can't tell the owner</div>} </h3>
        </footer>
    )
}
