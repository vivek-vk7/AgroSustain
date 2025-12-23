import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const ProposerDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('inventory'); // 'inventory', 'orders', 'add-product', 'my-education', 'add-education'
    const [myProducts, setMyProducts] = useState([]);
    const [receivedOrders, setReceivedOrders] = useState([]);
    const [myEducation, setMyEducation] = useState([]);
    const [loading, setLoading] = useState(false);

    const [productData, setProductData] = useState({ name: '', price: 0, image: '', category: '', countInStock: 0, description: '' });
    const [educationData, setEducationData] = useState({ title: '', content: '', category: '', resourceUrl: '' });
    const [message, setMessage] = useState('');

    useEffect(() => {
        if ((user?.role === 'farmer' || user?.role === 'expert' || user?.role === 'admin') && user.proposerStatus === 'approved') {
            if (activeTab === 'inventory') fetchMyProducts();
            if (activeTab === 'orders') fetchReceivedOrders();
            if (activeTab === 'my-education') fetchMyEducation();
        }
    }, [user, activeTab]);

    const fetchMyProducts = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/products/myproducts', config);
            setMyProducts(data);
        } catch (error) { console.error(error); }
        setLoading(false);
    };

    const fetchReceivedOrders = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/orders/proposer', config);
            setReceivedOrders(data);
        } catch (error) { console.error(error); }
        setLoading(false);
    };

    const fetchMyEducation = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/education/mycontent', config);
            setMyEducation(data);
        } catch (error) { console.error(error); }
        setLoading(false);
    };

    const handleDeliverOrder = async (id) => {
        if (window.confirm('Mark this order as delivered?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.put(`http://localhost:5000/api/orders/${id}/deliver`, {}, config);
                fetchReceivedOrders();
            } catch (error) { alert(error.response?.data?.message || 'Error updating order'); }
        }
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('http://localhost:5000/api/products', productData, config);
            setMessage('Product Submitted! Waiting for approval.');
            setProductData({ name: '', price: 0, image: '', category: '', countInStock: 0, description: '' });
            setActiveTab('inventory');
        } catch (error) { setMessage(error.response?.data?.message || 'Error'); }
    };

    const handleEducationSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('http://localhost:5000/api/education', educationData, config);
            setMessage('Content Submitted! Waiting for approval.');
            setEducationData({ title: '', content: '', category: '', resourceUrl: '' });
            setActiveTab('my-education');
        } catch (error) { setMessage(error.response?.data?.message || 'Error'); }
    };


    return (
        <div className="min-h-screen p-4 md:p-8 relative">
            {/* Global background enabled */}
            <div className="max-w-6xl mx-auto z-10 relative">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <h1 className="text-4xl font-black text-green-800 tracking-tighter">Proposer Dashboard</h1>
                    <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 px-8 rounded-xl transition-all shadow-lg">Logout</button>
                </div>

                {/* Sub Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {['inventory', 'orders', 'add-product', 'my-education', 'add-education'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => { setActiveTab(tab); setMessage(''); }}
                            className={`px-5 py-2.5 rounded-t-2xl font-black text-xs uppercase transition-all tracking-wider ${activeTab === tab ? 'bg-white/70 backdrop-blur-lg border-t border-x border-white/50 text-green-700' : 'bg-green-200/40 text-green-900/60 hover:bg-green-200/80 hover:text-green-900'}`}
                        >
                            {tab.replace('-', ' ')}
                        </button>
                    ))}
                </div>

                <div className="bg-white/70 backdrop-blur-lg border border-white/50 rounded-b-3xl rounded-tr-3xl shadow-2xl p-6 md:p-10">
                    {message && <div className="p-4 rounded-2xl mb-8 text-center font-bold bg-green-100 text-green-700 border border-green-200 shadow-sm animate-pulse">{message}</div>}

                    {activeTab === 'add-product' && (
                        <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <input className="w-full px-5 py-3.5 bg-white/50 border border-green-100 rounded-2xl focus:ring-4 focus:ring-green-500/10 outline-none transition-all placeholder-green-900/30" placeholder="Product Name" onChange={e => setProductData({ ...productData, name: e.target.value })} value={productData.name} required />
                                <input className="w-full px-5 py-3.5 bg-white/50 border border-green-100 rounded-2xl focus:ring-4 focus:ring-green-500/10 outline-none transition-all placeholder-green-900/30" placeholder="Category" onChange={e => setProductData({ ...productData, category: e.target.value })} value={productData.category} required />
                                <div className="flex gap-4">
                                    <input className="w-1/2 px-5 py-3.5 bg-white/50 border border-green-100 rounded-2xl focus:ring-4 focus:ring-green-500/10 outline-none transition-all placeholder-green-900/30" placeholder="Price ($)" type="number" onChange={e => setProductData({ ...productData, price: e.target.value })} value={productData.price} required />
                                    <input className="w-1/2 px-5 py-3.5 bg-white/50 border border-green-100 rounded-2xl focus:ring-4 focus:ring-green-500/10 outline-none transition-all placeholder-green-900/30" placeholder="Stock" type="number" onChange={e => setProductData({ ...productData, countInStock: e.target.value })} value={productData.countInStock} required />
                                </div>
                            </div>
                            <div className="space-y-6">
                                <input className="w-full px-5 py-3.5 bg-white/50 border border-green-100 rounded-2xl focus:ring-4 focus:ring-green-500/10 outline-none transition-all placeholder-green-900/30" placeholder="Image URL" onChange={e => setProductData({ ...productData, image: e.target.value })} value={productData.image} required />
                                <textarea className="w-full px-5 py-3.5 bg-white/50 border border-green-100 rounded-2xl focus:ring-4 focus:ring-green-500/10 outline-none transition-all placeholder-green-900/30 h-32" placeholder="Description" onChange={e => setProductData({ ...productData, description: e.target.value })} value={productData.description} required />
                            </div>
                            <button className="md:col-span-2 bg-green-600 text-white font-black py-4 rounded-2xl hover:bg-green-700 shadow-xl tracking-widest transition-all active:scale-[0.98]">LIST FOR APPROVAL</button>
                        </form>
                    )}

                    {activeTab === 'inventory' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {myProducts.length === 0 ? <p className="col-span-2 text-center py-10 italic opacity-50">Empty inventory.</p> : myProducts.map(p => (
                                <div key={p._id} className="bg-white/40 border border-white/60 rounded-3xl p-5 flex gap-5 group hover:bg-white/80 transition-all shadow-sm hover:shadow-xl">
                                    <img src={p.image} className="w-24 h-24 object-cover rounded-2xl shadow-md border border-green-100 group-hover:scale-105 transition-transform" />
                                    <div className="flex-grow">
                                        <h3 className="font-black text-green-900 text-lg">{p.name}</h3>
                                        <p className="text-xs font-bold text-green-600 mb-3">${p.price} | {p.category}</p>
                                        <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${p.isApproved ? 'bg-green-50 border-green-200 text-green-700' : 'bg-yellow-50 border-yellow-200 text-yellow-700 uppercase pulse'}`}>
                                            {p.isApproved ? 'Approved' : 'Awaiting Review'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div className="space-y-4">
                            {receivedOrders.length === 0 ? <p className="text-center py-10 italic opacity-50">No orders received yet.</p> : receivedOrders.map(o => (
                                <div key={o._id} className="bg-white/40 border border-white/60 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-center hover:bg-white/80 transition-all shadow-sm gap-6">
                                    <div className="flex-grow">
                                        <h3 className="font-black text-green-900 text-lg mb-1 leading-none uppercase tracking-tighter">Order #{o._id.slice(-6)}</h3>
                                        <p className="text-xs font-bold text-gray-400 mb-4">{new Date(o.createdAt).toLocaleDateString()} | Buyer: {o.user?.name}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {o.orderItems.map((item, i) => (
                                                <span key={i} className="text-[10px] font-bold bg-green-50 text-green-700 px-2 py-1 rounded-lg border border-green-100">{item.qty}x {item.name}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-center">
                                        <div className="text-right mr-4">
                                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total</p>
                                            <p className="text-2xl font-black text-green-800">${o.totalPrice}</p>
                                        </div>
                                        {!o.isDelivered ? (
                                            <button
                                                onClick={() => handleDeliverOrder(o._id)}
                                                className="bg-green-600 text-white font-black px-6 py-3 rounded-2xl text-xs uppercase tracking-widest hover:bg-green-700 shadow-lg active:scale-95 transition-all"
                                            >
                                                Ship Order
                                            </button>
                                        ) : (
                                            <span className="bg-emerald-50 text-emerald-700 font-black px-6 py-3 rounded-2xl text-xs border border-emerald-100">
                                                SHIPPED
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'add-education' && (
                        <form onSubmit={handleEducationSubmit} className="space-y-6 max-w-3xl mx-auto">
                            <input className="w-full px-5 py-3.5 bg-white/50 border border-green-100 rounded-2xl focus:ring-4 focus:ring-green-500/10 outline-none transition-all placeholder-green-900/30" placeholder="Article Title" onChange={e => setEducationData({ ...educationData, title: e.target.value })} value={educationData.title} required />
                            <input className="w-full px-5 py-3.5 bg-white/50 border border-green-100 rounded-2xl focus:ring-4 focus:ring-green-500/10 outline-none transition-all placeholder-green-900/30" placeholder="Category (e.g. Organic Pests, Soil Health)" onChange={e => setEducationData({ ...educationData, category: e.target.value })} value={educationData.category} required />
                            <input className="w-full px-5 py-3.5 bg-white/50 border border-green-100 rounded-2xl focus:ring-4 focus:ring-green-500/10 outline-none transition-all placeholder-green-900/30" placeholder="External Resource URL (optional)" onChange={e => setEducationData({ ...educationData, resourceUrl: e.target.value })} value={educationData.resourceUrl} />
                            <textarea className="w-full px-5 py-3.5 bg-white/50 border border-green-100 rounded-2xl focus:ring-4 focus:ring-green-500/10 outline-none transition-all placeholder-green-900/30 h-48" placeholder="Educational Content / Article Body" onChange={e => setEducationData({ ...educationData, content: e.target.value })} value={educationData.content} required />
                            <button className="w-full bg-green-600 text-white font-black py-4 rounded-2xl hover:bg-green-700 shadow-xl tracking-widest transition-all">PUBLISH CONTENT</button>
                        </form>
                    )}

                    {activeTab === 'my-education' && (
                        <div className="space-y-4">
                            {myEducation.length === 0 ? <p className="text-center py-10 italic opacity-50">No content published.</p> : myEducation.map(e => (
                                <div key={e._id} className="bg-white/40 border border-white/60 rounded-3xl p-6 flex justify-between items-center hover:bg-white/80 transition-all shadow-sm">
                                    <div>
                                        <h3 className="font-black text-green-900 text-xl mb-1">{e.title}</h3>
                                        <p className="text-xs font-bold text-green-600 mb-2 uppercase tracking-tighter">{e.category}</p>
                                        <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${e.isApproved ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-orange-50 border-orange-200 text-orange-700 pulse'}`}>
                                            {e.isApproved ? 'LIVE' : 'VERIFYING'}
                                        </span>
                                    </div>
                                    <div className="text-right text-[10px] text-gray-400 font-bold uppercase">
                                        {new Date(e.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProposerDashboard;
