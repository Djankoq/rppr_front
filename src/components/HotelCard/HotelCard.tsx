import React, { useEffect, useState } from 'react'
import styles from './HotelCard.module.css'
import { apiClient } from '../../api/client'

interface Room {
  id?: number
  name?: string
  price_per_night: string
}

interface Hotel {
  id: number
  name: string
  location: string
  description: string
  image_url: string
  rooms?: Room[]
}

interface HotelCardProps {
  hotel: Hotel
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  const [rooms, setRooms] = useState<Room[]>([])
  const [recommendation, setRecommendation] = useState<string | null>(null)

  // ✅ Загружаем комнаты отеля
  useEffect(() => {
    let isMounted = true

    const fetchRooms = async () => {
      try {
        const response = await apiClient.get(`/hotels/${hotel.id}/rooms`)
        if (isMounted) {
          setRooms(response.data || [])
        }
      } catch (err) {
        console.error('Ошибка загрузки комнат:', err)
      }
    }

    fetchRooms()

    return () => {
      isMounted = false
    }
  }, [hotel.id])

  // ✅ Загружаем рекомендацию ИИ
  useEffect(() => {
    let isMounted = true

    const fetchRecommendation = async () => {
      try {
        const response = await apiClient.get(`/ai/recommendations`, {
          params: { hotel_id: hotel.id }
        })
        const data = response.data
        if (isMounted) {
          setRecommendation(
            data?.text ||
            data?.recommendation ||
            (typeof data === 'string' ? data : null)
          )
        }
      } catch {
        // Игнорируем ошибки
      }
    }

    fetchRecommendation()

    return () => {
      isMounted = false
    }
  }, [hotel.id])

  // ✅ Используем загруженные комнаты или те, что пришли из API
  const allRooms = rooms.length > 0 ? rooms : (hotel.rooms || [])

  const minPrice = allRooms.length > 0
    ? Math.min(...allRooms.map(room => parseFloat(room.price_per_night)))
    : Infinity

  const firstRoomName = allRooms[0]?.name || ''

  const placeholderImageUrl = `https://via.placeholder.com/400x300.png?text=${encodeURIComponent(hotel.name)}`

  return (
    <div className={styles.card}>
      <img
        src={hotel.image_url}
        alt={hotel.name}
        className={styles.image}
        onError={(e) => {
          const target = e.target as HTMLImageElement
          target.onerror = null
          target.src = placeholderImageUrl
        }}
      />
      <div className={styles.content}>
        <h3 className={styles.title}>{hotel.name}</h3>

        {firstRoomName && (
          <p className={styles.room}>
            <strong>Комната:</strong> {firstRoomName}
          </p>
        )}

        {minPrice !== Infinity && (
          <p className={styles.price}>
            Цена от: {Math.round(minPrice)} руб.
          </p>
        )}

        <p className={styles.description}>{hotel.location}</p>

        {recommendation && (
          <div className={styles.recommendation}>
            <strong>💡 Рекомендация:</strong>
            <p>{recommendation}</p>
          </div>
        )}

        <button className={styles.footer}>
          Выбрать
        </button>
      </div>
    </div>
  )
}

export default HotelCard