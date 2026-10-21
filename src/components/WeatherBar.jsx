import { translations } from '../translations';

export default function WeatherBar({ language = 'en' }) {
  const t = translations[language] || translations.en;

  return (
    <div className="weather-advisory-bar">
      <div className="weather-icon-pulse">🌤️</div>
      <div className="weather-content">
        <div className="weather-header-row">
          <span className="weather-tag">{language === 'te' ? 'వ్యవసాయ వాతావరణం' : 'Agri Weather Advisory'}</span>
          <strong className="weather-location">{t.weatherLocation}</strong>
        </div>
        <p className="weather-text">{t.weatherCondition}</p>
      </div>
      <div className="weather-badge-status">
        <span className="soil-indicator">● {language === 'te' ? 'నేల సిద్ధం' : 'Soil Ready'}</span>
      </div>
    </div>
  );
}
