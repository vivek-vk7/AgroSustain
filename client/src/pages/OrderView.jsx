import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import ParticleBackground from '../components/ParticleBackground';

const OrderView = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(`http://localhost:5000/api/orders/${id}`, config);
                setOrder(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        if (user) fetchOrder();
    }, [id, user]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-green-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
        </div>
    );

    if (!order) return <div className="text-center p-20 font-black text-red-500">Order not found.</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 md:p-8 relative overflow-hidden">
            <ParticleBackground />
            <div className="max-w-4xl mx-auto z-10 relative mt-16">
                <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-[3rem] shadow-2xl overflow-hidden mb-10">
                    <div className="bg-green-600 p-10 text-white text-center">
                        <p className="text-xs font-black uppercase tracking-[0.3em] opacity-80 mb-2">Order Confirmed</p>
                        <h1 className="text-3xl md:text-4xl font-black truncate">{id}</h1>
                    </div>

                    <div className="p-8 md:p-12 space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div>
                                <h3 className="text-xs font-black text-green-700 uppercase tracking-widest mb-4">Customer Details</h3>
                                <p className="font-bold text-green-900 border-l-4 border-green-200 pl-4">
                                    {order.user?.name}<br />
                                    <span className="text-gray-400 text-sm font-medium italic">{order.user?.email}</span>
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xs font-black text-green-700 uppercase tracking-widest mb-4">Shipping To</h3>
                                <p className="font-bold text-green-900 border-l-4 border-green-200 pl-4">
                                    {order.shippingAddress.address}, {order.shippingAddress.city}<br />
                                    {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-green-700 uppercase tracking-widest">Order Status</h3>
                            <div className="flex gap-4">
                                <div className={`flex-grow p-4 rounded-2xl border ${order.isPaid ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'} font-black text-sm uppercase tracking-wider text-center`}>
                                    {order.isPaid ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}` : 'Payment Pending'}
                                </div>
                                <div className={`flex-grow p-4 rounded-2xl border ${order.isDelivered ? 'bg-green-50 border-green-200 text-green-700' : 'bg-orange-50 border-orange-200 text-orange-700'} font-black text-sm uppercase tracking-wider text-center`}>
                                    {order.isDelivered ? 'Successfully Delivered' : 'Processing Shipment'}
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-black text-green-700 uppercase tracking-widest mb-6">Order Items</h3>
                            <div className="space-y-4">
                                {order.orderItems.map((item, index) => (
                                    <div key={index} className="flex items-center gap-6 bg-white/40 p-4 rounded-2xl border border-white/50">
                                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl shadow-sm" />
                                        <div className="flex-grow">
                                            <p className="font-bold text-green-900 uppercase tracking-tight">{item.name}</p>
                                            <p className="text-xs font-bold text-green-500">{item.qty} x ${item.price}</p>
                                        </div>
                                        <p className="font-black text-green-800">${item.qty * item.price}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-10 border-t border-green-100 flex justify-between items-end">
                            <Link to="/dashboard" className="text-green-600 font-black text-xs uppercase hover:underline">Track in Dashboard</Link>
                            <div className="text-right">
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Paid</p>
                                <p className="text-4xl font-black text-green-800">${order.totalPrice}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderView;
