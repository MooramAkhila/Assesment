import { createSlice } from '@reduxjs/toolkit';

const companySlice = createSlice({
  name: 'companies',
  initialState: {
    companies: [],
  },
  reducers: {
    addCompany: (state, action) => {
      state.companies.push(action.payload);
    },
    editCompany: (state, action) => {
      const index = state.companies.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.companies[index] = action.payload;
      }
    },
    deleteCompany: (state, action) => {
      state.companies = state.companies.filter(c => c.id !== action.payload);
    },
    addCommunication: (state, action) => {
      const { companyId, communication } = action.payload;
      const company = state.companies.find(c => c.id === companyId);
      if (company) {
        if (!company.communications) {
          company.communications = [];
        }
        company.communications.unshift(communication);
      }
    },
  },
});

export const { addCompany, editCompany, deleteCompany, addCommunication } = companySlice.actions;
export default companySlice.reducer; 