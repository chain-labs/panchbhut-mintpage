/* eslint-disable no-console */
import { getChain } from '../utils/constants'
import { ethers, providers } from 'ethers'
import { useEffect, useState } from 'react'
import contracts from '../contracts.json'
import { ProviderProps } from './types'

export const getContractDetails = () => {
  const network = contracts[getChain()]
  const contractDetails =
    network[0].contracts.Controller

  return contractDetails.abi
}

const useCustomContract = (
  contractName: string,
  contractAddress: string,
  provider: ProviderProps,
): any => {
  const [contract, setContract] = useState(null)

  useEffect(() => {
    if (providers.Provider.isProvider(provider) && contractAddress) {
      try {
        const abi = getContractDetails()
        setContract(new ethers.Contract(contractAddress, abi, provider))
      } catch (error) {
        setContract(undefined)
        console.log('Error at useCustomContract', error)
        return error.message
      }
    }
  }, [provider])

  return contract
}

export default useCustomContract
