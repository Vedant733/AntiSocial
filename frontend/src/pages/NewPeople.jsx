/* eslint-disable react/prop-types */
import { Box, Button, Typography } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useQuery } from "react-query";
import { authAxios } from "../auth/authAxios";
import { HOST, IMAGE_PREFIX } from "../constants/dbConstants";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

function UserNameAndImageWithFollow({ image, username }) {

    const followPerson = () => {
        const axios = authAxios()
        axios.post(HOST + '/users/follow', { username })
            .then()
            .catch(err => toast.error(err.message))
    }

    return <Box sx={{
        display: 'flex', background: 'white',
        alignItems: 'center', cursor: 'pointer',
        padding: '12px', borderRadius: '4px', justifyContent: 'space-between'
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
        <Button onClick={followPerson} variant="contained">Follow</Button>
    </Box>;
}

function NewPeople() {

    const { data, isLoading } = useQuery('GET_PEOPLE', () => {
        const axios = authAxios()
        return axios.get(HOST + '/users/get/people')
    })
    return <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <ClipLoader
            loading={isLoading}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
        />
        <Box sx={{ width: 'clamp(320px,60%,800px)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {!isLoading && data?.data.map(item => <UserNameAndImageWithFollow key={Math.random()} image={IMAGE_PREFIX + item.image} username={item.data.username} />)}
            {!isLoading && data?.data?.length === 0 && <Typography>This App Needs More Users</Typography>}
        </Box>
    </Box>
}

export default NewPeople;
