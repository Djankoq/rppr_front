import { useEffect, useState } from 'react';
import { apiClient } from '../../api/client';
import styles from './BookingsTable.module.css';

interface Booking {
  id: number;
  user_login: string;
  hotel_name: string;
  date_from: string;
  date_to: string;
  status: string;
  total_price: number;
}

export const BookingsTable = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/admin/bookings')
      .then(res => setBookings(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await apiClient.put(`/admin/bookings/${id}/status`, { status: newStatus });
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    } catch {
      alert('Не удалось изменить статус бронирования');
    }
  };

  if (loading) return <div className={styles.loading}>Загрузка...</div>;

  const total = bookings.length;
  const confirmed = bookings.filter(b => b.status === 'confirmed').length;
  const cancelled = bookings.filter(b => b.status === 'cancelled').length;
  const revenue = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + b.total_price, 0);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Панель управляющего</h1>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Всего бронирований</div>
          <div className={styles.statValue}>{total}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Подтвержденных</div>
          <div className={styles.statValue}>{confirmed}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Отмененных</div>
          <div className={styles.statValue}>{cancelled}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Выручка</div>
          <div className={styles.statValue}>{revenue} руб</div>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <h2 className={styles.sectionTitle}>Список бронирований</h2>
        {bookings.length === 0 ? (
          <p className={styles.empty}>Бронирований пока нет.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Пользователь</th>
                <th>Отель</th>
                <th>Заезд</th>
                <th>Цена</th>
                <th>Статус</th>
                <th>Изменить статус</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id}>
                  <td>#{b.id}</td>
                  <td>{b.user_login}</td>
                  <td>{b.hotel_name}</td>
                  <td>
                    {new Date(b.date_from).toLocaleDateString()} — {new Date(b.date_to).toLocaleDateString()}
                  </td>
                  <td>{b.total_price} руб</td>
                  <td>
                    <span className={`${styles.badge} ${styles[b.status]}`}>
                      {b.status === 'confirmed' ? 'Подтверждено' :
                       b.status === 'cancelled' ? 'Отменено' : 'Ожидает'}
                    </span>
                  </td>
                  <td>
                    <select
                      className={styles.select}
                      value={b.status}
                      onChange={(e) => handleStatusChange(b.id, e.target.value)}
                    >
                      <option value="pending">Ожидает</option>
                      <option value="confirmed">Подтверждено</option>
                      <option value="cancelled">Отменено</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};