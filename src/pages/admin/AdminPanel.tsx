import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../api/client';
import styles from './AdminPanel.module.css';

interface Hotel {
  id: number;
  name: string;
  location: string;
}

interface Booking {
  id: number;
  hotel_name: string;
  user_login: string;
  status: string;
  check_in_date: string;
  total_price: number;
}

export const AdminPanel = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'hotels' | 'bookings'>('bookings');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hotelsRes, bookingsRes] = await Promise.all([
          apiClient.get('/hotels'),
          apiClient.get('/admin/bookings'),
        ]);
        setHotels(hotelsRes.data);
        setBookings(bookingsRes.data);
      } catch (err) {
        console.error('Ошибка загрузки данных:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className={styles.adminPanel}>
      <h1>Панель администратора</h1>
      
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'bookings' ? styles.active : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          Бронирования
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'hotels' ? styles.active : ''}`}
          onClick={() => setActiveTab('hotels')}
        >
          Отели
        </button>
      </div>

      {activeTab === 'bookings' && (
        <div className={styles.bookingsList}>
          <h2>Все бронирования</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Отель</th>
                <th>Пользователь</th>
                <th>Дата заезда</th>
                <th>Статус</th>
                <th>Стоимость</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking.id}>
                  <td>{booking.id}</td>
                  <td>{booking.hotel_name}</td>
                  <td>{booking.user_login}</td>
                  <td>{new Date(booking.check_in_date).toLocaleDateString('ru-RU')}</td>
                  <td>{booking.status}</td>
                  <td>{booking.total_price} руб.</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'hotels' && (
        <div className={styles.hotelsList}>
          <div className={styles.header}>
            <h2>Управление отелями</h2>
            <Link to="/admin/hotels/new" className={styles.addButton}>
              Добавить отель
            </Link>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Название</th>
                <th>Локация</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {hotels.map(hotel => (
                <tr key={hotel.id}>
                  <td>{hotel.id}</td>
                  <td>{hotel.name}</td>
                  <td>{hotel.location}</td>
                  <td>
                    <Link to={`/admin/hotels/${hotel.id}/edit`} className={styles.editButton}>
                      Редактировать
                    </Link>
                    <Link to={`/admin/hotels/${hotel.id}/rooms`} className={styles.roomsButton}>
                      Комнаты
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};