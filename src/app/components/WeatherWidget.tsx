import { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, Wind, Droplets, CloudSnow, CloudDrizzle, MapPin } from 'lucide-react';
import { getSettings } from './Settings';

interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  location: string;
}

// City coordinates database
const cityCoordinates: { [key: string]: { lat: number; lon: number } } = {
  'San Francisco': { lat: 37.7749, lon: -122.4194 },
  'New York': { lat: 40.7128, lon: -74.0060 },
  'London': { lat: 51.5074, lon: -0.1278 },
  'Paris': { lat: 48.8566, lon: 2.3522 },
  'Tokyo': { lat: 35.6762, lon: 139.6503 },
  'Sydney': { lat: -33.8688, lon: 151.2093 },
  'Los Angeles': { lat: 34.0522, lon: -118.2437 },
  'Chicago': { lat: 41.8781, lon: -87.6298 },
  'Miami': { lat: 25.7617, lon: -80.1918 },
  'Seattle': { lat: 47.6062, lon: -122.3321 },
  'Boston': { lat: 42.3601, lon: -71.0589 },
  'Austin': { lat: 30.2672, lon: -97.7431 },
  'Denver': { lat: 39.7392, lon: -104.9903 },
  'Portland': { lat: 45.5152, lon: -122.6784 },
  'Toronto': { lat: 43.6532, lon: -79.3832 },
  'Vancouver': { lat: 49.2827, lon: -123.1207 },
  'Berlin': { lat: 52.5200, lon: 13.4050 },
  'Madrid': { lat: 40.4168, lon: -3.7038 },
  'Rome': { lat: 41.9028, lon: 12.4964 },
  'Amsterdam': { lat: 52.3676, lon: 4.9041 },
  'Dubai': { lat: 25.2048, lon: 55.2708 },
  'Singapore': { lat: 1.3521, lon: 103.8198 },
  'Hong Kong': { lat: 22.3193, lon: 114.1694 },
  'Bangkok': { lat: 13.7563, lon: 100.5018 },
  'Mumbai': { lat: 19.0760, lon: 72.8777 },
};

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError(null);

      const settings = getSettings();
      const location = settings.weatherLocation || 'San Francisco';
      const unit = settings.temperatureUnit || 'F';

      // Get coordinates for the city
      const coords = cityCoordinates[location];
      if (!coords) {
        // Try to use browser geolocation or default to San Francisco
        const defaultCoords = cityCoordinates['San Francisco'];
        await fetchWeatherData(defaultCoords.lat, defaultCoords.lon, location, unit);
        return;
      }

      await fetchWeatherData(coords.lat, coords.lon, location, unit);
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError('Unable to load weather');
      setLoading(false);
    }
  };

  const fetchWeatherData = async (lat: number, lon: number, location: string, unit: 'F' | 'C') => {
    // Open-Meteo API - free, no API key required
    const tempUnit = unit === 'F' ? 'fahrenheit' : 'celsius';
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&temperature_unit=${tempUnit}&wind_speed_unit=mph`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.current) {
      const weatherCode = data.current.weather_code;
      const condition = getWeatherCondition(weatherCode);

      setWeather({
        temp: Math.round(data.current.temperature_2m),
        condition,
        humidity: data.current.relative_humidity_2m,
        windSpeed: Math.round(data.current.wind_speed_10m),
        location,
      });
    }
    setLoading(false);
  };

  const getWeatherCondition = (code: number): string => {
    // WMO Weather interpretation codes
    if (code === 0) return 'Clear';
    if (code <= 3) return 'Partly Cloudy';
    if (code <= 48) return 'Foggy';
    if (code <= 57) return 'Drizzle';
    if (code <= 67) return 'Rain';
    if (code <= 77) return 'Snow';
    if (code <= 82) return 'Rain Showers';
    if (code <= 86) return 'Snow Showers';
    return 'Thunderstorm';
  };

  const getWeatherIcon = () => {
    if (!weather) return <Cloud className="w-10 h-10 text-gray-700" />;
    
    const condition = weather.condition.toLowerCase();
    if (condition.includes('rain') || condition.includes('shower')) {
      return <CloudRain className="w-10 h-10 text-gray-700" />;
    }
    if (condition.includes('clear') || condition.includes('sunny')) {
      return <Sun className="w-10 h-10 text-gray-700" />;
    }
    if (condition.includes('snow')) {
      return <CloudSnow className="w-10 h-10 text-gray-700" />;
    }
    if (condition.includes('drizzle')) {
      return <CloudDrizzle className="w-10 h-10 text-gray-700" />;
    }
    return <Cloud className="w-10 h-10 text-gray-700" />;
  };

  if (loading) {
    return (
      <div className="bg-white/40 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-white/50">
        <div className="flex items-center justify-center">
          <div className="animate-pulse text-sm text-gray-600">Loading weather...</div>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="bg-white/40 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-white/50">
        <div className="flex items-center justify-center">
          <div className="text-sm text-gray-600">{error || 'Weather unavailable'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/40 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-white/50 
                    hover:bg-white/50 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div>
          <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600 mb-1">
            <MapPin className="w-3 h-3" />
            {weather.location}
          </div>
          <div className="text-3xl sm:text-4xl font-light text-gray-800">
            {weather.temp}°{getSettings().temperatureUnit || 'F'}
          </div>
          <div className="text-xs sm:text-sm text-gray-600 mt-1">{weather.condition}</div>
        </div>
        <div className="scale-75 sm:scale-100">{getWeatherIcon()}</div>
      </div>
      <div className="flex gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Droplets className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>{weather.humidity}%</span>
        </div>
        <div className="flex items-center gap-1">
          <Wind className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>{weather.windSpeed} mph</span>
        </div>
      </div>
    </div>
  );
}