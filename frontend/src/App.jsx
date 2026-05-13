import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import AppShell from './components/Layout/AppShell';
import Dashboard from './pages/Dashboard';
import JobSearch from './pages/JobSearch';
import JobDetail from './pages/JobDetail';
import ApplicationForm from './pages/ApplicationForm';
import DocumentLibrary from './pages/DocumentLibrary';
import MyApplications from './pages/MyApplications';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/"             element={<Dashboard />} />
            <Route path="/jobs"         element={<JobSearch />} />
            <Route path="/jobs/:id"     element={<JobDetail />} />
            <Route path="/apply/:id"    element={<ApplicationForm />} />
            <Route path="/documents"    element={<DocumentLibrary />} />
            <Route path="/applications" element={<MyApplications />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
