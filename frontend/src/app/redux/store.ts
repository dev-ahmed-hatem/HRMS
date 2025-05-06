import {
  configureStore,
  type Action,
  type ThunkAction,
} from "@reduxjs/toolkit";
import api from "../api/apiSlice";
import userReducer from "@/app/slices/userSlice";

const store = configureStore({
  reducer: {
    // api reducer
    [api.reducerPath]: api.reducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    // api middleware
    getDefaultMiddleware().concat(api.middleware),
});

export default store;
export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const useDispatch = () => store.dispatch;

export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
