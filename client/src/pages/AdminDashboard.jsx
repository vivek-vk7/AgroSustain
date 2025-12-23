import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [education, setEducation] = useState([]);
    const [activeTab, setActiveTab] = useState('users');
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
        } else {
            if (activeTab === 'users') fetchProposers();
            if (activeTab === 'products') fetchPendingProducts();
            if (activeTab === 'education') fetchPendingEducation();
        }
    }, [user, navigate, activeTab]);

    const fetchProposers = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/admin/users?status=pending', config);
            setUsers(data);
        } catch (error) { console.error(error); }
    };

    const fetchPendingProducts = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/admin/products', config);
            setProducts(data);
        } catch (error) { console.error(error); }
    };

    const fetchPendingEducation = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/admin/education', config);
            setEducation(data);
        } catch (error) { console.error(error); }
    };

    const handleUserStatusUpdate = async (id, status) => {
        if (window.confirm(`Are you sure you want to ${status} this user?`)) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.put(`http://localhost:5000/api/admin/users/${id}/status`, { status }, config);
                fetchProposers();
            } catch (error) { alert(error.response?.data?.message || 'Error updating status'); }
        }
    };

    const handleProductApproval = async (id, isApproved) => {
        if (window.confirm(`Are you sure?`)) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.put(`http://localhost:5000/api/admin/products/${id}/approve`, { isApproved }, config);
                fetchPendingProducts();
            } catch (error) { alert(error.response?.data?.message || 'Error'); }
        }
    };

    const handleEducationApproval = async (id, isApproved) => {
        if (window.confirm(`Are you sure?`)) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.put(`http://localhost:5000/api/admin/education/${id}/approve`, { isApproved }, config);
                fetchPendingEducation();
            } catch (error) { alert(error.response?.data?.message || 'Error'); }
        }
    };

    return (
        <div className="min-h-screen p-4 md:p-8 relative">
            {/* Global background enabled */}
            <div className="max-w-6xl mx-auto z-10 relative">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-green-800 tracking-tight">Admin Control Panel</h1>
                    <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-md">Logout</button>
                </div>

                {/* Nav Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {['users', 'products', 'education'].map((tab) => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2 rounded-t-xl font-bold transition-all capitalize ${activeTab === tab ? 'bg-white/70 backdrop-blur-lg text-green-700 border-t border-x border-white/50' : 'bg-green-200/50 text-green-900 hover:bg-green-200'}`}>
                            {tab === 'users' ? 'Proposers' : tab === 'products' ? 'Products' : 'Education'}
                        </button>
                    ))}
                </div>

                <div className="bg-white/70 backdrop-blur-lg border border-white/50 rounded-b-2xl rounded-tr-2xl shadow-2xl p-6 md:p-8">
                    {activeTab === 'users' && (
                        <div>
                            <h2 className="text-2xl font-bold text-green-700 mb-6">Proposer Approvals ({users.length})</h2>
                            {users.length === 0 ? <p className="text-center py-10 italic">No pending users.</p> : (
                                <table className="w-full text-left">
                                    <tr className="border-b border-green-200">
                                        <th className="p-4">Name</th><th className="p-4 text-center">Actions</th>
                                    </tr>
                                    {users.map(u => (
                                        <tr key={u._id} className="border-b border-green-50 hover:bg-white/30">
                                            <td className="p-4 font-medium">{u.name} ({u.email})</td>
                                            <td className="p-4 flex justify-center gap-2">
                                                <button onClick={() => handleUserStatusUpdate(u._id, 'approved')} className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold">Approve</button>
                                                <button onClick={() => handleUserStatusUpdate(u._id, 'rejected')} className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm font-bold">Reject</button>
                                            </td>
                                        </tr>
                                    ))}
                                </table>
                            )}
                        </div>
                    )}

                    {activeTab === 'products' && (
                        <div>
                            <h2 className="text-2xl font-bold text-green-700 mb-6">Product Approvals ({products.length})</h2>
                            {products.length === 0 ? <p className="text-center py-10 italic">No pending products.</p> : (
                                <table className="w-full text-left">
                                    <tr className="border-b border-green-200"><th className="p-4">Product</th><th className="p-4 text-center">Actions</th></tr>
                                    {products.map(p => (
                                        <tr key={p._id} className="border-b border-green-50 hover:bg-white/30">
                                            <td className="p-4 flex items-center gap-3">
                                                <img src={p.image} className="w-10 h-10 object-cover rounded shadow" />
                                                <div><p className="font-bold">{p.name}</p><p className="text-xs text-gray-500">By: {p.user?.name}</p></div>
                                            </td>
                                            <td className="p-4 flex justify-center gap-2">
                                                <button onClick={() => handleProductApproval(p._id, true)} className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold">Approve</button>
                                                <button onClick={() => handleProductApproval(p._id, false)} className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm font-bold">Reject</button>
                                            </td>
                                        </tr>
                                    ))}
                                </table>
                            )}
                        </div>
                    )}

                    {activeTab === 'education' && (
                        <div>
                            <h2 className="text-2xl font-bold text-green-700 mb-6">Education Approvals ({education.length})</h2>
                            {education.length === 0 ? <p className="text-center py-10 italic">No pending content.</p> : (
                                <table className="w-full text-left">
                                    <tr className="border-b border-green-200"><th className="p-4">Title</th><th className="p-4 text-center">Actions</th></tr>
                                    {education.map(e => (
                                        <tr key={e._id} className="border-b border-green-50 hover:bg-white/30">
                                            <td className="p-4">
                                                <p className="font-bold">{e.title}</p>
                                                <p className="text-xs text-gray-500 italic">Category: {e.category} | Author: {e.user?.name}</p>
                                                <div className="text-xs text-blue-600 overflow-hidden line-clamp-1 max-w-xs">{e.resourceUrl}</div>
                                            </td>
                                            <td className="p-4 flex justify-center gap-2">
                                                <button onClick={() => handleEducationApproval(e._id, true)} className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold">Approve</button>
                                                <button onClick={() => handleEducationApproval(e._id, false)} className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm font-bold">Reject</button>
                                            </td>
                                        </tr>
                                    ))}
                                </table>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
