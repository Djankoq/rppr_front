// Mock-данные для тестирования без бэкенда
const MOCK_HOTELS = [
  {
    id: 1,
    name: 'Grand Hotel Moscow',
    location: 'Москва',
    description: 'Роскошный отель в центре Москвы',
    image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
    rooms: [
      { id: 1, name: 'Стандарт', price_per_night: '5000' },
      { id: 2, name: 'Люкс', price_per_night: '12000' },
    ],
  },
  {
    id: 2,
    name: 'Seaside Resort',
    location: 'Сочи',
    description: 'Отель на берегу Черного моря',
    image_url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400',
    rooms: [
      { id: 3, name: 'Комфорт', price_per_night: '7000' },
      { id: 4, name: 'Делюкс', price_per_night: '15000' },
    ],
  },
  {
    id: 3,
    name: 'Mountain Lodge',
    location: 'Красная Поляна',
    description: 'Уютный отель в горах',
    image_url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400',
    rooms: [
      { id: 5, name: 'Стандарт', price_per_night: '6000' },
    ],
  },
];

export const getHotels = async (params: URLSearchParams) => {
  // Mock-логика
  const page = parseInt(params.get('page') || '1');
  const pageSize = parseInt(params.get('page_size') || '10');
  const location = params.get('location') || '';
  
  let filteredHotels = MOCK_HOTELS;
  
  if (location) {
    filteredHotels = filteredHotels.filter(h => 
      h.location.toLowerCase().includes(location.toLowerCase())
    );
  }
  
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedHotels = filteredHotels.slice(start, end);
  
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    total: filteredHotels.length,
    hotels: paginatedHotels,
  };
};