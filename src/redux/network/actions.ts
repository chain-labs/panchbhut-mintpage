import { createAction } from '@reduxjs/toolkit';

export const setNetwork = createAction<{ chainId: number; name: string }>('network/SET_NETWORK');



export const disconnect = createAction('network/DISCONNECT');
