import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import SessionPersistence from './components/SessionPersistence';
import OfflineAudioCache from './components/OfflineAudioCache';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
// Cada pantalla se carga solo cuando se visita (code splitting).
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
const Home = lazy(() => import('@/pages/Home'));
const Meditate = lazy(() => import('@/pages/Meditate'));
const Recorrido = lazy(() => import('@/pages/Recorrido'));
const Configurar = lazy(() => import('@/pages/Configurar'));
const Mas = lazy(() => import('@/pages/Mas'));
const Diario = lazy(() => import('@/pages/Diario'));
const Ayuda = lazy(() => import('@/pages/Ayuda'));
const AgendaReiki = lazy(() => import('@/pages/AgendaReiki'));
const Historial = lazy(() => import('@/pages/Historial'));
const Ajustes = lazy(() => import('@/pages/Ajustes'));

const PageLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center">
    <div className="w-8 h-8 rounded-full border-4 border-primary/25 border-t-primary animate-spin" />
  </div>
);

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/meditar" element={<Meditate />} />
          <Route path="/recorrido" element={<Recorrido />} />
          <Route path="/configurar" element={<Configurar />} />
          <Route path="/mas" element={<Mas />} />
          <Route path="/diario" element={<Diario />} />
          <Route path="/ayuda" element={<Ayuda />} />
          <Route path="/agenda-reiki" element={<AgendaReiki />} />
          <Route path="/historial" element={<Historial />} />
          <Route path="/ajustes" element={<Ajustes />} />
        </Route>
      </Route>
      <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <SessionPersistence />
          <OfflineAudioCache />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App