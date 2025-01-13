import React from 'react';
import '../style/Card.css';
import bitimg from '../img/bitcoin.png'

const Card = () => {
  return (
    <div className="card mr-10 mb-10">
      <div className="image-placeholder">
        <div className="image-placeholder-icon">X</div>
      </div>
      <div className="card-content">
        <div className="card-header">
          <div className="category">Category</div>
          <div className="price">
            <img src={bitimg} alt="Bitcoin Icon" className="bitcoin-image" /> 500
          </div>
        </div>
        <h2 className="title">Title</h2>
        <p className="description">
          Egestas elit dui scelerisque ut eu purus aliquam vitae habitasse.
        </p>
        <button className="participate-button">Participate</button>
      </div>
    </div>
  );
};

export default Card;
