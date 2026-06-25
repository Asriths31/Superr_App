
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import LoginPage from './comp/LoginPage'
import CategorySelection from './comp/CategorySelection'
import Dashboard from './comp/Dashboard'
import Movies from './comp/Movies'

// Initialize the TanStack Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Route guard to ensure user registration data exists
function RequireAuth({ children }) {
  const user = localStorage.getItem('superapp_user');
  if (!user) {
    return <Navigate to="/register" replace />;
  }
  return children;
}

// Route guard to ensure user has onboarded with at least 3 categories
function RequireCategories({ children }) {
  const categories = localStorage.getItem('superapp_categories');
  const parsed = categories ? JSON.parse(categories) : [];
  if (parsed.length < 3) {
    return <Navigate to="/categories" replace />;
  }
  return children;
}

// Root redirect handler
function RedirectRoot() {
  const user = localStorage.getItem('superapp_user');
  const categories = localStorage.getItem('superapp_categories');
  const parsed = categories ? JSON.parse(categories) : [];

  if (!user) {
    return <Navigate to="/register" replace />;
  }
  if (parsed.length < 3) {
    return <Navigate to="/categories" replace />;
  }
  return <Navigate to="/dashboard" replace />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<RedirectRoot />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<LoginPage />} />
          <Route 
            path='/categories' 
            element={
              <RequireAuth>
                <CategorySelection />
              </RequireAuth>
            } 
          />
          <Route 
            path='/dashboard' 
            element={
              <RequireAuth>
                <RequireCategories>
                  <Dashboard />
                </RequireCategories>
              </RequireAuth>
            } 
          />
          <Route 
            path='/movies' 
            element={
              <RequireAuth>
                <RequireCategories>
                  <Movies />
                </RequireCategories>
              </RequireAuth>
            } 
          />
          {/* Catch-all redirect to root */}
          <Route path='*' element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}


export default App

