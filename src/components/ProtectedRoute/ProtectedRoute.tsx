import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // 🔍 ОТЛАДКА — смотри в консоль браузера
  console.log('🔒 ProtectedRoute:', { isAuthenticated, isLoading, path: location.pathname });

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px',
        color: '#6F7A83'
      }}>
        Загрузка...
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('🚫 Редирект на /login — пользователь не авторизован');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('✅ Доступ разрешён');
  return <>{children}</>;
};