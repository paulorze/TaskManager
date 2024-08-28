import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  user: null,
  token: null,
  status: 'idle',
  error: null,
};

// Thunk para el registro de usuario
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post('/register', userData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to register';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Thunk para el inicio de sesión de usuario
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (loginData, thunkAPI) => {
    try {
      const response = await axios.post('/login', loginData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('isAuthenticated');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user; //ESTO NO VIENE EN LA RESPUESTA
        state.token = action.payload.token;
        localStorage.setItem('isAuthenticated', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
