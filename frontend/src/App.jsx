import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Camera, LogOut, UserPlus, ShieldAlert } from 'lucide-react';
import Students from './pages/Students';
import LiveRecognition from './pages/LiveRecognition';
import Login from './pages/Login';
import PublicRegistration from './pages/PublicRegistration';

function Dashboard() {
  return (
    <div className="p-8 h-full overflow-y-auto w-full">
      <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="glass-panel p-6 flex flex-col justify-between border-l-4 border-blue-500">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Total Enrolled</h3>
          <p className="text-4xl font-bold text-slate-800">12</p>
        </div>
        <div className="glass-panel p-6 flex flex-col justify-between border-l-4 border-green-500">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Present Today</h3>
          <p className="text-4xl font-bold text-green-600">8</p>
        </div>
        <div className="glass-panel p-6 flex flex-col justify-between border-l-4 border-amber-500">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Absentees</h3>
          <p className="text-4xl font-bold text-amber-600">4</p>
        </div>
        <div className="glass-panel p-6 flex flex-col justify-between border-l-4 border-indigo-500">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Recognition Avg</h3>
          <p className="text-4xl font-bold text-indigo-600">98%</p>
        </div>
      </div>

      <div className="glass-panel w-full min-h-[400px] p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Recent Attendance Logs</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <th className="p-3">ID</th>
              <th className="p-3">Student Name</th>
              <th className="p-3">Time</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            <tr className="border-t border-slate-100">
              <td className="p-3 text-slate-500">S101</td>
              <td className="p-3 font-medium text-slate-800">Jane Doe</td>
              <td className="p-3 text-slate-500">09:14 AM</td>
              <td className="p-3"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-md font-semibold text-xs">Present</span></td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="p-3 text-slate-500">S102</td>
              <td className="p-3 font-medium text-slate-800">John Smith</td>
              <td className="p-3 text-slate-500">08:45 AM</td>
              <td className="p-3"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-md font-semibold text-xs">Present</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Sidebar({ onLogout }) {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 shadow-xl h-full flex flex-col text-slate-300 relative z-20">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold shadow-lg shadow-indigo-500/20">AI</div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">upasthiti_AI</h2>
          <p className="text-[10px] text-indigo-400 font-medium uppercase tracking-widest mt-0.5">Admin Console</p>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <Link to="/admin" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-colors font-medium">
          <LayoutDashboard size={20} />
          Dashboard Logs
        </Link>
        <Link to="/admin/students" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-colors font-medium">
          <Users size={20} />
          Student Catalog
        </Link>
        <Link to="/" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-colors font-medium mt-8 border-t border-slate-800 pt-6">
          <LogOut size={20} className="rotate-180" />
          Exit to Public
        </Link>

        <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-colors font-medium mt-auto absolute bottom-6 left-4 right-4" style={{ width: 'calc(100% - 2rem)' }}>
          <LogOut size={20} />
          Sign Out
        </button>
      </nav>
    </aside>
  );
}

function AdminLayout({ onLogout, children }) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans w-full">
      <Sidebar onLogout={onLogout} />
      <main className="flex-1 overflow-y-auto relative w-full">
        {children}
      </main>
    </div>
  );
}

function PublicLayout({ children }) {
  const location = useLocation();
  const isAttendance = location.pathname.includes('/attendance');
  const isRegister = location.pathname.includes('/register');

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden font-sans relative">
      {/* Decorative background blobs for public layout */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-400/10 rounded-full blur-3xl pointer-events-none"></div>

      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex justify-between items-center z-10 sticky top-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold shadow-lg shadow-indigo-500/30">AI</div>
          <span className="text-2xl font-black tracking-tight text-slate-800">upasthiti<span className="text-indigo-600">_AI</span></span>
        </div>

        <nav className="hidden md:flex items-center gap-2 bg-slate-100/80 p-1.5 rounded-2xl">
          <Link to="/attendance" className={`px-5 py-2.5 rounded-xl font-bold transition-all ${isAttendance ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'}`}>Live Station</Link>
          <Link to="/register" className={`px-5 py-2.5 rounded-xl font-bold transition-all ${isRegister ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'}`}>Student Enrollment</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/login" className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg shadow-slate-900/20 transition-all transform hover:-translate-y-0.5">
            <ShieldAlert size={18} />
            Admin
          </Link>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto z-10 relative">
        {children}
      </main>

      <footer className="bg-white/80 backdrop-blur-sm border-t border-slate-200 py-3 text-center z-10 shrink-0">
        <p className="text-sm font-semibold text-slate-500 tracking-wide uppercase">
          made with love by <span className="text-indigo-600 font-bold">SAYAN</span>
        </p>
      </footer>
    </div>
  );
}

function App() {
  const [token, setToken] = useState(localStorage.getItem('admin_token'));

  const handleLogin = (newToken) => {
    localStorage.setItem('admin_token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/attendance" />} />
        <Route path="/attendance" element={<PublicLayout><LiveRecognition /></PublicLayout>} />
        <Route path="/register" element={<PublicLayout><PublicRegistration /></PublicLayout>} />
        <Route path="/login" element={token ? <Navigate to="/admin" /> : <Login onLogin={handleLogin} />} />

        {/* Protected Routes */}
        <Route path="/admin" element={token ? <AdminLayout onLogout={handleLogout}><Dashboard /></AdminLayout> : <Navigate to="/login" />} />
        <Route path="/admin/students" element={token ? <AdminLayout onLogout={handleLogout}><Students /></AdminLayout> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
