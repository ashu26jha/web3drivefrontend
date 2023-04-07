import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"
import abi from "../constants/web3drive.json";
import contractAddresses from '../constants/networkMapping.json';


export default function Footer() {
    const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    console.log(isWeb3Enabled);
    const chainId = parseInt(chainIdHex);
    const web3driveAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const [owner,setOwner] = useState("");

    const { runContractFunction: getOwner } = useWeb3Contract({
        abi: abi,
        contractAddress: web3driveAddress,
        functionName: "getOwner",
        params: {},
        // msgValue:,
    })

    

    useEffect(() => {
        if(isWeb3Enabled){
            async function updateUI() {
                const response = await getOwner();
                setOwner(response);
            }
            updateUI()
        }
    }, [isWeb3Enabled])

    return (
        <footer>
            <h3>{web3driveAddress ? <div>Owner is: {owner}</div> : <div>Not connected can't tell the owner</div>} </h3>
        </footer>
    )
}
