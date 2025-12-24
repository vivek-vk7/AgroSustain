import { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [education, setEducation] = useState([]);
    const [stats, setStats] = useState({ users: 0, products: 0, orders: 0, education: 0 });
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [activeTab, setActiveTab] = useState('stats');
    const [loading, setLoading] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const fetchStats = useCallback(async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/admin/stats', config);
            setStats(data);
        } catch (error) { console.error(error); toast.error('Failed to load stats'); }
        setLoading(false);
    }, [user.token]);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/admin/categories', config);
            setCategories(data);
        } catch (error) { console.error(error); toast.error('Failed to load categories'); }
        setLoading(false);
    }, [user.token]);

    const fetchProposers = useCallback(async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/admin/users?status=pending', config);
            setUsers(data);
        } catch (error) { console.error(error); toast.error('Failed to load users'); }
        setLoading(false);
    }, [user.token]);

    const fetchPendingProducts = useCallback(async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/admin/products', config);
            setProducts(data);
        } catch (error) { console.error(error); toast.error('Failed to load products'); }
        setLoading(false);
    }, [user.token]);

    const fetchPendingEducation = useCallback(async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/admin/education', config);
            setEducation(data);
        } catch (error) { console.error(error); toast.error('Failed to load content'); }
        setLoading(false);
    }, [user.token]);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
        } else {
            if (activeTab === 'stats') fetchStats();
            if (activeTab === 'users') fetchProposers();
            if (activeTab === 'products') fetchPendingProducts();
            if (activeTab === 'education') fetchPendingEducation();
            if (activeTab === 'categories') fetchCategories();
        }
    }, [user, navigate, activeTab, fetchStats, fetchProposers, fetchPendingProducts, fetchPendingEducation, fetchCategories]);

    const handleAddCategory = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('http://localhost:5000/api/admin/categories', { name: newCategory }, config);
            setNewCategory('');
            toast.success('Category added');
            fetchCategories();
        } catch (error) { toast.error(error.response?.data?.message || 'Error adding category'); }
    };

    const handleDeleteCategory = async (id) => {
        if (window.confirm('Delete this category?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`http://localhost:5000/api/admin/categories/${id}`, config);
                toast.success('Category deleted');
                fetchCategories();
            } catch (error) { toast.error(error.response?.data?.message || 'Error deleting category'); }
        }
    };

    const handleUserStatusUpdate = async (id, status) => {
        if (window.confirm(`Are you sure you want to ${status} this user?`)) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.put(`http://localhost:5000/api/admin/users/${id}/status`, { status }, config);
                toast.success(`User ${status}`);
                fetchProposers();
            } catch (error) { toast.error(error.response?.data?.message || 'Error updating status'); }
        }
    };

    const handleProductApproval = async (id, isApproved) => {
        if (window.confirm(`Are you sure?`)) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.put(`http://localhost:5000/api/admin/products/${id}/approve`, { isApproved }, config);
                toast.success(isApproved ? 'Product Approved' : 'Product Rejected');
                fetchPendingProducts();
            } catch (error) { toast.error(error.response?.data?.message || 'Error'); }
        }
    };

    const handleEducationApproval = async (id, isApproved) => {
        if (window.confirm(`Are you sure?`)) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.put(`http://localhost:5000/api/admin/education/${id}/approve`, { isApproved }, config);
                toast.success(isApproved ? 'Content Approved' : 'Content Rejected');
                fetchPendingEducation();
            } catch (error) { toast.error(error.response?.data?.message || 'Error'); }
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
                    {['stats', 'users', 'products', 'education', 'categories'].map((tab) => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2 rounded-t-xl font-bold transition-all capitalize ${activeTab === tab ? 'bg-white/70 backdrop-blur-lg text-green-700 border-t border-x border-white/50' : 'bg-green-200/50 text-green-900 hover:bg-green-200'}`}>
                            {tab === 'users' ? 'Proposers' : tab}
                        </button>
                    ))}
                </div>

                <div className="bg-white/70 backdrop-blur-lg border border-white/50 rounded-b-2xl rounded-tr-2xl shadow-2xl p-6 md:p-8">
                    {loading ? <Loader /> : (
                        <>
                            {activeTab === 'stats' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {[
                                        { label: 'Total Users', value: stats.users, icon: 'Users', color: 'blue' },
                                        { label: 'Products', value: stats.products, icon: 'Package', color: 'green' },
                                        { label: 'Total Orders', value: stats.orders, icon: 'ShoppingCart', color: 'purple' },
                                        { label: 'Edu Content', value: stats.education, icon: 'BookOpen', color: 'orange' },
                                    ].map((item, i) => (
                                        <div key={i} className={`bg-white/60 p-6 rounded-2xl shadow-lg border-l-4 border-${item.color}-500 hover:scale-105 transition-transform`}>
                                            <p className="text-gray-500 font-bold uppercase text-xs tracking-wider mb-2">{item.label}</p>
                                            <h3 className={`text-4xl font-black text-${item.color}-600`}>{item.value}</h3>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'categories' && (
                                <div>
                                    <h2 className="text-2xl font-bold text-green-700 mb-6">Manage Categories</h2>
                                    <form onSubmit={handleAddCategory} className="flex gap-4 mb-8">
                                        <input
                                            className="flex-grow px-5 py-3 bg-white/50 border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                                            placeholder="New Category Name"
                                            value={newCategory}
                                            onChange={(e) => setNewCategory(e.target.value)}
                                            required
                                        />
                                        <button className="bg-green-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-green-700 shadow-md">Add</button>
                                    </form>
                                    <div className="space-y-3">
                                        {categories.map(c => (
                                            <div key={c._id} className="flex justify-between items-center bg-white/40 p-4 rounded-xl border border-green-50 shadow-sm hover:bg-white/80 transition-all">
                                                <span className="font-bold text-green-900">{c.name}</span>
                                                <button onClick={() => handleDeleteCategory(c._id)} className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-xs font-black hover:bg-red-200">DELETE</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'users' && (
                                <div>
                                    <h2 className="text-2xl font-bold text-green-700 mb-6">Proposer Approvals ({users.length})</h2>
                                    {users.length === 0 ? <EmptyState message="No pending proposers" /> : (
                                        <table className="w-full text-left">
                                            <tr className="border-b border-green-200">
                                                <th className="p-4">Name</th><th className="p-4">Role</th><th className="p-4 text-center">Actions</th>
                                            </tr>
                                            {users.map(u => (
                                                <tr key={u._id} className="border-b border-green-50 hover:bg-white/30">
                                                    <td className="p-4 font-medium">{u.name} ({u.email})</td>
                                                    <td className="p-4 capitalize text-sm text-gray-600 font-bold">{u.role}</td>
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
                                    {products.length === 0 ? <EmptyState message="No pending products" icon="📦" /> : (
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
                                    {education.length === 0 ? <EmptyState message="No pending content" icon="📚" /> : (
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
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
