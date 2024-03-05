import { Box } from "@mui/material";
import { useQuery } from "react-query";
import { authAxios } from "../auth/authAxios";
import { HOST, IMAGE_PREFIX } from "../constants/dbConstants";
import { PostCard } from "../components/PostCard";
import CreateNewPost from "../components/CreateNewPost";
import { ClipLoader } from "react-spinners";

function Home() {
    const { data: posts, isLoading } = useQuery('GET_ALL_POSTS', () => {
        const axios = authAxios()
        return axios.get(HOST + '/post/all')
    })

    return <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <Box sx={{ width: 'clamp(320px,60%,800px)', display: 'flex', flexDirection: 'column', alignItems: isLoading ? 'center' : '' }}>
            <CreateNewPost />
            <ClipLoader
                loading={isLoading}
                size={150}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
            {!isLoading && <Box sx={{ paddingBottom: '12px', width: '80%' }}>
                {
                    posts?.data?.map((post) => <PostCard
                        caption={post.caption}
                        username={post.username}
                        profilePic={post.profile.image}
                        id={Math.random()}
                        key={Math.random()}
                        image={IMAGE_PREFIX + post.image}
                    />)
                }
            </Box>}
        </Box>
    </Box>;
}

export default Home;
