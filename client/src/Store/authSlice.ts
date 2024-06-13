import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserData {
  id: string;
  name: string;
  email: string;
  // add other user properties here
}

interface AuthState {
  auth: boolean;
  userData: UserData | null;
}

const initialState: AuthState = {
  auth: false,
  userData: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserData>) => {
      state.auth = true;
      state.userData = action.payload;
      localStorage.setItem("authStatus", JSON.stringify(state));
    },
    logout: (state) => {
      state.auth = false;
      state.userData = null;
      localStorage.removeItem("authStatus");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
