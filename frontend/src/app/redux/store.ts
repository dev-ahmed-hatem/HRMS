import {
  configureStore,
  type Action,
  type ThunkAction,
} from "@reduxjs/toolkit";
import api from "../api/apiSlice";
import authReducer from "@/app/slices/authSlice";
import employeeReducer from "@/app/slices/employeeSlice";

const store = configureStore({
  reducer: {
    // api reducer
    [api.reducerPath]: api.reducer,
    auth: authReducer,
    employee: employeeReducer,
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
