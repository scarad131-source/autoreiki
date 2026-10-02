import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { base44 } from '@/api/base44Client';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import NoAccess from '@/components/NoAccess';

const DefaultFallback = () => (
  <div className="fixed inset-0 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
  </div>
);

export default function ProtectedRoute({ fallback = <DefaultFallback />, unauthenticatedElement }) {
  const { user, isAuthenticated, isLoadingAuth, authChecked, authError, checkUserAuth } = useAuth();
  const [accessChecked, setAccessChecked] = useState(false);

  useEffect(() => {
    if (!authChecked && !isLoadingAuth) {
      checkUserAuth();
    }
  }, [authChecked, isLoadingAuth, checkUserAuth]);

  // Re-verifica el acceso contra Hotmart la primera vez que entra un usuario sin
  // acceso (cubre al comprador que aun no tiene el flag sincronizado). Los admins
  // siempre pasan.
  useEffect(() => {
    if (!user) return;
    if (user.role === 'admin' || user.access_active === true) {
      setAccessChecked(true);
      return;
    }
    if (!accessChecked) {
      base44.functions.invoke('syncUserAccess', {})
        .then(() => checkUserAuth())
        .catch(() => {})
        .finally(() => setAccessChecked(true));
    }
  }, [user, accessChecked, checkUserAuth]);

  if (isLoadingAuth || !authChecked) {
    return fallback;
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    }
    return unauthenticatedElement;
  }

  if (!isAuthenticated) {
    return unauthenticatedElement;
  }

  // Control de acceso por compra de Hotmart (los admins siempre tienen acceso)
  if (user && user.role !== 'admin' && !user.access_active) {
    if (!accessChecked) return fallback;
    return <NoAccess />;
  }

  return <Outlet />;
}