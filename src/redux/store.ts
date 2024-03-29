import { configureStore, Action, ThunkAction } from '@reduxjs/toolkit'
import { createWrapper } from 'next-redux-wrapper'
import { userReducer } from './user/reducers'
import { networkReducer } from './network'

const makeStore = () =>
  configureStore({
    reducer: {
      user: userReducer,
      network: networkReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }),
    devTools: true,
  })

export type AppStore = ReturnType<typeof makeStore>


export type AppState = ReturnType<AppStore['getState']>

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>

export const wrapper = createWrapper<AppStore>(makeStore)
