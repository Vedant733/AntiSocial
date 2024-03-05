/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Box, InputAdornment, TextField, useTheme } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useQuery } from "react-query";
import { authAxios } from "../auth/authAxios";
import { HOST, IMAGE_PREFIX } from "../constants/dbConstants";
import React from "react";
import SendIcon from '@mui/icons-material/Send';
import { ClipLoader } from "react-spinners";
import TimeAgo from 'react-timeago'
import { toast } from "react-toastify";
import { io } from 'socket.io-client'
import { useUserStore } from "../UserStore";

function UserNameAndImage({ image, username, onClick }) {
    return <Box
        onClick={onClick}
        sx={{
            display: 'flex', background: 'white',
            alignItems: 'center', cursor: 'pointer',
            padding: '12px', justifyContent: 'space-between',
            borderRadius: '4px'
        }}>
        <Box sx={{
            display: 'flex',
            alignItems: 'center'
        }}>{
                image
                    ? <img src={image} width='50px' height='50px' alt="" style={{ borderRadius: '50%', marginRight: '16px' }} />
                    : <AccountCircleIcon style={{ width: '50px', height: '50px', marginRight: '16px' }} />
            }
            <span>{username}</span>
        </Box>
    </Box>;
}

function Message({ text, time, isSender }) {
    const theme = useTheme()

    return <Box sx={{
        width: 'fit-content', alignSelf: isSender ? 'flex-start' : 'flex-end',
        background: isSender ? theme.palette.primary.main : '#0000000d',
        padding: '8px 12px', borderRadius: '4px', wordBreak: 'break-all', textAlign: isSender ? 'left' : 'right'
    }}>
        <Box sx={{ fontSize: '20px' }}>{text}</Box>
        <TimeAgo style={{ fontSize: '10px' }} date={time} live={false} />
    </Box>
}

function Messenger() {
    const theme = useTheme()
    const { data: chatUsers, isLoading: isChatLoading } = useQuery('GET_CHAT_USERS', () => {
        const axios = authAxios()
        return axios.get(HOST + '/users/get/following')
    })

    const [selectedUser, setSelectedUser] = React.useState(null)

    const [typedMessage, setTypedMessage] = React.useState('')
    const user = useUserStore(state => state.user)
    const [chatWithFriend, setChatWithFriend] = React.useState(null)
    const socket = React.useRef()

    const { isLoading: isChatWithFriendLoading, refetch: refetchChatWithFriend } = useQuery(['GET_CHAT_WITH', selectedUser?.id], () => {
        const axios = authAxios()
        return axios.post(HOST + '/message/full', { friendId: selectedUser.id })
    }, {
        enabled: !!selectedUser,
        onSuccess: (res) => {
            setChatWithFriend(res.data)
        },
        keepPreviousData: true
    })

    const handleSendMessage = () => {
        const axios = authAxios()
        axios.post(HOST + '/message/', {
            conversationId: chatWithFriend.conversationId,
            text: typedMessage
        }).then(() => refetchChatWithFriend()).catch(err => toast.error(err.message));
        socket.current.emit('messageSent', selectedUser.username)
        setTypedMessage('')
    }

    React.useEffect(() => {
        socket.current = io('ws://localhost:8080');
    }, [])

    React.useEffect(() => {
        socket.current.emit('addUser', user)
    }, [socket])

    React.useEffect(() => {
        socket.current.on('refreshTheChat', () => {
            refetchChatWithFriend()
        })
    }, [])


    return <Box sx={{
        width: '100%', minHeight: '600px',
        display: 'flex', flexDirection: 'row', borderRadius: '4px',
        overflow: 'hidden'
    }}>
        <Box sx={{
            flex: 1, display: 'flex', height: '100',
            width: '100%', flexDirection: 'column',
            overflowY: 'auto', gap: '4px', background: '#00000012',
            border: '1px solid ' + useTheme().palette.secondary.main,
            padding: '4px'
        }}>
            {!isChatLoading && chatUsers.data.map(chatUser =>
                <UserNameAndImage
                    key={Math.random()}
                    image={IMAGE_PREFIX + chatUser.image}
                    username={chatUser.data.username}
                    onClick={() => {
                        setChatWithFriend(null)
                        setTypedMessage('')
                        setSelectedUser({ id: chatUser.data.id, image: chatUser.image, username: chatUser.data.username })
                    }} />
            )
            }

        </Box>
        <Box sx={{
            flex: 3, display: 'flex', height: '600px',
            background: '#ffffffa1', width: '100%', flexDirection: 'column',
            justifyContent: 'flex-end', border: '1px solid ' + useTheme().palette.secondary.main,
            padding: '4px'
        }}>
            {selectedUser && <><Box sx={{ width: '100', height: 'auto', background: 'white', borderRadius: '4px', color: 'black' }}>
                {selectedUser && <UserNameAndImage image={IMAGE_PREFIX + selectedUser.image} username={selectedUser.username} />}
            </Box>
                <Box sx={{
                    width: '100', height: '80%', display: 'flex', flexDirection: 'column-reverse', gap: '8px',
                    marginTop: '8px', overflowY: 'auto', paddingBottom: '8px', scrollBehavior: 'smooth'
                }}>

                    <ClipLoader
                        loading={isChatWithFriendLoading}
                        size={50}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />

                    {selectedUser && chatWithFriend?.chat.map((item) => <Message
                        key={item._id}
                        text={item.text}
                        isSender={selectedUser.id === item.sender}
                        time={item.createdAt} />)}
                </Box>
                <TextField
                    value={typedMessage}
                    onChange={(e) => setTypedMessage(e.target.value)}
                    fullWidth
                    placeholder='Message'
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="start">
                                <SendIcon sx={{ cursor: 'pointer', fill: theme.palette.primary.main }} onClick={handleSendMessage} />
                            </InputAdornment>
                        )
                    }}
                    sx={{ border: '1px solid ' + theme.palette.primary.main }} />
            </>
            }
        </Box>
    </Box>;
}

export default Messenger;
