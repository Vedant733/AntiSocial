import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { QueryClient, QueryClientProvider } from 'react-query'
import Landing from './pages/Landing';
import { Box, ThemeProvider, createTheme } from '@mui/material';
import Login from './pages/Login';
import Register from './pages/Register';
import Header from './components/Header';
import Home from './pages/Home';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserProfile from './pages/UserProfile';
import NewPeople from './pages/NewPeople';
import Messenger from './pages/Messenger';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: false,
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: false,

    }
  }
});
const theme = createTheme({
  palette: {
    primary: {
      main: '#a26769'
    },
    secondary: {
      main: '#D5B9B2'
    },
  },
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: 'white'
        }
      }
    }
  }
})

function App() {

  return (
    <Box sx={{ width: 'clamp(320px, 100%, 1280px)', display: 'flex', justifyContent: 'center' }}>
      <ToastContainer />
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes>
              <Route index element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/app" element={<Header />}>
                <Route index element={<Home />} />
                <Route path="/app/people" element={<NewPeople />} />
                <Route path="/app/messenger" element={<Messenger />} />
              </Route>
              <Route path="/user/:id" element={<UserProfile />} />
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </ThemeProvider>
    </Box>
  )
}

export default App
