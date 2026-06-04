import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { isFullUser } from '../types/auth';
import styles from './MainLayout.module.css';

export function MainLayout() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Формируем "Фамилия И.О."
  const displayName = user && isFullUser(user)
    ? `${user.last_name} ${user.first_name?.charAt(0)}.`
    : user?.login;

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
    navigate('/');
  };

  return (
    <div className={styles.mainLayout}>
      <header className={styles.header}>
        <Link to="/" className={styles.brand}>
          RPPR Hotels
        </Link>
        <nav className={styles.nav}>
          {/* Ссылка на отели - всегда видна */}
          <Link to="/" className={styles.navLink}>
            Отели
          </Link>
          
          {isAuthenticated ? (
            <>
              {/* Мои бронирования - для всех авторизованных */}
              <Link to="/profile/bookings" className={styles.navLink}>
                Мои бронирования
              </Link>
              
              {/* Панель управляющего - только для менеджеров */}
              {user?.is_manager && (
                <>
                  <Link to="/admin/bookings" className={styles.navLink}>
                    Панель управляющего
                  </Link>
                  <Link to="/admin/add-hotel" className={styles.navLink}>
                    Добавить отель
                  </Link>
                </>
              )}
              
              <span className={styles.userName}>
                {displayName}
              </span>
              <button
                onClick={handleLogout}
                className={styles.navLink}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.navLink}>
                Вход
              </Link>
              <Link to="/register" className={styles.navLink}>
                Регистрация
              </Link>
            </>
          )}
        </nav>
      </header>
      
      <hr className={styles.separator} />

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}