import { createSlice } from "@reduxjs/toolkit";
import { getClientData } from "./asyncThunks";
import type { User } from "../../types/User";


export interface ClientState {
  clients: User[];
  loadingClients: boolean;
}

const initialState: ClientState = {
  clients: [],
  loadingClients: false,
};

export const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(getClientData.pending, (state) => {
        state.loadingClients = true;
      })
      .addCase(getClientData.fulfilled, (state, action) => {
        state.clients = action.payload;
        state.loadingClients = false;
      })
      .addCase(getClientData.rejected, (state) => {
        state.loadingClients = false;
      });
  },
});

export default clientSlice.reducer;

export const selectClients = (state: { client: ClientState }) => state.client.clients;
export const selectLoadingClients = (state: { client: ClientState }) => state.client.loadingClients;