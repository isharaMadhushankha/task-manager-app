import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { Toaster } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const MainContent = () => {
  const { isAuthenticated, loading } = useAuth();
  const { theme } = useTheme();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-[var(--text-muted)] bg-[var(--bg-canvas)]">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--accent-primary)] mb-3" />
        <p className="text-sm font-medium">Loading Task Manager...</p>
      </div>
    );
  }

  return isAuthenticated ? <Dashboard /> : <Login />;
};

const ToasterWithTheme = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: isDark ? '#272729' : '#ffffff',
          color: isDark ? '#f5f5f7' : '#1d1d1f',
          border: `1px solid ${isDark ? '#3a3a3c' : '#e0e0e0'}`,
          fontSize: '14px',
          borderRadius: '12px',
          boxShadow: isDark ? '0 10px 25px rgba(0,0,0,0.5)' : '0 10px 25px rgba(0,0,0,0.08)',
        },
      }}
    />
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToasterWithTheme />
        <MainContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
