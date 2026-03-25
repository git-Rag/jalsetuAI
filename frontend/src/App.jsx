import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Villages from './pages/Villages';
import Groundwater from './pages/Groundwater';
import Predictions from './pages/Predictions';
import AIInsights from './pages/AIInsights';
import VillageDetail from './pages/VillageDetail';
import About from './pages/About';

import './App.css';

export default function App() {
  const location = useLocation();
  const showSidebar = location.pathname !== '/';

  return (
    <div className='app'>
      <Navbar />
      <div className='app-layout'>
        {showSidebar && <Sidebar />}
        <main className='app-main' style={{ minHeight: showSidebar ? undefined : 'auto', padding: showSidebar ? '24px' : '0' }}>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/villages' element={<Villages />} />
            <Route path='/villages/:id' element={<VillageDetail />} />
            <Route path='/groundwater' element={<Groundwater />} />
            <Route path='/predictions' element={<Predictions />} />
            <Route path='/ai' element={<AIInsights />} />
            <Route path='/about' element={<About />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
