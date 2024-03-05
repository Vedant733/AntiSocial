import { Box } from "@mui/material";
import { useQuery } from "react-query";
import { authAxios } from "../auth/authAxios";
import { HOST, IMAGE_PREFIX } from "../constants/dbConstants";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { PostCard } from "../components/PostCard";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ClipLoader from "react-spinners/ClipLoader";

function UserProfile() {
    const params = useParams()
    const navigate = useNavigate()

    const { data: posts, refetch: getPosts } = useQuery('GET_POSTS_BY_' + params.id, () => {
        const axios = authAxios()
        return axios.get(HOST + '/post/' + params.id)
    },
        {
            enabled: false,
            retry: false
        })

    const { isLoading } = useQuery('GET_USER_DATA' + params.id, () => {
        const axios = authAxios()
        return axios.get(HOST + '/users/' + params.id)
    }, {
        onSuccess: () => {
            getPosts()
        },
        onError: () => {
            toast.error(`User Not Found`)
            navigate('/')
        }
    })

    const { data: userProfile } = useQuery('GET_PROFILE' + params.id, () => {
        const axios = authAxios()
        return axios.get(HOST + '/profile/' + params.id)
    })

    return <Box sx={{
        width: 'clamp(320px,60%,800px)', display: 'flex', flexDirection: 'column',
        marginTop: '42px',
        padding: '24px', alignItems: 'center', position: 'relative'
    }}>

        <ArrowBackIcon sx={{ position: 'absolute', top: '20px', left: '20px' }} onClick={() => history.back()} />
        <ClipLoader
            loading={isLoading}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
        />
        {!isLoading && <><  Box sx={{ width: '50%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                {
                    userProfile?.data?.picture
                        ? <img src={IMAGE_PREFIX + userProfile?.data.picture} width='50px' height='50px' alt="" style={{ borderRadius: '50%', marginRight: '16px' }} />
                        : <AccountCircleIcon style={{ width: '80px', marginRight: '16px', aspectRatio: 1 }} />
                }
                <Box sx={{ textAlign: 'left', width: '100%', fontWeight: 600, fontSize: '24px' }}>
                    {userProfile?.data?.data.user.name}
                </Box>
            </Box>
            <Box sx={{ textAlign: 'left', width: '100%' }}>
                {userProfile?.data?.data.bio}
            </Box>
        </Box>
            <Box sx={{ paddingBottom: '12px', width: '60%' }}>

                {posts?.data?.length === 0 && `No posts`}
                {
                    posts?.data?.map((post) => <PostCard
                        hide={true}
                        caption={post.data.caption}
                        username={post.data.user.name}
                        id={post.data.user.name + post.data.filename}
                        key={post.data.user.name + post.data.filename}
                        image={IMAGE_PREFIX + post.image}
                    />)
                }
            </Box></>}
    </Box>;
}

export default UserProfile;
