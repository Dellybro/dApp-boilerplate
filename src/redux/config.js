import { configureStore } from '@reduxjs/toolkit';
import reducers from './reducers';
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';

const persistedReducer = persistReducer(
    {
        key: 'root',
        storage: storage,
    },
    reducers,
);

// export const store = createStore(persistedReducer, {}, enhancer);
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});
export const persistor = persistStore(store);
