import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = ({ children, roles, requireVerified }) => {
    const { user, loading, logout } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-green-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/" />;
    }

    // Role-based verification check
    if (requireVerified && (user.role === 'farmer' || user.role === 'expert') && user.proposerStatus !== 'approved') {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 relative bg-gradient-to-br from-green-50 to-emerald-100">
                <div className="w-full max-w-2xl bg-white/70 backdrop-blur-lg border border-white/50 rounded-2xl shadow-2xl p-8 z-10 relative text-center">
                    <h1 className="text-3xl font-bold text-green-800 mb-4 tracking-tight">Access Restricted</h1>
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 p-6 rounded-lg mb-6 shadow-inner">
                        <p className="text-yellow-700 font-bold text-lg mb-1 uppercase tracking-wider">Status: {user.proposerStatus || 'Pending'}</p>
                        <p className="text-gray-600 font-medium italic">Our admins are reviewing your credentials. You'll be notified via email once approved. 🌱</p>
                    </div>
                    <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 px-10 rounded-xl transition-all shadow-lg hover:shadow-red-200">Logout</button>
                </div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
