import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import tableReducer from './slices/tableSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['columns', 'rows'],
  blacklist: ['editingRows', 'searchQuery', 'page'],
};

const persistedReducer = persistReducer(persistConfig, tableReducer);

export const store = configureStore({
  reducer: {
    table: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
