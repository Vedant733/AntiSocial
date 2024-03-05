import React from 'react'
import { Box, Button, TextField, Typography, useTheme } from '@mui/material'

import { CREATE_PROFILE, REGISTER, TOKEN } from '../constants/dbConstants'
import axios from 'axios'
import { useNavigate } from 'react-router'
import { CiUser } from "react-icons/ci";
import { authAxios } from '../auth/authAxios'
import { useUserStore } from '../UserStore'
import { toast } from 'react-toastify'

const passwordError = 'Passwords Do Not Match'
const unknownError = 'Unknown Error'

function Register() {

    const navigate = useNavigate()
    const [profilePicFile, setProfilePicFile] = React.useState(null)
    const [profilePic, setProfilePic] = React.useState(null)
    const [username, setUsername] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [cpassword, setCPassword] = React.useState('')
    const [bio, setBio] = React.useState('')
    const [errorText, setErrorText] = React.useState(passwordError)
    const inputRef = React.useRef(null)
    const setUser = useUserStore(state => state.setUser)

    const handleRegister = async (e) => {
        e.preventDefault();
        if (email.trim().length === 0 || password.trim().length === 0 ||
            bio.trim().length === 0 || username.trim().length === 0) return toast.error('Invalid Input')
        if (password === cpassword) {
            try {
                const formData = new FormData()
                formData.append('file', profilePicFile)
                formData.append('bio', bio)
                const res2 = await axios.post(REGISTER, { name: username, email, password })
                localStorage.setItem(TOKEN, res2.data.token)
                const authAx = authAxios()
                const res = await authAx.post(CREATE_PROFILE, formData)
                if (res.status === 200 && res2.status === 200) {
                    localStorage.setItem(TOKEN, res.data.token)
                    setUser(res.data.username)
                    return navigate('/app')
                }
            } catch {
                setErrorText(unknownError)
            }
        }
        else {
            setErrorText(passwordError)
        }
        toast.error(errorText)
    }

    return <Box style={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}>
        <Box>
            <Box sx={{
                width: { xs: '300px', md: '400px' },
                borderRadius: '8px',
                background: '#CEBEBE',
                paddingBottom: '12px'
            }}>
                <Box sx={{
                    margin: '5%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column',
                }}>
                    <Typography sx={{ fontSize: { xs: '30px', md: '42px' }, marginTop: '36px', fontWeight: 600, color: useTheme().palette.primary.main }}>AntiSocial</Typography>
                    {
                        <>
                            <input ref={inputRef} type='file' hidden onChange={(e) => {
                                const selectedFile = e.target.files[0]
                                if (!selectedFile.type.startsWith('image/')) return alert('Select A Image')
                                setProfilePicFile(selectedFile)
                                setProfilePic(URL.createObjectURL(selectedFile))
                            }} />
                            <Box
                                onClick={() => inputRef.current.click()}
                                sx={{ width: { xs: '60px', md: '60px' }, aspectRatio: 1, borderRadius: '50%', border: '1px solid black', display: 'grid', placeItems: 'center' }}>
                                {profilePic ?
                                    <img src={profilePic} width='60px' style={{ aspectRatio: 1, borderRadius: '50%' }} />
                                    :
                                    <CiUser style={{ fontSize: '30px' }} />}
                            </Box>
                        </>
                    }
                    <TextField onChange={(e) => setUsername(e.target.value)} label='Username' sx={{
                        width: '80%', margin: '1.5%'
                    }} />
                    <TextField type='email' onChange={(e) => setEmail(e.target.value)} label='Email' sx={{
                        width: '80%', margin: '1.5%'
                    }} />
                    <TextField onChange={(e) => setBio(e.target.value)} label='Bio' sx={{
                        width: '80%', margin: '1.5%'
                    }} />
                    <TextField type='password' onChange={(e) => setPassword(e.target.value)} label='Password' sx={{
                        width: '80%', margin: '1.5%'
                    }} />
                    <TextField type='password' onChange={(e) => setCPassword(e.target.value)} label='Confirm Password' sx={{
                        width: '80%', margin: '1.5%'
                    }} />
                    <Button onClick={handleRegister} variant='contained' sx={{ width: '80%', margin: '3%', padding: '12px', marginBottom: { xs: '20px', md: '30px' } }} >Register</Button>
                </Box>
            </Box>
        </Box>
    </Box>
}

export default Register