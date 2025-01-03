import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addCommunication } from './companySlice';

export const fetchDashboardData = createAsyncThunk(
  'user/fetchDashboardData',
  async (_, { getState }) => {
    const companies = getState().companies.companies;
    return companies.map(company => ({
      ...company,
      communications: company.communications || [],
      communicationPeriodicity: 14,
      nextCommunication: calculateNextCommunication({
        communications: company.communications || [],
        communicationPeriodicity: 14
      })
    }));
  }
);

export const logCommunication = createAsyncThunk(
  'user/logCommunication',
  async (communicationData, { dispatch }) => {
    const { companyId, communication } = communicationData;
    
    // Add communication to company slice
    dispatch(addCommunication(communicationData));

    // Get current date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get communication date
    const commDate = new Date(communication.date);
    commDate.setHours(0, 0, 0, 0);

    // Calculate next communication date
    const nextCommDate = new Date();
    
    // If communication date is in the past or today, set next communication to 14 days from today
    if (commDate <= today) {
      nextCommDate.setDate(today.getDate() + 14);
    } else {
      // If communication date is in the future, set next communication to 14 days from that date
      nextCommDate.setDate(commDate.getDate() + 14);
    }

    return {
      ...communicationData,
      nextCommunication: nextCommDate.toISOString().split('T')[0]
    };
  }
);

const calculateNotifications = (companies) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const overdue = [];
  const dueToday = [];

  companies.forEach(company => {
    // First check for today's logged communications
    if (company.communications && company.communications.length > 0) {
      company.communications.forEach(comm => {
        const commDate = new Date(comm.date);
        commDate.setHours(0, 0, 0, 0);
        
        // If communication is logged for today
        if (commDate.getTime() === today.getTime()) {
          dueToday.push({
            id: `${company.id}-${comm.id}`,
            companyName: company.name,
            communicationType: comm.type,
            date: comm.date,
            notes: comm.notes || '',
            isLogged: true
          });
        }
      });
    }

    // Then check next communication date
    const nextComm = new Date(company.nextCommunication);
    nextComm.setHours(0, 0, 0, 0);

    // Get the latest communication date
    const latestComm = company.communications[0];
    const latestCommDate = latestComm ? new Date(latestComm.date) : null;
    latestCommDate?.setHours(0, 0, 0, 0);

    // If next communication is today and no communication has been logged today
    if (nextComm.getTime() === today.getTime() && 
        !dueToday.some(comm => comm.id.startsWith(company.id))) {
      dueToday.push({
        id: `${company.id}-next`,
        companyName: company.name,
        communicationType: 'Scheduled',
        date: nextComm.toISOString(),
        notes: 'Communication due today',
        isScheduled: true
      });
    }
    
    // Check for overdue communications
    if (nextComm < today) {
      overdue.push({
        id: company.id,
        companyName: company.name,
        lastCommunication: latestComm ? formatDate(latestComm.date) : 'No communications',
        dueDate: formatDate(nextComm),
        communicationType: latestComm?.type || 'None',
        daysPastDue: Math.floor((today - nextComm) / (1000 * 60 * 60 * 24)),
        lastCommDate: latestComm ? formatDate(latestComm.date) : null
      });
    }
  });

  // Sort overdue by days past due (most overdue first)
  overdue.sort((a, b) => b.daysPastDue - a.daysPastDue);

  return { overdue, today: dueToday };
};

const calculateCalendarEvents = (companies) => {
  const events = [];
  companies.forEach(company => {
    // Add past communications
    company.communications.forEach(comm => {
      events.push({
        id: `${company.id}-${comm.id}`,
        companyName: company.name,
        type: comm.type,
        date: comm.date,
        notes: comm.notes,
        isPast: true
      });
    });

    // Add next scheduled communication
    events.push({
      id: `${company.id}-next`,
      companyName: company.name,
      type: company.communications[0]?.type || 'Scheduled',
      date: company.nextCommunication,
      notes: 'Scheduled communication',
      isPast: false
    });
  });

  return events;
};

// Helper function for date formatting
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const userSlice = createSlice({
  name: 'user',
  initialState: {
    dashboardData: [],
    notifications: {
      overdue: [],
      today: [],
    },
    calendarEvents: [],
    highlightSettings: {},
    loading: false,
    error: null,
  },
  reducers: {
    setHighlightSettings: (state, action) => {
      state.highlightSettings[action.payload.companyId] = action.payload.settings;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardData = action.payload;
        state.notifications = calculateNotifications(action.payload);
        state.calendarEvents = calculateCalendarEvents(action.payload);
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(logCommunication.fulfilled, (state, action) => {
        const { companyId, communication, nextCommunication } = action.payload;
        const company = state.dashboardData.find(c => c.id === companyId);
        if (company) {
          if (!company.communications) {
            company.communications = [];
          }
          company.communications.unshift(communication);
          company.nextCommunication = nextCommunication;
          
          // Recalculate both notifications and calendar events
          state.notifications = calculateNotifications(state.dashboardData);
          state.calendarEvents = calculateCalendarEvents(state.dashboardData);
        }
      });
  },
});

const calculateNextCommunication = (company) => {
  if (!company.communications || company.communications.length === 0) {
    const date = new Date();
    date.setDate(date.getDate() + 14); // Always 14 days for new companies
    return date.toISOString().split('T')[0];
  }
  
  const lastComm = company.communications[0];
  const date = new Date(lastComm.date);
  date.setDate(date.getDate() + 14); // Always 14 days
  return date.toISOString().split('T')[0];
};

export const { setHighlightSettings } = userSlice.actions;
export default userSlice.reducer; 