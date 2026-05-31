import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { isFullUser } from '../types/auth';
import styles from './MainLayout.module.css';

export function MainLayout() {
  const { user, isAuthenticated, logout } = useAuth();

  // Формируем "Фамилия И.О."
  const displayName = user && isFullUser(user)
    ? `${user.last_name} ${user.first_name?.charAt(0)}.`
    : user?.login;

  return (
    <div className={styles.mainLayout}>
      <header className={styles.header}>
        <Link to="/" className={styles.brand}>
          RPPR Hotels
        </Link>
        <nav className={styles.nav}>
          {isAuthenticated ? (
            <>
              <span className={styles.userName}>
                {displayName}
              </span>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  logout();
                }}
                className={styles.navLink}
              >
                Выйти
              </a>
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
