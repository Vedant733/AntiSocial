/* eslint-disable react/prop-types */
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';

function UserNameAndImage({ image, username }) {
    const navigate = useNavigate()
    return <div onClick={() => navigate('/user/' + username)} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
        {
            image
                ? <img src={image} width='50px' height='50px' alt="" style={{ borderRadius: '50%', marginRight: '16px' }} />
                : <AccountCircleIcon style={{ width: '50px', height: '50px', marginRight: '16px' }} />
        }
        <span>{username}</span>
    </div>;
}

export default UserNameAndImage;
