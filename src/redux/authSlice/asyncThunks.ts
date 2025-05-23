import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AuthenticatedUser } from "../../types/User";

export const authenticateUser = createAsyncThunk(
  'auth/authenticateUser',
  async (userData: {email: string, password: string}) => {
    // Simulação de autenticação com um serviço externo
    const response = await new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: '404',
          name: 'Breno Luiz',
          email: userData.email,
        });
      }, 3000);
    });

    return response as AuthenticatedUser;
  }
)

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async () => {
    // Simulação de autenticação com um serviço externo
    const response = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 3000);
    });

    return response as boolean;
  }
)