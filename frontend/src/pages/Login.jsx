import React, { useState } from 'react';
import axios from 'axios';
import { Lock, User } from 'lucide-react';

export default function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/auth/login', {
                username,
                password
            });
            if (response.data.access_token) {
                onLogin(response.data.access_token);
            }
        } catch (err) {
            setError('Invalid username or password (Hint: admin / admin123)');
        }
    };

    return (
        <div className="min-h-screen bg-bgDark flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-3xl mix-blend-screen"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-3xl mix-blend-screen"></div>

            <div className="glass-panel w-full max-w-md p-8 relative z-10 border-white/10 bg-slate-900/60 shadow-2xl">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
                        <Lock className="text-white" size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">upasthiti_<span className="text-indigo-400">AI</span></h1>
                    <p className="text-slate-400 mt-2 font-medium tracking-wide uppercase text-sm">Secure Administrator Login</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <div className="relative">
                            <input
                                required
                                type="text"
                                placeholder="Username"
                                className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 text-white rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-500"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                            />
                            <User className="absolute left-4 top-3.5 text-slate-400" size={20} />
                        </div>
                    </div>
                    <div>
                        <div className="relative">
                            <input
                                required
                                type="password"
                                placeholder="Password"
                                className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 text-white rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-500"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                            <Lock className="absolute left-4 top-3.5 text-slate-400" size={20} />
                        </div>
                    </div>

                    <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all transform active:scale-[0.98]">
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
}
