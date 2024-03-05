import { Box, Button, ClickAwayListener, Divider, Tooltip, Typography } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import { useUserStore } from "../UserStore";
import { logout } from "../functions/Extras";
import React from "react";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useQuery } from "react-query";
import { authAxios } from "../auth/authAxios";
import { HOST, IMAGE_PREFIX } from "../constants/dbConstants";

function Header() {
    const user = useUserStore(state => state.user)
    const setUser = useUserStore(state => state.setUser)
    const navigate = useNavigate()
    const [open, setOpen] = React.useState(false);

    const handleTooltipClose = () => {
        setOpen(false);
    };

    const { data, isLoading } = useQuery('GET_PERSONAL_DATA', () => {
        const axios = authAxios()
        return axios.get(HOST + '/profile/me')
    })

    return <Box sx={{ minHeight: '100vh', width: '90%' }}>
        <Box sx={{ width: '100%', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', }}>
            <Typography sx={{ fontWeight: 600, fontSize: '24px', cursor: 'pointer' }} onClick={() => navigate('/')}>AntiSocial</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '20px' }}>
                <Button onClick={() => {
                    navigate('/app/people')
                }} variant='contained'>Meet New People</Button>
                {/* <Typography sx={{ cursor: 'pointer' }} onClick={() => navigate('/user/' + user)}>{user}</Typography> */}
                <ClickAwayListener onClickAway={handleTooltipClose}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }} >
                        <Tooltip
                            disableFocusListener
                            disableHoverListener

                            disableTouchListener
                            PopperProps={{
                                disablePortal: true,
                            }}
                            onClose={handleTooltipClose}
                            open={open}
                            title={<Box
                                sx={{
                                    width: '160px', height: 'auto', fontSize: '14px',
                                    display: 'flex', flexDirection: 'column', gap: '4px', color: 'black'
                                }}
                                onClick={handleTooltipClose}
                            >
                                <Typography sx={{ cursor: 'pointer' }}>{user}</Typography>
                                <Divider />
                                <Typography sx={{ cursor: 'pointer' }} onClick={() => navigate('/app')}>Explore</Typography>
                                <Divider />
                                <Typography sx={{ cursor: 'pointer' }} onClick={() => navigate('/app/messenger')}>Messenger</Typography>
                                <Divider />
                                <Typography
                                    onClick={() => {
                                        logout(setUser, navigate)
                                    }}
                                    sx={{
                                        display: 'flex', alignItems: 'center', gap: '8px',
                                        justifyContent: 'center', cursor: 'pointer'
                                    }}>
                                    Logout
                                    <LogoutIcon sx={{ cursor: 'pointer', fontSize: '18px' }} />
                                </Typography>
                            </Box>}
                        >
                            {!isLoading && data?.data?.profilePicture?.image
                                ? <img
                                    onClick={() => setOpen(prev => !prev)}
                                    src={IMAGE_PREFIX + data.data.profilePicture.image} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                                : <AccountCircleIcon sx={{ cursor: 'pointer', fontSize: '40px' }} onClick={() => setOpen(prev => !prev)} />}
                        </Tooltip>
                    </Box>
                </ClickAwayListener>

            </Box>
        </Box>
        <Outlet />
    </Box>;
}

export default Header;
