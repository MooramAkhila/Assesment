import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const defaultMethods = [
  {
    id: 1,
    name: 'LinkedIn Post',
    description: 'Share content on LinkedIn company page',
    sequence: 1,
    mandatory: true,
  },
  {
    id: 2,
    name: 'LinkedIn Message',
    description: 'Direct message on LinkedIn',
    sequence: 2,
    mandatory: true,
  },
  {
    id: 3,
    name: 'Email',
    description: 'Email communication',
    sequence: 3,
    mandatory: true,
  },
  {
    id: 4,
    name: 'Phone Call',
    description: 'Direct phone communication',
    sequence: 4,
    mandatory: false,
  },
  {
    id: 5,
    name: 'Other',
    description: 'Other forms of communication',
    sequence: 5,
    mandatory: false,
  },
];

export const fetchMethods = createAsyncThunk(
  'communicationMethods/fetchMethods',
  async () => {
    // Replace with actual API call
    return defaultMethods;
  }
);

export const addMethod = createAsyncThunk(
  'communicationMethods/addMethod',
  async (method) => {
    // Replace with actual API call
    return { ...method, id: Date.now() };
  }
);

export const updateMethod = createAsyncThunk(
  'communicationMethods/updateMethod',
  async (method) => {
    // Replace with actual API call
    return method;
  }
);

export const deleteMethod = createAsyncThunk(
  'communicationMethods/deleteMethod',
  async (id) => {
    // Replace with actual API call
    return id;
  }
);

const communicationMethodSlice = createSlice({
  name: 'communicationMethods',
  initialState: {
    methods: [],
    loading: false,
    error: null,
  },
  reducers: {
    reorderMethods: (state, action) => {
      state.methods = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMethods.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMethods.fulfilled, (state, action) => {
        state.loading = false;
        state.methods = action.payload;
      })
      .addCase(fetchMethods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addMethod.fulfilled, (state, action) => {
        state.methods.push(action.payload);
      })
      .addCase(updateMethod.fulfilled, (state, action) => {
        const index = state.methods.findIndex(
          (method) => method.id === action.payload.id
        );
        if (index !== -1) {
          state.methods[index] = action.payload;
        }
      })
      .addCase(deleteMethod.fulfilled, (state, action) => {
        state.methods = state.methods.filter(
          (method) => method.id !== action.payload
        );
      });
  },
});

export const { reorderMethods } = communicationMethodSlice.actions;
export default communicationMethodSlice.reducer; 