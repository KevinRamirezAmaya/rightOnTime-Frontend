import { BrowserRouter } from 'react-router-dom'

import AppLayout from './components/layout/AppLayout'
import { AppProvider } from './context/AppContext'
import AppRoutes from './routes/AppRoutes'

const App = () => {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppLayout>
          <AppRoutes />
        </AppLayout>
      </AppProvider>
    </BrowserRouter>
  )
}

export default App
