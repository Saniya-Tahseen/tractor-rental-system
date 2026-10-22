import { useState } from 'react';
import WeatherBar from '../components/WeatherBar';
import { translations } from '../translations';

export default function FindTractor({ 
  tractors = [], 
  setActivePage, 
  setSelectedTractor, 
  serviceFilter, 
  setServiceFilter,
  language = 'en',
  selectedLocation,
  weatherData,
  isLoadingWeather,
  onOpenLocationPicker
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recommended');
  const [onlyLocalFleet, setOnlyLocalFleet] = useState(false);

  const t = translations[language] || translations.en;
  const isTe = language === 'te';

  const servicesList = [
    { id: 'All', label: t.allTractors },
    { id: 'Ploughing', label: isTe ? 'దుక్కి దున్నడం' : 'Ploughing' },
    { id: 'Rotavator', label: isTe ? 'రొటవేటర్' : 'Rotavator' },
    { id: 'Cultivator', label: isTe ? 'కల్టివేటర్' : 'Cultivator' },
    { id: 'Trailer Services', label: isTe ? 'ట్రాలీ రవాణా' : 'Trailer Services' },
  ];

  const activeVillage = selectedLocation?.village || 'Hasanparthy';
  const activeDistrict = selectedLocation?.district || 'Hanumakonda';

  // Filter tractors based on search query, selected service, and regional fleet
  const filteredTractors = tractors.filter((tractor) => {
    const matchesSearch = 
      (tractor.model || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tractor.brand || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tractor.location || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tractor.owner || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesService = 
      !serviceFilter || 
      serviceFilter === 'All' || 
      (tractor.equipment && tractor.equipment.toLowerCase().includes(serviceFilter.toLowerCase()));

    const matchesLocal = !onlyLocalFleet ||
      (tractor.location || '').toLowerCase().includes(activeVillage.toLowerCase()) ||
      (tractor.location || '').toLowerCase().includes(activeDistrict.toLowerCase());

    return matchesSearch && matchesService && matchesLocal;
  });

  // Sort tractors
  const sortedTractors = [...filteredTractors].sort((a, b) => {
    if (sortBy === 'price-low') {
      return (a.pricing || 0) - (b.pricing || 0);
    } else if (sortBy === 'price-high') {
      return (b.pricing || 0) - (a.pricing || 0);
    } else if (sortBy === 'rating') {
      return (b.rating || 4.8) - (a.rating || 4.8);
    }
    return 0; // default order
  });

  const handleBookTractor = (tractor) => {
    if (setSelectedTractor) {
      setSelectedTractor(tractor);
    }
    setActivePage('booking-form');
  };

  const handleWhatsApp = (tractor) => {
    const msg = encodeURIComponent(
      isTe 
        ? `నమస్తే ${tractor.owner} గారు, నేను అగ్రిరెంట్ పోర్టల్ ద్వారా మీ ట్రాక్టర్ (${tractor.brand} ${tractor.model}) చూశాను. నా పొలంలో పని కోసం మీ ట్రాక్టర్ కావాలి. దయచేసి వివరాలు చెప్పగలరు.`
        : `Hello ${tractor.owner}, I found your tractor (${tractor.brand} ${tractor.model}) on AgriRent portal. I need tractor work for my farm. Please let me know your availability.`
    );
    window.open(`https://wa.me/91${tractor.mobile.replace(/\D/g, '')}?text=${msg}`, '_blank');
  };

  return (
    <div className="page-anim">
      {/* Agricultural Weather & Soil Advisory Widget */}
      <WeatherBar 
        language={language}
        selectedLocation={selectedLocation}
        weatherData={weatherData}
        isLoadingWeather={isLoadingWeather}
        onOpenLocationPicker={onOpenLocationPicker}
      />

      {/* Locality Fleet Banner */}
      <div className="locality-fleet-banner">
        <div>
          <span>📍 {isTe ? 'ఎంచుకున్న ప్రాంతం:' : 'Active Location:'} </span>
          <strong>
            {isTe ? (selectedLocation?.villageTe || activeVillage) : activeVillage},{' '}
            {isTe ? (selectedLocation?.districtTe || activeDistrict) : activeDistrict}
          </strong>
        </div>
        <div className="locality-fleet-actions">
          <button
            className={`filter-local-toggle-btn ${onlyLocalFleet ? 'active' : ''}`}
            onClick={() => setOnlyLocalFleet(prev => !prev)}
            title={isTe ? 'ఈ గ్రామం/జిల్లాలోని ట్రాక్టర్లను మాత్రమే చూపించు' : 'Filter tractors located in this locality/district only'}
          >
            {onlyLocalFleet 
              ? (isTe ? '✓ స్థానిక ఫ్లీట్ మాత్రమే' : '✓ Local Fleet Only')
              : (isTe ? '🌾 స్థానిక ట్రాక్టర్లు ఫిల్టర్' : '🌾 Filter Local Only')}
          </button>
          <button
            className="filter-local-toggle-btn"
            style={{ background: '#f8fafc', borderColor: '#cbd5e1', color: '#334155' }}
            onClick={onOpenLocationPicker}
          >
            {isTe ? 'ప్రాంతం మార్చండి ▾' : 'Change Locality ▾'}
          </button>
        </div>
      </div>

      <div className="find-tractor-header">
        <div className="search-filter-bar">
          <div className="search-input-box">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder={isTe ? "గ్రామం (ఉదా: హసన్‌పర్తి, గజ్వేల్), బ్రాండ్ లేదా మోడల్ ద్వారా వెతకండి..." : t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Sort Selector */}
          <div className="sort-select-box">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="recommended">⭐ {isTe ? 'సిఫార్సు చేయబడినవి' : 'Recommended'}</option>
              <option value="price-low">📉 {t.sortPriceLowHigh}</option>
              <option value="price-high">📈 {t.sortPriceHighLow}</option>
              <option value="rating">🏆 {t.sortRating}</option>
            </select>
          </div>

          {/* Service Filter Pills */}
          <div className="filter-pills">
            {servicesList.map((service) => (
              <button
                key={service.id}
                className={`filter-pill ${(serviceFilter === service.id || (!serviceFilter && service.id === 'All')) ? 'active' : ''}`}
                onClick={() => setServiceFilter(service.id)}
              >
                {service.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {sortedTractors.length === 0 ? (
        <div className="form-card-wrapper text-center" style={{ padding: '50px 20px' }}>
          <p style={{ fontSize: '48px', marginBottom: '10px' }}>🌾</p>
          <h4>{isTe ? `ఫలితాలు దొరకలేదు: "${searchQuery || serviceFilter || activeVillage}"` : `No tractors matching "${searchQuery || serviceFilter || activeVillage}"`}</h4>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            {isTe ? 'స్థానిక ఫిల్టర్ తీసివేసి లేదా వేరే గ్రామం పేరుతో వెతకండి.' : 'Try disabling "Local Fleet Only" or search by another village name.'}
          </p>
          <div style={{ marginTop: '14px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
            {onlyLocalFleet && (
              <button 
                className="btn btn-secondary" 
                onClick={() => setOnlyLocalFleet(false)}
              >
                🌐 {isTe ? 'అన్ని తెలంగాణ ట్రాక్టర్లను చూపించు' : 'Show All Telangana Fleet'}
              </button>
            )}
            <button 
              className="btn btn-secondary" 
              onClick={() => { setSearchQuery(''); setServiceFilter('All'); setOnlyLocalFleet(false); }}
            >
              🔄 {isTe ? 'ఫిల్టర్లు రీసెట్ చేయండి' : 'Reset Filters'}
            </button>
          </div>
        </div>
      ) : (
        <div className="tractor-grid">
          {sortedTractors.map((tractor) => (
            <div key={tractor.id} className="tractor-card">
              <div className="tractor-image-box">
                <img 
                  src={tractor.photo} 
                  alt={`${tractor.brand} ${tractor.model}`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/tractor1.jpeg';
                  }}
                />
                <span className={`status-badge ${(tractor.availability || 'Available').toLowerCase() === 'available' ? 'status-avail' : 'status-busy'}`}>
                  ● {tractor.availability === 'Available' ? t.available : (tractor.availability || t.busy)}
                </span>
                <span className="price-tag">
                  ₹{tractor.pricing} {t.perHour}
                </span>
              </div>

              <div className="tractor-card-body">
                <div className="tractor-title-row">
                  <h4 className="tractor-brand-model">{tractor.brand} {tractor.model}</h4>
                  <span className="rating-pill">⭐ {tractor.rating || 4.9}</span>
                </div>

                <div className="locality-badge-row">
                  <span className="tractor-location-pill">📍 {tractor.location}</span>
                  <span className="verified-badge">✓ {t.verifiedBadge}</span>
                </div>

                <div className="equipment-tags-container">
                  <small className="equip-label">{t.equippedTools}:</small>
                  <p className="equipment-text">{tractor.equipment}</p>
                </div>

                <div className="owner-profile-strip">
                  <div className="owner-name-group">
                    <span className="owner-avatar">👤</span>
                    <div>
                      <strong>{tractor.owner}</strong>
                      <small className="jobs-count"> ({tractor.jobsDone || 20}+ {isTe ? 'పనులు పూర్తి' : 'jobs done'})</small>
                    </div>
                  </div>
                </div>

                <div className="tractor-card-actions">
                  <button 
                    className="btn btn-primary btn-book"
                    onClick={() => handleBookTractor(tractor)}
                  >
                    📋 {t.bookThisTractor}
                  </button>
                  <a 
                    href={`tel:${tractor.mobile}`} 
                    className="btn btn-call" 
                    title={`Call Owner: ${tractor.mobile}`}
                  >
                    📞 {t.callOwner}
                  </a>
                  <button 
                    className="btn btn-whatsapp" 
                    onClick={() => handleWhatsApp(tractor)}
                    title="Send WhatsApp Inquiry"
                  >
                    💬 {t.whatsappOwner}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
