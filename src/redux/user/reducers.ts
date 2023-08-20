import { createReducer } from '@reduxjs/toolkit'

import { setUser, removeUser, setContract, setNetwork, setProvider, setSigner } from './actions'
import { ProviderProps, SignerProps } from 'src/ethereum/types';

export type UserState = {
  address: string;
	exists: boolean;
	network: {
		chain: number;
		name: string;
		id: string;
	};
	provider: ProviderProps;
	signer: SignerProps;
}

const initialState: UserState = {
  address: '',
	exists: false,
	network: {
		chain: 0,
		name: '',
		id: '',
	},
	provider: null,
	signer: null,
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
    .addCase(setNetwork, (state, action) => {
			const network = {
				chain: action.payload.chain,
				name: action.payload.name,
				id: action.payload.id,
			};
			const newState = {
				...state,
				network,
			};
			return newState;
		})
		.addCase(setProvider, (state, action) => {
			const provider = action.payload.provider;
			const newState = {
				...state,
				provider,
			};
			return newState;
		})
		.addCase(setSigner, (state, action) => {
			const signer = action.payload.signer;
			const newState = {
				...state,
				signer,
			};
			return newState;
		});
})
