import { createSelector } from '@reduxjs/toolkit'
import { AppState } from '../store'

export const selectUser = (state: AppState) => state.user

export const userSelector = createSelector(selectUser, (state) => state)

export const selectNetwork = (state: AppState) => state.user.network;

export const networkSelector = createSelector(selectNetwork, (state) => state);