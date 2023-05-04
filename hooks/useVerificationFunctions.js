import {useState, useEffect} from 'react'
import { ethers } from "ethers";
import useContract from './useContract';
import { verificationaddress } from '@/config';
import verificationjson from "../artifacts/contracts/Verification.sol/Verification.json"

const useVerificationFunctions = () => {
  
    const [documents, setDocuments] = useState([])

    const verification = useContract(verificationaddress, verificationjson.abi)
    
    const addFile = async (_uri) => {
        if (_uri) {
            const txn = await verification.addFile(_uri)
            await txn.wait();
            viewDocuments();
        }
    }

    const viewDocuments = async () => {
        const data = await verification.viewDocuments();
        const items = await Promise.all(data.map(async i =>{
            let item ={
                ID: i.ID.toNumber(),
                uri: i.uri,
                sender:i.sender,
                isVerified: i.isVerified.toString()
            }
            return item;
        }))
        setDocuments(items)
        console.log(items)
    }

    const verifyFile = async (_id) =>{
        const txn = await verification.verifyFile(_id);
        await txn.wait();
        viewDocuments();
    }

    return {
        
        documents,
        addFile,
        viewDocuments,
        verifyFile

    }
}

export default useVerificationFunctions
