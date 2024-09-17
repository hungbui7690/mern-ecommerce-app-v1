import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import {
  HomePage,
  LoginPage,
  SignUpPage,
  NotFoundPage,
  WatchPage,
  SearchPage,
  SearchHistoryPage,
} from './pages/'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './zustand/useAuthStore'

function App() {
  const { user } = useAuthStore()

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route
            path='/login'
            element={!user ? <LoginPage /> : <Navigate to={'/'} />}
          />
          <Route
            path='/signup'
            element={!user ? <SignUpPage /> : <Navigate to={'/'} />}
          />
          <Route
            path='/search'
            element={user ? <SearchPage /> : <Navigate to={'/login'} />}
          />
          <Route
            path='/history'
            element={user ? <SearchHistoryPage /> : <Navigate to={'/login'} />}
          />
          <Route
            path='/watch/:id'
            element={user ? <WatchPage /> : <Navigate to={'/login'} />}
          />

          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        toastOptions={{
          // Define default options
          className: '',
          duration: 2000,
        }}
      />
    </div>
  )
}

export default App
