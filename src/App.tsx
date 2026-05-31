import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { MainLayout } from './layouts/MainLayout'
import AuthPage from './pages/Auth/AuthPage'
import { AuthLayout } from './layouts/AuthLayout'
import HotelsPage from './pages/HotelsPage/HotelsPage' // Импортируем страницу отелей

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Маршруты с основным лейаутом (ограниченная ширина, хедер и т.д.) */}
        <Route element={<MainLayout />}>
          {/* HotelsPage теперь главная страница */}
          <Route index element={<HotelsPage />} />
          {/* Другие страницы с MainLayout можно добавить здесь */}
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="login" element={<AuthPage initialIsLogin={true} />} />
          <Route path="register" element={<AuthPage initialIsLogin={false} />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
