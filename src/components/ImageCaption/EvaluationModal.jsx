import React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

// Define the styles for the modal
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

// Define the styles for the progress bar container
const progressBarContainerStyles = {
  height: '16px',
  width: '100%',
  borderRadius: '8px',
  overflow: 'hidden',
  margin: '10px 0',
  background: 'linear-gradient(45deg, #e0e0e0, #f5f5f5)',
  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
};

// Define the styles for the progress bar itself
const progressBarStyles = {
  height: '100%',
  backgroundColor: 'blue', // Blue color
  transition: 'width 0.4s ease',
  borderRadius: '8px 0 0 8px',
};

const EvaluationModal = ({ score, open, onClose }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="evaluation-modal-title"
      aria-describedby="evaluation-modal-description"
    >
      <Box
        sx={modalStyle}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 1)',
          color: 'black',
          textAlign: 'center',
        }}
      >
        <h1 id="evaluation-modal-title" style={{ fontWeight: 'bolder', fontSize: '32px', color:'black' }}>
          Evaluating...
        </h1>
        <p id="evaluation-modal-description" style={{ fontSize: '20px' }}>
          <div style={progressBarContainerStyles}>
            <div
              style={{
                ...progressBarStyles,
                width: `${Math.min(score, 100)}%`, // Ensure width does not exceed 100%
              }}
            />
          </div>
          <p>Your current score: {score}</p>
        </p>
      </Box>
    </Modal>
  );
};

export default EvaluationModal;
