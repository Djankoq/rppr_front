import React from 'react';
import styles from './HotelCard.module.css';

interface Hotel {
  id: number;
  name: string;
  location: string;
  description: string;
  image_url: string;
  rooms: { price_per_night: string }[];
}

interface HotelCardProps {
  hotel: Hotel;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  // Найдем минимальную цену комнаты
  const minPrice = hotel.rooms.reduce((min, room) => {
    const price = parseFloat(room.price_per_night);
    return price < min ? price : min;
  }, Infinity);

  // Используем сервис-заглушку, который более надежен
  const placeholderImageUrl = `https://via.placeholder.com/400x300.png?text=${encodeURIComponent(hotel.name)}`;

  return (
    <div className={styles.card}>
      <img 
        src={hotel.image_url} 
        alt={hotel.name} 
        className={styles.image}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.onerror = null;
          target.src = placeholderImageUrl;
        }}
      />
      <div className={styles.content}>
        <h3 className={styles.title}>{hotel.name}</h3>
        {minPrice !== Infinity && (
          <p className={styles.price}>
            Цена от: {Math.round(minPrice)} руб.
          </p>
        )}
        <p className={styles.description}>
          {hotel.location}
        </p>
      </div>
      <button className={styles.footer}>
        Выбрать
      </button>
    </div>
  );
};

export default HotelCard;
