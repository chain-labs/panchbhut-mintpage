import { createAction } from '@reduxjs/toolkit'
import { ethers } from 'ethers'
import { ProviderProps, SignerProps } from 'src/ethereum/types'

export const setUser = createAction<string>('user/SET_USER')

export const setContract = createAction<ethers.Contract>('user/SET_CONTRACT')

export const removeUser = createAction('user/REMOVE_USER')


export const setNetwork = createAction<{ chain: number; name: string; id: string }>('user/SET_NETWORK');

export const setProvider = createAction<{ provider: ProviderProps }>('user/SET_PROVIDER');

export const setSigner = createAction<{ signer: SignerProps }>('user/SET_SIGNER');

