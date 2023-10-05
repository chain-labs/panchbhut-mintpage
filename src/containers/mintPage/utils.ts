import { ethers } from "ethers";
import { MINTS } from "./constants";
import axios from 'axios'


//function definition:
//if merkle root is empty then the mint is not allowlisted
//merkle root can be said empty if it contains all 0s or its empty or its '0x'
export const getIsMintAllowListed = merkleRoot => {
    if (parseInt(merkleRoot) === 0) {
        return false
    } else {
        return true
    }
};

export const hashQueryData = (query) => {
    const { emailid, lastname, firstname, eventname, batchid } = query
    const concatenatedString = `${emailid}-${lastname}-${firstname}-${batchid}-${eventname}`
    console.log({ concatenatedString })
  
    const hash = ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes(concatenatedString),
    )
    return hash
  }

export const getMerkleHashes = async () => {
    const { data } = await axios.get('https://gateway.pinata.cloud/ipfs/QmTQ8nEbEsQGb8uXb7cp5XF1meXhgWgXRDFNoNBYncZVjR')
    console.log(data)
    console.log(Object.values(data))
    return Object.values(data)
  }

//funct definition:
//if allowlisted and discounted both are true then the mint type is mintDiscountAllowListed
//if allowlisted is true and discounted is false then the mint type is mintAllowListed
//if allowlisted is false and discounted is true then the mint type is mintDiscounted
//if allowlisted and discounted both are false then the mint type is mintPublic

export const getMintType = async (allowListed,discounted) => {
    if (allowListed && discounted) {
        return MINTS.DISCOUNTED_ALLOWLISTED;
    } else if (allowListed && !discounted) {
        return MINTS.ALLOWLISTED;
    } else if (discounted && !allowListed) {
        return MINTS.DISCOUNTED;
    } else {
        return MINTS.PUBLIC;
    }
};

export const getProofs = async()=>{}