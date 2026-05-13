import { createContext, useContext, useReducer } from 'react';
import { fakeApplications, fakeDocuments } from '../data/fakeData';

const initialState = {
  shortlist: [],
  submittedApplications: [...fakeApplications],
  documents: [...fakeDocuments],
  notifications: [
    { id: 1, text: "Interview scheduled: PointClickCare — April 8", read: false },
    { id: 2, text: "Application viewed: Ada Support", read: false },
  ],
  searchState: {
    query: "",
    filters: { location: "", roleType: "", workTerm: "", workAuth: "" },
    scrollPosition: 0,
  },
};

function reducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_SHORTLIST': {
      const id = action.payload;
      const exists = state.shortlist.includes(id);
      return {
        ...state,
        shortlist: exists
          ? state.shortlist.filter(i => i !== id)
          : [...state.shortlist, id],
      };
    }
    case 'SUBMIT_APPLICATION':
      return {
        ...state,
        submittedApplications: [...state.submittedApplications, action.payload],
      };
    case 'UPLOAD_DOCUMENT':
      return {
        ...state,
        documents: [...state.documents, action.payload],
      };
    case 'DELETE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.filter(d => d.id !== action.payload),
      };
    case 'UPDATE_SEARCH_STATE':
      return {
        ...state,
        searchState: { ...state.searchState, ...action.payload },
      };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      };
    default:
      return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
