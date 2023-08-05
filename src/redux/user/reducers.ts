import { createReducer } from '@reduxjs/toolkit'

import { setUser, removeUser, setContract } from './actions'

export type UserState = {
  address: string
  exists: boolean
  contract: object
  contractExists: boolean
}

const initialState: UserState = {
  address: '',
  exists: false,
  contract: {},
  contractExists:false
}

export const userReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setUser, (state, action) => {
      state.address = action.payload
      if (action.payload.length >= 1) {
        state.exists = true
      }
    })
    .addCase(removeUser, (state) => {
      state.address = ''
      state.exists = false
    })
    .addCase(setContract, (state,action) => {
      state.contract = action.payload
      state.exists = true
    })
})
