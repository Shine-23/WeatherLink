const WeatherCard = ({ city, weather }) => {
  if (!weather || !city) return null;

  const cityTitle = city.charAt(0).toUpperCase() + city.slice(1);

  const {
    icon,
    description,
    weather: condition,
    temperature,
    feelsLike,
    feels_like, 
  } = weather;

  return (
    <div className="weather-card glass-card text-center mx-auto my-3">
      <h2 className="mb-2">{cityTitle}</h2>

      {icon && (
        <img
          src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
          alt={description || condition || "Weather icon"}
          className="weather-icon mb-2"
        />
      )}

      {condition && description && (
        <p className="mb-1">
          <strong>{condition}</strong> ({description})
        </p>
      )}

      {typeof temperature === "number" && (
        <p className="mb-1">Temp: {temperature} °C</p>
      )}

      {(typeof feelsLike === "number" || typeof feels_like === "number") && (
        <p className="mb-0">
          Feels like: {feelsLike ?? feels_like} °C
        </p>
      )}
    </div>
  );
};

export default WeatherCard;
