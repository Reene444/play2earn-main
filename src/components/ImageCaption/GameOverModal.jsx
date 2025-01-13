import React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useTheme, useMediaQuery } from '@mui/material';

const GameOverModal = ({ score, onRestart, open }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Modal open={open} onClose={() => {}}>
            <Box
                sx={{
                    backgroundColor: 'rgba(247, 250, 255, 0.8)',
                    color: 'black',
                    textAlign: 'center',
                    width: isMobile ? '80vw' : '600px', // Adjusted for a larger size on both mobile and desktop
                    height: isMobile ? '60vh' : '400px', // Adjusted for a larger size on both mobile and desktop
                    border: '2px solid #000',
                    boxShadow: 24,
                    padding: '20px',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    overflow: 'auto'
                }}
            >
                <h1 style={{ fontWeight: 'bolder', fontSize: isMobile ? '24px' : '36px', color: 'black' }}>
                    Game Over<br /> 😞
                </h1>
                <p style={{ fontSize: isMobile ? '20px' : '30px', color: 'black' }}>
                    Try harder next time.<br />You earned {score} points
                </p>
                <Box sx={{ marginTop: '20px' }}>
                    <ButtonGroup orientation={isMobile ? 'vertical' : 'horizontal'}>
                        <Button
                            sx={{
                                background: 'blue',
                                color: 'white',
                                marginRight: isMobile ? '0' : '20px',
                                marginBottom: isMobile ? '10px' : '0',
                                fontSize: isMobile ? '16px' : '20px',
                                border: 'none',
                                borderRadius: '24px'
                            }}
                            href='/'
                        >
                            Home
                        </Button>
                        <Button
                            sx={{
                                background: 'red',
                                color: 'white',
                                fontSize: isMobile ? '16px' : '20px',
                                border: 'none',
                                borderRadius: '24px'
                            }}
                            onClick={onRestart}
                        >
                            Restart
                        </Button>
                    </ButtonGroup>
                </Box>
            </Box>
        </Modal>
    );
};

export default GameOverModal;
