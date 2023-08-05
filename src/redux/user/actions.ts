import { createAction } from '@reduxjs/toolkit'
import { ethers } from 'ethers'

export const setUser = createAction<string>('user/SET_USER')

export const setContract = createAction<ethers.Contract>('user/SET_CONTRACT')

export const removeUser = createAction('user/REMOVE_USER')
