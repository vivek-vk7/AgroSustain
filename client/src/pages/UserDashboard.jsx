import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
    const { user, setUser, logout } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'profile'

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [updateLoading, setUpdateLoading] = useState(false);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);
        setMessage('');
        try {
            const { data } = await axios.put('http://localhost:5000/api/auth/profile', { name, email, password });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            setMessage('Profile Updated Successfully! ✨');
            setPassword('');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error updating profile');
        }
        setUpdateLoading(false);
    };

    useEffect(() => {
        const fetchMyOrders = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/orders/myorders');
                setOrders(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        if (user && activeTab === 'orders') fetchMyOrders();
    }, [user, activeTab]);

    return (
        <div className="min-h-screen p-4 md:p-8 relative">
            {/* Global background enabled */}

            <div className="max-w-5xl mx-auto z-10 relative">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <h1 className="text-4xl font-black text-green-800 tracking-tighter">My Account</h1>
                    <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 px-8 rounded-xl transition-all shadow-lg">Logout</button>
                </div>

                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`px-6 py-2.5 rounded-t-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'bg-white/70 backdrop-blur-lg text-green-700' : 'bg-green-200/40 text-green-900/40 hover:bg-green-200/60'}`}
                    >
                        Purchase History
                    </button>
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`px-6 py-2.5 rounded-t-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'profile' ? 'bg-white/70 backdrop-blur-lg text-green-700' : 'bg-green-200/40 text-green-900/40 hover:bg-green-200/60'}`}
                    >
                        My Profile
                    </button>
                </div>

                <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-b-3xl rounded-tr-3xl shadow-2xl p-6 md:p-10 min-h-[400px]">
                    {activeTab === 'orders' ? (
                        <>
                            <h2 className="text-2xl font-black text-green-900 mb-8 uppercase tracking-tight border-b border-green-100 pb-4 flex justify-between items-center">
                                My Orders
                                <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">{orders.length} Total</span>
                            </h2>

                            {loading ? (
                                <div className="flex justify-center py-20">
                                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-600"></div>
                                </div>
                            ) : orders.length === 0 ? (
                                <div className="text-center py-20 bg-white/30 rounded-3xl border border-dashed border-green-200">
                                    <p className="text-green-800 font-bold italic text-lg mb-6">You haven't ordered any organic goodness yet. 🍎</p>
                                    <Link to="/" className="text-green-600 font-black border-2 border-green-600 px-8 py-3 rounded-xl hover:bg-green-600 hover:text-white transition-all">BROWSE PRODUCTS</Link>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="text-xs font-black text-green-900/40 uppercase tracking-[0.2em] border-b border-green-100">
                                                <th className="p-4">ID / Reference</th>
                                                <th className="p-4">Date</th>
                                                <th className="p-4">Total</th>
                                                <th className="p-4">Status</th>
                                                <th className="p-4">Detail</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-green-50">
                                            {orders.map((o) => (
                                                <tr key={o._id} className="hover:bg-white/40 transition-colors">
                                                    <td className="p-4 font-bold text-green-900 truncate max-w-[120px]">{o._id}</td>
                                                    <td className="p-4 text-sm font-medium text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                                                    <td className="p-4 font-black text-green-800">${o.totalPrice}</td>
                                                    <td className="p-4">
                                                        <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${o.isDelivered ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-orange-50 text-orange-700 border border-orange-100'}`}>
                                                            {o.isDelivered ? 'Delivered' : 'In Transit'}
                                                        </span>
                                                    </td>
                                                    <td className="p-4">
                                                        <Link to={`/order/${o._id}`} className="text-green-600 font-black text-xs hover:underline uppercase tracking-widest">
                                                            View →
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="max-w-md mx-auto py-10">
                            <h2 className="text-2xl font-black text-green-900 mb-8 text-center uppercase tracking-tight">Profile Settings</h2>

                            {message && <div className={`p-4 rounded-2xl mb-6 text-sm font-bold text-center ${message.includes('Error') ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>{message}</div>}

                            <form onSubmit={handleProfileUpdate} className="space-y-5">
                                <div className="bg-white/50 p-6 rounded-3xl border border-white/50 shadow-sm focus-within:ring-2 focus-within:ring-green-500/20 transition-all">
                                    <p className="text-[10px] font-black text-green-700 uppercase tracking-widest mb-1">Full Name</p>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-transparent text-xl font-bold text-green-900 outline-none placeholder-green-900/20"
                                        placeholder="Enter your name"
                                    />
                                </div>
                                <div className="bg-white/50 p-6 rounded-3xl border border-white/50 shadow-sm focus-within:ring-2 focus-within:ring-green-500/20 transition-all">
                                    <p className="text-[10px] font-black text-green-700 uppercase tracking-widest mb-1">Email Address</p>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-transparent text-lg font-bold text-green-900 outline-none placeholder-green-900/20"
                                        placeholder="Enter your email"
                                    />
                                </div>
                                <div className="bg-white/50 p-6 rounded-3xl border border-white/50 shadow-sm focus-within:ring-2 focus-within:ring-green-500/20 transition-all">
                                    <p className="text-[10px] font-black text-green-700 uppercase tracking-widest mb-1">Change Password</p>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-transparent text-lg font-bold text-green-900 outline-none placeholder-green-900/20"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div className="bg-white/50 p-6 rounded-3xl border border-white/50 shadow-sm opacity-60">
                                    <p className="text-[10px] font-black text-green-700 uppercase tracking-widest mb-1">Your Role</p>
                                    <p className="text-lg font-bold text-green-900 uppercase tracking-widest">{user.role}</p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={updateLoading}
                                    className="w-full bg-green-600 text-white font-black py-4 rounded-2xl hover:bg-green-700 shadow-xl tracking-widest transition-all active:scale-[0.98] disabled:opacity-50"
                                >
                                    {updateLoading ? 'UPDATING...' : 'SAVE CHANGES'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
