import { createSelector } from '@reduxjs/toolkit';
import { AppState } from '../store';

export const selectNetwork = (state: AppState) => state.network;

export const networkSelector = createSelector(selectNetwork, (state) => state);


