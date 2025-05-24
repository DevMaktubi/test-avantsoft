import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { authenticateUser, logoutUser } from "./asyncThunks";
import type { AuthenticatedUser } from "../../types/User";
import type { RootState } from "../../config/store";

export interface AuthState {
  isAuthenticated: boolean;
  loadingAuthentication: boolean;
  user: AuthenticatedUser | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  loadingAuthentication: false,
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(authenticateUser.pending, (state) => {
        state.loadingAuthentication = true;
      })
      .addCase(
        authenticateUser.fulfilled,
        (state, action: PayloadAction<AuthenticatedUser>) => {
          state.loadingAuthentication = false;
          state.isAuthenticated = true;
          state.user = action.payload;
        }
      )
      .addCase(authenticateUser.rejected, (state) => {
        state.loadingAuthentication = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loadingAuthentication = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loadingAuthentication = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loadingAuthentication = false;
        state.isAuthenticated = true;
        state.user = null;
      });
  },
});
export default authSlice.reducer;

export const selectorLoadingAuthentication = (state: RootState) => 
  state.auth.loadingAuthentication;

export const selectorAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated; 