import React from "react";

const WeatherCard = ({weather}) => {
    
    if(!weather) return null;

    return(
        <div className="weather-card glass-card text-center mx-auto my-3">
            <h2 className="mb-2">{weather.city}</h2>
            <img
                src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                alt={weather.description}
                className="weather-icon mb-2"
            />
            <p className="mb-1"><strong>{weather.weather}</strong> ({weather.description})</p>
            <p className="mb-1">Temp: {weather.temperature} °C</p>
            <p className="mb-0">Feels like: {weather.feels_like} °C</p>
        </div>
    );
}

export default WeatherCard;