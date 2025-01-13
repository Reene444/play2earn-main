import React from 'react';
import PropTypes from 'prop-types';
import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';

const ShareButton = ({ url, title, description }) => {
  const handleShare = (platform) => {
    const shareData = {
      title: title || 'Check out this game!',
      text: description || 'I just played this amazing game!',
      url: url || window.location.href,
    };

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareData.url)}&text=${encodeURIComponent(shareData.text)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareData.url)}&title=${encodeURIComponent(shareData.title)}&summary=${encodeURIComponent(shareData.text)}`, '_blank');
        break;
      default:
        console.error('Unsupported platform');
    }
  };

  // Inline styles
  const containerStyle = {
    display: 'flex',
    gap: '10px', // Adjust space between buttons
    alignItems: 'center', // Vertically center icons if needed
  };

  const iconStyle = {
    cursor: 'pointer',
    fontSize: '24px', // Adjust size of icons
    transition: 'color 0.3s',
  };

  const handleHover = (event) => {
    event.target.style.color = '#007bff'; // Change color on hover
  };

  const handleMouseOut = (event) => {
    event.target.style.color = ''; // Reset color when not hovering
  };

  return (
    <div style={containerStyle}> 
<br/>
<br/>
<br/>
<br/>

      <FaFacebook
        style={iconStyle}
        onClick={() => handleShare('facebook')}
        onMouseOver={handleHover}
        onMouseOut={handleMouseOut}
      />
      <FaTwitter
        style={iconStyle}
        onClick={() => handleShare('twitter')}
        onMouseOver={handleHover}
        onMouseOut={handleMouseOut}
      />
      <FaLinkedin
        style={iconStyle}
        onClick={() => handleShare('linkedin')}
        onMouseOver={handleHover}
        onMouseOut={handleMouseOut}
      />
    </div>
  );
};

ShareButton.propTypes = {
  url: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
};

export default ShareButton;
