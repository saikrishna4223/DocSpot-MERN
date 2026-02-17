// client/src/App.js
// This file contains the main App component and handles routing.
import { useState, useEffect, useContext } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from './styles/theme'; // Import the theme
import { AuthContext, AuthProvider } from './context/AuthContext'; // Import AuthContext and AuthProvider
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import UserDashboard from './pages/UserDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import HomePage from './pages/HomePage';

// Main App Component
const App = () => {
  const [hash, setHash] = useState(window.location.hash);
  // AuthContext is consumed directly within this App component for routing logic
  const { isAuthenticated, isAdmin, isDoctor, isCustomer } = useContext(AuthContext);

  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderContent = () => {
    switch (hash) {
      case '#login':
        return <LoginPage />;
      case '#register':
        return <RegisterPage />;
      case '#user-dashboard':
        // Ensure user is authenticated AND has the customer role
        return isAuthenticated && isCustomer ? <UserDashboard /> : <LoginPage />;
      case '#doctor-dashboard':
        // Ensure user is authenticated AND has the doctor role
        return isAuthenticated && isDoctor ? <DoctorDashboard /> : <LoginPage />;
      case '#admin-dashboard':
        // Ensure user is authenticated AND has the admin role
        return isAuthenticated && isAdmin ? <AdminDashboard /> : <LoginPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
        <Header /> {/* Header also consumes AuthContext */}
        <main className="flex-grow p-4">
          {renderContent()}
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

// This is the top-level component that will be rendered by index.js
// It now wraps the main App logic with AuthProvider
export default function DocSpotApp() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}