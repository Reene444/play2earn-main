import React, { useState } from 'react';
import './css/DropdownSearch.css'; 

const SearchableDropdown = ({ onGamesSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredGames, setFilteredGames] = useState([]);
  const [selectedGames, setSelectedGames] = useState([]);

  // List of games
  const games = [
    "Audio Transcription",
    "Survey",
    "Wizard",
    "Wordify",
    "Image Caption",
    "Search & Win",
    "Text Tagging",
    "Follow Task",
    "Image Captcha Task",
    "Translation Challenge"
  ];

  // Handle search input change
  const handleChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    // Filter games based on the search term
    setFilteredGames(
      games.filter((game) =>
        game.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  // Handle game selection for multiple games
  const handleGameSelect = (game) => {
    if (!selectedGames.includes(game)) {
      const updatedGames = [...selectedGames, game];
      setSelectedGames(updatedGames);
      onGamesSelect(updatedGames); // Send selected games to parent component
    }
    setSearchTerm(''); // Clear the search bar
    setFilteredGames([]); // Clear filtered games
  };

  // Remove a game from the selected list
  const handleRemoveGame = (game) => {
    const updatedGames = selectedGames.filter((selectedGame) => selectedGame !== game);
    setSelectedGames(updatedGames);
    onGamesSelect(updatedGames); // Send updated games to parent component
  };

  // Clear search term and filtered games
  const handleClear = () => {
    setSearchTerm('');
    setFilteredGames([]);
  };

  return (
    <div className="dropdown-container">
      {selectedGames.length > 0 && (
        <div className="selected-games">
          {selectedGames.map((game, index) => (
            <div key={index} className="selected-game">
              {game}
              <button className="remove-game" onClick={() => handleRemoveGame(game)}>
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="search-bar-container">
        <i className="fas fa-search search-icon" />
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder="Search for games..."
        />
      </div>
      {filteredGames.length > 0 && (
        <ul className="dropdown-list">
          {filteredGames.map((game, index) => (
            <li
              key={index}
              className="dropdown-item"
              onClick={() => handleGameSelect(game)}
            >
              {game}
            </li>
          ))}
        </ul>
      )}
      {searchTerm && (
        <button onClick={handleClear} className="clear-button">
          Clear
        </button>
      )}
    </div>
  );
};

export default SearchableDropdown;
