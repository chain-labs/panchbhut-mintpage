import { createReducer } from '@reduxjs/toolkit';
import {  TEST_ENV } from 'src/utils/constants';
import {  setNetwork } from './actions';
import { NetworkState } from './types';

const initialState: NetworkState = {
	isOnline: false,
	isValid: false,
	chainId: null,
	name: '',
	unit: '',
	
};

export const networkReducer = createReducer(initialState, (builder) => {
	builder
		.addCase(setNetwork, (state, action) => {
			const { chainId, name } = action.payload;
			const newState = {
				...state,
				chainId,
				name,
				unit: getUnit(chainId),
				isOnline: true,
				isValid: checkValidNetwork(chainId),
			};
			return newState;
		})
		
		
});

const getUnit = (chainId: number): string => {
	switch (chainId) {
		case 1:
		case 4:
		case 5:
			return 'ETH';
	}
};

const checkValidNetwork = (chainId: number): boolean => {
	if (TEST_ENV) {
		switch (chainId) {
			case 5:
				return true;
			default:
				return false;
		}
	} else {
		switch (chainId) {
			case 1:
				return true;
			default:
				return false;
		}
	}
};
