import { useState } from 'react';
import { translations } from '../translations';

export default function OwnerRegistration({ setTractors, setActivePage, language = 'en' }) {
  const t = translations[language] || translations.en;
  const isTe = language === 'te';

  const [formData, setFormData] = useState({
    owner: '',
    mobile: '',
    location: '',
    brand: 'Mahindra',
    model: '',
    equipmentList: ['Ploughing', 'Rotavator'],
    customEquipment: '',
    pricing: 1200,
    availability: 'Available',
    photo: '/tractor1.jpeg'
  });

  const photoPresets = [
    { label: 'Mahindra Red 1', src: '/tractor1.jpeg' },
    { label: 'Mahindra Red 2', src: '/tractor2.jpeg' },
    { label: 'John Deere Green', src: '/tractor3.jpeg' },
    { label: 'Swaraj Blue', src: '/tractor4.jpeg' },
    { label: 'Massey Ferguson Red', src: '/tractor5.jpeg' },
    { label: 'Sonalika Blue', src: '/tractor6.jpeg' },
    { label: 'Kubota Orange 4WD', src: '/tractor7.jpeg' },
  ];

  const standardEquipments = [
    { id: 'Ploughing', label: isTe ? 'దుక్కి దున్నడం (Ploughing)' : 'Ploughing' },
    { id: 'Rotavator', label: isTe ? 'రొటవేటర్ (Rotavator)' : 'Rotavator' },
    { id: 'Cultivator', label: isTe ? 'కల్టివేటర్ (Cultivator)' : 'Cultivator' },
    { id: 'Trailer Services', label: isTe ? 'ట్రాలీ రవాణా (Trailer Services)' : 'Trailer Services' },
    { id: 'Disc Harrow', label: isTe ? 'డిస్క్ హారో (Disc Harrow)' : 'Disc Harrow' },
    { id: 'Cage Wheels', label: isTe ? 'కేజ్ వీల్స్ (Cage Wheels)' : 'Cage Wheels' },
    { id: 'Ridger / Bund Maker', label: isTe ? 'గట్లు వేసే పరికరం (Ridger)' : 'Ridger / Bund Maker' }
  ];

  const handleEquipmentToggle = (itemId) => {
    setFormData((prev) => {
      const exists = prev.equipmentList.includes(itemId);
      const updated = exists
        ? prev.equipmentList.filter(eq => eq !== itemId)
        : [...prev.equipmentList, itemId];
      return { ...prev, equipmentList: updated };
    });
  };

  const [errorMsg, setErrorMsg] = useState('');
  const [successTractor, setSuccessTractor] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.equipmentList.length === 0 && !formData.customEquipment) {
      setErrorMsg(isTe ? 'దయచేసి కనీసం ఒక వ్యవసాయ పరికరాన్ని ఎంచుకోండి.' : 'Please select at least one agricultural equipment or specify attachments.');
      return;
    }

    const allEquipments = [
      ...formData.equipmentList,
      ...(formData.customEquipment ? [formData.customEquipment] : [])
    ].join(', ');

    const newTractor = {
      id: Date.now(),
      owner: formData.owner,
      mobile: formData.mobile,
      location: formData.location,
      brand: formData.brand,
      model: formData.model || `${formData.brand} Standard`,
      equipment: allEquipments,
      pricing: Number(formData.pricing) || 1200,
      availability: formData.availability,
      photo: formData.photo || '/tractor1.jpeg',
      rating: 4.9,
      jobsDone: 0,
      registeredAt: new Date().toLocaleDateString()
    };

    setTractors((prev) => [newTractor, ...prev]);
    setErrorMsg('');
    setSuccessTractor(newTractor);
  };

  return (
    <div className="form-card-wrapper page-anim">
      <div className="form-header">
        <h3>{t.ownerRegTitle}</h3>
        <p>{t.ownerRegSubtitle}</p>
      </div>

      {errorMsg && (
        <div style={{
          background: '#ffebee',
          color: '#c62828',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '16px',
          fontWeight: '600',
          border: '1px solid #ffcdd2'
        }}>
          ⚠️ {errorMsg}
        </div>
      )}

      {successTractor && (
        <div className="receipt-modal-backdrop" style={{ zIndex: 9999 }}>
          <div className="receipt-modal-card" style={{ maxWidth: '480px', padding: '0', overflow: 'hidden' }}>
            <div style={{
              background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
              color: 'white',
              padding: '24px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '42px', marginBottom: '8px' }}>🎉</div>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>
                {isTe ? 'ట్రాక్టర్ విజయవంతంగా నమోదు చేయబడింది!' : 'Tractor Registered Successfully!'}
              </h3>
            </div>
            <div style={{ padding: '24px', textAlign: 'center', background: '#fff' }}>
              <p style={{ fontSize: '15px', color: '#1e293b', lineHeight: 1.6, marginBottom: '20px' }}>
                {isTe
                  ? `మీ ${successTractor.brand} ${successTractor.model} స్థానిక ట్రాక్టర్ ఫ్లీట్‌లో చేర్చబడింది. రైతులు ఇప్పుడే మీ ట్రాక్టర్‌ను బుక్ చేసుకోవచ్చు!`
                  : `Your ${successTractor.brand} ${successTractor.model} is now active in the local fleet. Farmers can now view and book it!`}
              </p>
              <button
                type="button"
                className="btn btn-primary"
                style={{ padding: '12px 32px', fontSize: '15px', fontWeight: 800 }}
                onClick={() => {
                  setSuccessTractor(null);
                  setActivePage('find-tractor');
                }}
              >
                ✓ {isTe ? 'సరే (ఫ్లీట్ చూడండి)' : 'OK (View in Fleet)'}
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="styled-form">
        {/* Field 1: Owner Name */}
        <div className="form-group">
          <label htmlFor="ownerName">{t.ownerNameLabel}</label>
          <input
            id="ownerName"
            type="text"
            required
            placeholder={isTe ? "ఉదా: రమేష్ కుమార్ / శైలు" : "e.g. Ramesh Kumar / Sailu"}
            value={formData.owner}
            onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
          />
        </div>

        {/* Field 2 & 3: Mobile Number & Location */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="ownerMobile">{t.ownerMobileLabel}</label>
            <input
              id="ownerMobile"
              type="tel"
              pattern="[0-9]{10}"
              required
              placeholder={isTe ? "10 అంకెల మొబైల్ నంబర్" : "10-digit phone number"}
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="ownerLocation">{t.ownerLocationLabel}</label>
            <input
              id="ownerLocation"
              type="text"
              required
              placeholder={isTe ? "ఉదా: హసన్‌పర్తి, వరంగల్ రూరల్" : "e.g. Hasanparthy, Warangal"}
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>
        </div>

        {/* Field 4 & 5: Tractor Brand & Tractor Model */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="tractorBrand">{t.tractorBrandLabel}</label>
            <select
              id="tractorBrand"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            >
              <option value="Mahindra">Mahindra</option>
              <option value="John Deere">John Deere</option>
              <option value="Swaraj">Swaraj</option>
              <option value="Massey Ferguson">Massey Ferguson</option>
              <option value="Sonalika">Sonalika</option>
              <option value="New Holland">New Holland</option>
              <option value="Farmtrac">Farmtrac</option>
              <option value="Eicher">Eicher</option>
              <option value="Kubota">Kubota</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="tractorModel">{t.tractorModelLabel}</label>
            <input
              id="tractorModel"
              type="text"
              required
              placeholder="e.g. 575 DI / 475 DI / 5050 D"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            />
          </div>
        </div>

        {/* Field 6: Equipment / Implements */}
        <div className="form-group">
          <label>{t.availableEquipLabel}</label>
          <div className="checkbox-grid">
            {standardEquipments.map((eq) => (
              <label key={eq.id} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.equipmentList.includes(eq.id)}
                  onChange={() => handleEquipmentToggle(eq.id)}
                />
                <span>{eq.label}</span>
              </label>
            ))}
          </div>
          <input
            type="text"
            placeholder={isTe ? "ఇతర పరికరాలు (ఉదా: సీడ్ డ్రిల్, రీపర్...)" : "Additional tools (e.g. Seed drill, reaper...)"}
            style={{ marginTop: '8px' }}
            value={formData.customEquipment}
            onChange={(e) => setFormData({ ...formData, customEquipment: e.target.value })}
          />
        </div>

        {/* Field 7 & 8: Pricing & Availability */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="pricing">{t.pricingLabel}</label>
            <input
              id="pricing"
              type="number"
              min="500"
              max="5000"
              step="50"
              required
              value={formData.pricing}
              onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="availability">{t.availabilityStatusLabel}</label>
            <select
              id="availability"
              value={formData.availability}
              onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
            >
              <option value="Available">{t.available}</option>
              <option value="Busy">{t.busy}</option>
              <option value="Under Maintenance">{t.maintenance}</option>
            </select>
          </div>
        </div>

        {/* Field 9: Photos */}
        <div className="form-group">
          <label>{t.tractorPhotosLabel}</label>
          <div className="photo-presets-grid">
            {photoPresets.map((preset) => (
              <div
                key={preset.src}
                className={`photo-preset-item ${formData.photo === preset.src ? 'selected' : ''}`}
                onClick={() => setFormData({ ...formData, photo: preset.src })}
              >
                <img src={preset.src} alt={preset.label} />
                <span>{preset.label}</span>
              </div>
            ))}
          </div>

          <input
            type="text"
            placeholder={isTe ? "లేదా ఫోటో URL ఇవ్వండి (ఐచ్ఛికం)" : "Or paste custom image URL (optional)"}
            style={{ marginTop: '8px' }}
            value={formData.photo.startsWith('/') ? '' : formData.photo}
            onChange={(e) => setFormData({ ...formData, photo: e.target.value || '/tractor1.jpeg' })}
          />
        </div>

        <button type="submit" className="btn btn-secondary w-100" style={{ padding: '14px', fontSize: '16px' }}>
          {t.btnRegisterTractorSubmit}
        </button>
      </form>
    </div>
  );
}
