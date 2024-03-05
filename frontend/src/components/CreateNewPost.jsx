import { Box, Button, TextField } from "@mui/material";
import ImageIcon from '@mui/icons-material/Image';
import React from "react";
import { authAxios } from "../auth/authAxios";
import { HOST } from "../constants/dbConstants";
import { toast } from "react-toastify";

function CreateNewPost() {

    const inputRef = React.useRef(null)
    const [postPic, setPostPic] = React.useState(null)
    const [postPicFile, setPostPicFile] = React.useState(null)
    const [caption, setCaption] = React.useState('')

    const clearAll = () => {
        setPostPicFile(null)
        setPostPic(null)
        setCaption('')
    }

    const onPost = () => {
        if (!postPic && caption.trim().length === 0) return toast.error('Image and Caption Required.')
        const formData = new FormData()
        formData.append('file', postPicFile)
        formData.append('caption', caption)
        const axios = authAxios()
        axios.post()
        axios.post(HOST + '/post/upload/', formData).then(() => {
            toast.success('Posted.....')
            clearAll()
        }).catch(e => toast.error(e.message))

    }

    return <Box sx={{
        width: '80%', background: 'white',
        fontSize: '20px', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        gap: '12px', borderRadius: '12px',
        flexDirection: postPic ? 'column' : 'row', padding: '24px 24px', margin: '8px'
    }}>
        {
            <>
                <input ref={inputRef} type='file' hidden onChange={(e) => {
                    const selectedFile = e.target.files[0]
                    if (!selectedFile.type.startsWith('image/')) return toast.error('Select An Image')
                    setPostPicFile(selectedFile)
                    setPostPic(URL.createObjectURL(selectedFile))
                }} />
                <Box
                    onClick={() => inputRef.current.click()}
                >
                    {postPic ?
                        <img src={postPic} width='100%' style={{ objectFit: 'contain' }} />
                        :
                        <ImageIcon style={{ fontSize: '30px' }} />}
                </Box>
            </>
        }
        <Box sx={{ display: 'flex', gap: '12px' }}>
            <TextField value={caption} onChange={(e) => setCaption(e.target.value)} size='small' fullWidth />
            <Button
                onClick={onPost}
                variant='contained'>Post</Button>
        </Box>
    </Box>;
}

export default CreateNewPost;
