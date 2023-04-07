import { use, useEffect } from "react"
import { useWeb3Contract,useMoralis,enableWeb3,Moralis } from "react-moralis"
import abi from "../constants/web3drive.json";
import contractAddresses from '../constants/networkMapping.json';


export default function AddFile(){

    const chainId = 31337;
    console.log("LOL")
    enableWeb3();
    // console.log(contractAddresses[chainId]["Web3Drive"][0])
    const {runContractFunction: getOwner} = useWeb3Contract({
        abi: abi,
        contractAddress:contractAddresses[chainId]["Web3Drive"][0],
        functionName:"getOwner",
        params:{},
        // msgValue:,
    })

    useEffect(()=>{
        async function help(){
            const a = await getOwner();
            console.log(a);
        }
        help()
    },[])

    return (
        <div>
            <h1>DD</h1>
        </div>
    )
}
