import { translations } from '../translations';

export default function Header({ 
  activePage, 
  toggleMobileMenu, 
  activeRole, 
  setActiveRole,
  language = 'en',
  setLanguage,
  isAdminLoggedIn,
  onAdminLogout
}) {
  const t = translations[language] || translations.en;

  const getPageTitle = (page) => {
    switch (page) {
      case 'home':
        return t.heroTitle;
      case 'find-tractor':
        return language === 'te' ? 'గ్రామంలో అందుబాటులో ఉన్న ట్రాక్టర్లు' : 'Find Tractor Fleet in Locality';
      case 'booking-form':
        return t.bookingFormTitle;
      case 'owner-registration':
        return t.ownerRegTitle;
      case 'owner-inbox':
        return t.ownerInboxTitle;
      case 'my-bookings':
        return t.myBookingsTitle;
      case 'admin-dashboard':
        return language === 'te' ? 'అడ్మిన్ డ్యాష్‌బోర్డ్' : 'Website Admin Dashboard';
      default:
        return t.brandSubtitle;
    }
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'te' : 'en'));
  };

  return (
    <header className="top-header">
      <div className="header-left">
        <button
          className="mobile-menu-btn"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          ☰
        </button>
        <div className="header-title">
          {getPageTitle(activePage)}
        </div>
      </div>

      <div className="header-right">
        {/* Locality Pill */}
        <div className="locality-pill" title="Locality covered by our network">
          <span>📍</span>
          <span>{t.localityLabel}</span>
        </div>

        {/* Language Switcher */}
        <button
          className="lang-toggle-btn"
          onClick={toggleLanguage}
          title="Switch language between English and Telugu"
        >
          <span>🌐</span>
          <span>{language === 'en' ? 'తెలుగు' : 'English'}</span>
        </button>

        {/* Role Switcher */}
        <div className="role-switcher" title={t.switchRole}>
          <button
            className={`role-btn ${activeRole === 'farmer' ? 'active' : ''}`}
            onClick={() => setActiveRole('farmer')}
          >
            {t.roleFarmer}
          </button>
          <button
            className={`role-btn ${activeRole === 'owner' ? 'active' : ''}`}
            onClick={() => setActiveRole('owner')}
          >
            {t.roleOwner}
          </button>
          <button 
            className={`role-btn ${activeRole === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveRole('admin')}
            title={isAdminLoggedIn ? 'Admin Authenticated' : 'Admin Login Required'}
          >
            {t.roleAdmin} {isAdminLoggedIn ? '🔓' : '🔒'}
          </button>
        </div>

        {isAdminLoggedIn && onAdminLogout && (
          <button 
            className="btn btn-call" 
            style={{ background: '#d32f2f', padding: '5px 10px', fontSize: '11px' }}
            onClick={onAdminLogout}
            title={t.adminLogoutBtn}
          >
            🚪
          </button>
        )}
      </div>
    </header>
  );
}
