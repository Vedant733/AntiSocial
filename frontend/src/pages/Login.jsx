/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { Box, Button, Link, TextField, Typography, useTheme } from '@mui/material'
import { AUTHENTICATE, TOKEN } from '../constants/dbConstants.js'
import { useNavigate } from 'react-router'
import { authAxios } from '../auth/authAxios.js'
import { useUserStore } from '../UserStore.js';
import { toast } from 'react-toastify';


function Login() {

  const navigate = useNavigate()

  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const setUser = useUserStore(state => state.setUser)
  // React.useEffect(() => {
  //   if (localStorage.getItem(TOKEN)) {
  //     return navigate("/app")
  //   }
  // }, [])


  const handleLogin = async () => {
    if (username?.trim().length !== 0 && password?.trim().length !== 0) {
      const axios = authAxios()
      const res = await axios.post(AUTHENTICATE, { email: username, password })
      if (res.status === 200) {
        localStorage.setItem(TOKEN, res.data.token)
        setUser(res.data.username)
        return navigate('/app')
      }
    }
    toast.error('Invalid Username or Password')
  }

  return <Box style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
    <Box>
      <Box sx={{
        width: { xs: '300px', md: '400px' },
        height: 'auto',
        borderRadius: '8px',
        background: '#CEBEBE'
      }}>
        <Box style={{
          margin: '5%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column',
        }}>
          <Typography sx={{ fontSize: { xs: '30px', md: '42px' }, margin: { xs: '30px 0px', md: '42px 0px' }, fontWeight: 600, color: useTheme().palette.primary.main }}>AntiSocial</Typography>
          <TextField
            onChange={(e) => setUsername(e.target.value)} label='Email'
            sx={{
              width: '80%', margin: '1.5%'
            }} />
          <TextField type='password' onChange={(e) => setPassword(e.target.value)} label='Password'
            sx={{
              width: '80%', margin: '1.5%'
            }} />
          <Button onClick={handleLogin} variant='contained' sx={{ width: '80%', margin: '3%', padding: '12px' }} >Log In</Button>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px', marginBottom: { xs: '30px', md: '42px' } }}>
            Don{"'"}t Have An Account,
            <Link underline='hover' sx={{ cursor: 'pointer' }} onClick={() => navigate('/register')}>
              &nbsp;Sign up
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  </Box>
}

export default Login