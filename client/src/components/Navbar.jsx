import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import CartContext from '../context/CartContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cartItems } = useContext(CartContext);
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

                    {user?.role === 'admin' && <Link to="/admin/dashboard" className="text-xs font-black uppercase tracking-widest text-emerald-600">Admin</Link>}
                    {user?.role === 'proposer' && <Link to="/proposer/dashboard" className="text-xs font-black uppercase tracking-widest text-emerald-600">Proposer</Link>}
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
                            <button
                                onClick={logout}
                                className="bg-red-500/10 hover:bg-red-500 text-red-600 hover:text-white font-black text-[10px] uppercase tracking-widest px-5 py-2.5 rounded-2xl transition-all border border-red-500/20 shadow-sm"
                            >
                                Leave
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="bg-green-600 hover:bg-green-700 text-white font-black text-[10px] uppercase tracking-widest px-8 py-3 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95"
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
