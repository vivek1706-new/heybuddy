// Force redeploy with latest flow: Locality -> Mobile -> OTP -> Model
import { useEffect } from 'react';
import Header from './components/layout/Header';
import Landing from './pages/buyer/Landing';
import Location from './pages/buyer/Location';
import Phone from './pages/buyer/Phone';
import OTP from './pages/buyer/OTP';
import Path from './pages/buyer/Path';
import Quiz from './pages/buyer/Quiz';
import Search from './pages/buyer/Search';
import Results from './pages/buyer/Results';
import Confirm from './pages/buyer/Confirm';
import Profile from './pages/buyer/Profile';
import QuoteInbox from './pages/buyer/QuoteInbox';
import SEOLanding from './pages/buyer/SEOLanding';
import CityPage from './pages/buyer/CityPage';
import LocalityPage from './pages/buyer/LocalityPage';

import AgentLogin from './pages/agent/AgentLogin';
import AgentOnboard from './pages/agent/AgentOnboard';
import AgentDash from './pages/agent/AgentDashboard';

import { useApp } from './store/AppContext';
import { C } from './constants/colors';
import { CATS } from './constants/data';
import { LOC_BY_SLUG } from './constants/localities';
import AdminPortal from './pages/admin/AdminPortal';

// SEO route mapping: /air-conditioner-dealers-in-noida -> { catId: 'ac', city: 'Noida' }
const SEO_CAT_MAP = {
  'air-conditioner': 'ac', 'refrigerator': 'fridge', 'television': 'tv',
  'laptop': 'laptop', 'washing-machine': 'washer', 'smartphone': 'mobile',
  'water-purifier': 'purifier', 'dishwasher': 'dishwasher',
};
const SEO_CITY_MAP = {
  'noida': 'Noida', 'greater-noida': 'Greater Noida', 'delhi': 'Delhi',
  'gurgaon': 'Gurgaon', 'ghaziabad': 'Ghaziabad', 'mumbai': 'Mumbai',
  'bangalore': 'Bangalore', 'hyderabad': 'Hyderabad', 'chennai': 'Chennai',
  'pune': 'Pune', 'kolkata': 'Kolkata', 'ahmedabad': 'Ahmedabad',
  'jaipur': 'Jaipur', 'lucknow': 'Lucknow', 'chandigarh': 'Chandigarh',
};

function parseSEOPath(path) {
  const clean = path.replace(/^\//, '').replace(/-dealers(-in-(.+))?$/, (_, __, city) => '|' + (city || ''));
  const [catSlug, citySlug] = clean.split('|');
  const catId = SEO_CAT_MAP[catSlug];
  const city = citySlug ? SEO_CITY_MAP[citySlug] : null;
  return catId ? { catId, city } : null;
}

function App() {
  const { mode, scr, setCat, setScr, agentLoggedIn, agentOnboarded } = useApp();

  // Handle SEO URLs on first load
  useEffect(() => {
    const path = window.location.pathname.replace(/^\//, '');

    // City page: /dealers-in-noida
    if (path === 'dealers-in-noida') {
      setScr('city-noida');
      return;
    }

    // Locality page: /sector-62-noida, /alpha-greater-noida, etc.
    if (LOC_BY_SLUG[path]) {
      window._seoLocality = LOC_BY_SLUG[path];
      setScr('locality');
      return;
    }

    // Category SEO: /air-conditioner-dealers-in-noida
    const seo = parseSEOPath(window.location.pathname);
    if (seo) {
      const cat = CATS.find(c => c.id === seo.catId);
      if (cat) {
        setCat(cat);
        setScr('seo');
        window._seoCity = seo.city;
      }
    }
  }, []);

  // Secure Back-Office Routing
  const isAdmin = window.location.hash === '#admin';
  if (isAdmin) {
    return <AdminPortal />;
  }

  function BuyerRouter() {
    switch (scr) {
      case 'landing': return <Landing />;
      case 'location': return <Location />;
      case 'phone': return <Phone />;
      case 'otp': return <OTP />;
      case 'path': return <Path />;
      case 'quiz': return <Quiz />;
      case 'search': return <Search />;
      case 'results': return <Results />;
      case 'confirm': return <Confirm />;
      case 'profile': return <Profile />;
      case 'quotes': return <QuoteInbox />;
      case 'seo': return <SEOLanding />;
      case 'city-noida': return <CityPage />;
      case 'locality': return <LocalityPage locality={window._seoLocality} />;
      default: return <Landing />;
    }
  }

  function AgentRouter() {
    if (!agentLoggedIn) return <AgentLogin />;
    if (!agentOnboarded) return <AgentOnboard />;
    return <AgentDash />;
  }

  return (
    <div style={{
      fontFamily: '"Outfit", "DM Sans", system-ui, sans-serif',
      background: C.dark,
      color: C.txt,
      minHeight: '100vh',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <Header />
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        {mode === 'buyer' ? <BuyerRouter /> : <AgentRouter />}
      </div>
      <div style={{ borderTop: '1px solid ' + C.brd, padding: '16px 20px', textAlign: 'center', marginTop: 40 }}>
        <div style={{ fontSize: 11, color: C.mut }}>
          HeyBuddy — Research Online, Buy Offline at the Best Price
        </div>
      </div>
    </div>
  );
}

export default App;
