import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Landing() {

    const navigate = useNavigate()

    return <Box sx={{
        height: '100vh', fontWeight: 800,
        fontSize: 'clamp(1.2rem, -0.875rem + 8.333vw, 3.5rem)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: '1rem', justifyContent: 'center'
    }}>
        A Social Media Application
        <Button variant="contained"
            sx={{
                width: 'fit-content',
                fontSize: 'clamp(.6rem, -0.875rem + 2.333vw, 2.5rem)', fontWeight: 800
            }}
            onClick={() => navigate('/login')}
        >Get Started</Button>
    </Box>;
}

export default Landing;
