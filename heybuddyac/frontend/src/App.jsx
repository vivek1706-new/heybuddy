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

import AgentLogin from './pages/agent/AgentLogin';
import AgentOnboard from './pages/agent/AgentOnboard';
import AgentDash from './pages/agent/AgentDashboard';

import { useApp } from './store/AppContext';
import { C } from './constants/colors';
import AdminPortal from './pages/admin/AdminPortal';

function App() {
  const { mode, scr, agentLoggedIn, agentOnboarded } = useApp();

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
