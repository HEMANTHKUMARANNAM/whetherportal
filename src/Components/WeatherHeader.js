import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa'; // Importing a search icon from react-icons
import { useTheme } from '../context/ThemeContext';

import { SharedContext } from '../context/SharedContext'; // Import SharedContext explicitly


const WeatherHeader = () => {
  const [city, setCity] = useState('Nellore'); // Default city set to Nellore
  const [weatherData, setWeatherData] = useState(null);
  const API_KEY = 'fc88c3d4dbff34df7ce72ef2036e4dfb'; // Replace with your API key

  const { setSharedValue } = useContext(SharedContext); // Access setSharedValue from context

  const { theme } = useTheme();





  const formatCityName = (city) => {
    return city
      .replace(/[^a-zA-Z\s]/g, '') // Remove special characters
      .replace(/\s+/g, ' ')         // Replace multiple spaces with a single space
      .trim()                       // Trim leading and trailing spaces
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
      .join(' ');
  };

  const getWeatherData = async (city) => {
    const formattedCity = formatCityName(city);

    const url = `http://api.openweathermap.org/data/2.5/weather?q=${formattedCity}&appid=${API_KEY}&units=metric`;

    try {
      const response = await axios.get(url);
      setWeatherData(response.data);
      console.log(`City: ${formattedCity}`);
      console.log(`Temperature: ${response.data.main.temp}°C`);
      console.log(`Weather: ${response.data.weather[0].description}`);
      console.log(`Wind Speed: ${response.data.wind.speed} m/s`);
      setSharedValue(formattedCity);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setWeatherData(null);
    }
  };

  const handleSearch = () => {
    if (city) {
      getWeatherData(city);
      // Do not clear the input; allow user to see the current city in the search bar
    }
  };

  useEffect(() => {
    getWeatherData(city); // Fetch weather data for default city on component mount
  }, []);

  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
      <h1 className={theme === "light" ? "text-dark" : "text-light"}>weatherio</h1>
      <div className="input-group mb-3 w-50">
        <input
          type="text"
          className="form-control"
          placeholder="Search city"
          aria-label="Search city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '5px 0 0 5px',
            border: '1px solid #007bff', // Blue border
          }}
        />
        <button
          className="btn btn-primary"
          type="button"
          onClick={handleSearch}
          style={{
            borderRadius: '0 5px 5px 0',
          }}
        >
          <FaSearch /> {/* Search icon */}
        </button>
      </div>
      {/* <button className="btn btn-secondary" type="button">
        Current Location
      </button> */}

    </div>
  );
};

export default WeatherHeader;