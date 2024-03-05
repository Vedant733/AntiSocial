/* eslint-disable react/prop-types */
import React from 'react'
import UserNameAndImage from './UserNameAndImage'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite';
import { IMAGE_PREFIX } from '../constants/dbConstants';

export const PostCard = ({ id, image, caption, username, hide, profilePic }) => {
    const [like, setLike] = React.useState(false)

    return <div key={id} style={{ background: 'white', width: '100%', borderRadius: '16px', padding: '12px 24px', margin: '8px', marginBottom: '0' }}>
        {!hide && <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', marginBottom: '12px' }}>
            <UserNameAndImage username={username} image={IMAGE_PREFIX + profilePic} />
        </div>}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}><img src={image} alt="" style={{ width: '100%', aspectRatio: 1.5, borderRadius: '16px' }} /></div>
        <div style={{ marginTop: '12px', marginLeft: '8px', marginBottom: '12px' }}>{caption}</div>
        {!hide && <div style={{ marginTop: '12px' }}>
            {like ?
                <div style={{ display: 'inline-flex' }}>
                    <FavoriteIcon htmlColor='red' style={{ marginRight: '8px' }} onClick={() => setLike(prev => !prev)} />
                </div>
                :
                <FavoriteBorderIcon style={{ marginRight: '8px' }} onClick={() => setLike(prev => !prev)} />

            }
            {/* <AddCommentIcon style={{ marginRight: '8px' }} />
            <ShareIcon /> */}
        </div>}
    </div>
}
