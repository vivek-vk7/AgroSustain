import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import CartContext from '../context/CartContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cartItems } = useContext(CartContext);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

    return (
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50">
            <div className="bg-white/40 backdrop-blur-2xl border border-white/40 rounded-[2rem] shadow-2xl px-6 md:px-10 py-4 flex items-center justify-between transition-all hover:bg-white/50 hover:shadow-green-900/10">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-400 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                        <span className="text-white text-xl font-black">A</span>
                    </div>
                    <span className="text-2xl font-black text-green-900 tracking-tighter hidden md:block group-hover:text-green-600 transition-colors">AgroSustain</span>
                </Link>

                {/* Nav Links */}
                <div className="hidden lg:flex items-center gap-10">
                    <Link to="/" className="text-xs font-black uppercase tracking-widest text-green-900/60 hover:text-green-800 transition-colors">Market</Link>
                    <Link to="/education" className="text-xs font-black uppercase tracking-widest text-green-900/60 hover:text-green-800 transition-colors">Knowledge</Link>
                    <Link to="/about" className="text-xs font-black uppercase tracking-widest text-green-900/60 hover:text-green-800 transition-colors">About</Link>

                    {user?.role === 'admin' && <Link to="/admin/dashboard" className="text-xs font-black uppercase tracking-widest text-emerald-600">Admin</Link>}
                    {(user?.role === 'farmer' || user?.role === 'expert') && <Link to="/proposer/dashboard" className="text-xs font-black uppercase tracking-widest text-emerald-600">Dashboard</Link>}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <Link to="/cart" className="relative group p-2">
                        <span className="text-2xl group-hover:scale-110 transition-transform inline-block">🛒</span>
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {user ? (
                        <div className="flex items-center gap-3">
                            <Link to="/dashboard" className="hidden md:flex flex-col items-end">
                                <span className="text-[10px] font-black text-green-700 uppercase tracking-widest line-none">Welcome</span>
                                <span className="text-sm font-bold text-green-900 leading-none">{user.name.split(' ')[0]}</span>
                            </Link>

                            {/* Profile Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold shadow-lg border-2 border-white hover:scale-105 transition-transform"
                                >
                                    {user.name.charAt(0).toUpperCase()}
                                </button>

                                {dropdownOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setDropdownOpen(false)}
                                        ></div>
                                        <div className="absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-20 transform transition-all animate-in fade-in slide-in-from-top-2">
                                            <div className="px-4 py-2 border-b border-gray-100 mb-1">
                                                <p className="text-xs text-gray-500">Signed in as</p>
                                                <p className="text-sm font-bold text-gray-900 truncate">{user.email}</p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setDropdownOpen(false);
                                                    logout();
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-2"
                                            >
                                                <span className='text-lg'>🚪</span> Leave
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link
                                to="/login"
                                className="bg-white/50 hover:bg-white text-green-900 font-black text-[10px] uppercase tracking-widest px-6 py-3 rounded-2xl shadow-sm transition-all hover:scale-105 active:scale-95 border border-white/60"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/signup"
                                className="bg-green-600 hover:bg-green-700 text-white font-black text-[10px] uppercase tracking-widest px-6 py-3 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
