import { useState } from 'react';
import WeatherBar from '../components/WeatherBar';
import { translations } from '../translations';

export default function FindTractor({ 
  tractors = [], 
  setActivePage, 
  setSelectedTractor, 
  serviceFilter, 
  setServiceFilter,
  language = 'en'
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recommended');

  const t = translations[language] || translations.en;
  const isTe = language === 'te';

  const servicesList = [
    { id: 'All', label: t.allTractors },
    { id: 'Ploughing', label: isTe ? 'దుక్కి దున్నడం' : 'Ploughing' },
    { id: 'Rotavator', label: isTe ? 'రొటవేటర్' : 'Rotavator' },
    { id: 'Cultivator', label: isTe ? 'కల్టివేటర్' : 'Cultivator' },
    { id: 'Trailer Services', label: isTe ? 'ట్రాలీ రవాణా' : 'Trailer Services' },
  ];

  // Filter tractors based on search query and selected service
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

    return matchesSearch && matchesService;
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
      <WeatherBar language={language} />

      <div className="find-tractor-header">
        <div className="search-filter-bar">
          <div className="search-input-box">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder={t.searchPlaceholder}
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
          <h4>{isTe ? `ఫలితాలు దొరకలేదు: "${searchQuery || serviceFilter}"` : `No tractors matching "${searchQuery || serviceFilter}"`}</h4>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            {isTe ? 'దయచేసి వేరే గ్రామం పేరు లేదా వేరే సర్వీస్ ఎంచుకోండి.' : 'Try clearing filters or search by another village name.'}
          </p>
          <button 
            className="btn btn-primary" 
            style={{ marginTop: '16px' }}
            onClick={() => { setSearchQuery(''); setServiceFilter('All'); }}
          >
            {isTe ? 'అన్ని ట్రాక్టర్లు చూపించు' : 'Show All Fleet Units'}
          </button>
        </div>
      ) : (
        <div className="tractor-grid">
          {sortedTractors.map((tractor) => {
            const isAvailable = tractor.availability === 'Available';
            const rating = tractor.rating || 4.8;
            const jobsDone = tractor.jobsDone || (tractor.id * 7 + 12);
            
            return (
              <div key={tractor.id} className="tractor-card">
                <div className="tractor-image-wrap">
                  <img 
                    src={tractor.photo || '/tractor1.jpeg'} 
                    alt={`${tractor.brand} ${tractor.model}`} 
                    className="tractor-card-image"
                    onError={(e) => {
                      e.target.src = '/tractor1.jpeg';
                    }}
                  />
                  <span className="brand-badge">{tractor.brand}</span>
                  <span className="rating-badge">★ {rating} ({jobsDone} {isTe ? 'పనులు' : 'Jobs'})</span>
                  <span className={`availability-tag ${isAvailable ? 'bg-success' : 'bg-warning'}`}>
                    ● {isAvailable ? t.available : (tractor.availability || t.busy)}
                  </span>
                </div>

                <div className="tractor-card-body">
                  <div className="tractor-title-row">
                    <h4>{tractor.model}</h4>
                    <div className="tractor-pricing">
                      ₹{tractor.pricing} <small>{t.perHour}</small>
                    </div>
                  </div>

                  <div className="tractor-location">
                    <span>📍</span>
                    <span>{tractor.location}</span>
                    <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#2e7d32', fontWeight: 700 }}>
                      ✓ {t.verifiedBadge}
                    </span>
                  </div>

                  <div className="tractor-equipment-list">
                    <small>{t.equippedTools}</small>
                    <div className="equipment-tags">
                      {(tractor.equipment || 'Ploughing').split(',').map((eq, i) => (
                        <span key={i} className="equip-tag">
                          {eq.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="owner-info-strip">
                    <div>
                      <span className="owner-name">👤 {tractor.owner}</span>
                      <div className="owner-phone">📞 {tractor.mobile}</div>
                    </div>
                  </div>

                  <div className="tractor-card-actions">
                    <button 
                      className="btn btn-primary w-100" 
                      onClick={() => handleBookTractor(tractor)}
                    >
                      {t.bookThisTractor}
                    </button>
                    <a 
                      href={`tel:${tractor.mobile}`} 
                      className="btn btn-call" 
                      title={t.callOwner}
                    >
                      📞
                    </a>
                    <button 
                      className="btn btn-whatsapp" 
                      onClick={() => handleWhatsApp(tractor)}
                      title={t.whatsappOwner}
                    >
                      💬
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
