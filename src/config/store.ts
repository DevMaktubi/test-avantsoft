import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import type { Action, ThunkAction } from "@reduxjs/toolkit";

import authReducer from "../redux/authSlice";
import clientReducer from "../redux/clientSlice";

const persistConfig = {
  key: "avantsoft:redux", // chave para o armazenamento
  storage, // mecanismo de armazenamento (localStorage por padrão)
  whitelist: ["auth"], // apenas o reducer auth será persistido
  // blacklist: ["client"], // alternativa: lista de reducers que NÃO serão persistidos
};

const rootReducer = combineReducers({
  auth: authReducer,
  client: clientReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignora estas ações para evitar erros de serializabilidade
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
// Criando tipo para o store
export type AppStore = typeof store;

// Criando tipo para estado inicial da store
export type RootState = ReturnType<AppStore["getState"]>;

// Criando tipo para o dispatch
export type AppDispatch = AppStore["dispatch"];

/**
 * Criando tipo personalizado para funções thunk no Redux.
 *
 * Este tipo representa uma ação assíncrona (thunk) que pode ser despachada no Redux store.
 * ThunkReturnType: Tipo genérico que define o valor de retorno da thunk (padrão: void)
 * RootState: O tipo do estado global da aplicação
 * unknown: O tipo para argumentos extras (neste caso não está sendo utilizado ativamente)
 * Action: O tipo de ação do Redux que pode ser despachada
 *
 * AppThunk permite criar ações assíncronas tipadas que têm acesso ao estado da aplicação
 * e ao dispatcher do Redux.
 */
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
