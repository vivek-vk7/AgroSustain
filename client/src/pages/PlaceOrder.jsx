import { useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import ParticleBackground from '../components/ParticleBackground';

const PlaceOrder = () => {
    const navigate = useNavigate();
    const { cartItems, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);

    const shippingAddress = JSON.parse(localStorage.getItem('shippingAddress') || '{}');
    const paymentMethod = 'Stripe/Card'; // Default

    const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
    const totalPrice = (Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice)).toFixed(2);

    useEffect(() => {
        if (!shippingAddress.address) {
            navigate('/shipping');
        }
    }, [navigate, shippingAddress.address]);

    const placeOrderHandler = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.post(
                'http://localhost:5000/api/orders',
                {
                    orderItems: cartItems,
                    shippingAddress,
                    paymentMethod,
                    itemsPrice,
                    shippingPrice,
                    taxPrice,
                    totalPrice,
                },
                config
            );

            clearCart();
            navigate(`/order/${data._id}`);
        } catch (error) {
            alert(error.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 md:p-8 relative overflow-hidden">
            <ParticleBackground />
            <div className="max-w-6xl mx-auto z-10 relative mt-16">
                <h1 className="text-4xl font-black text-green-900 mb-8 uppercase tracking-tighter">Review Your Order</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Shipping */}
                        <div className="bg-white/70 backdrop-blur-md border border-white/50 rounded-3xl p-8 shadow-sm">
                            <h2 className="text-xl font-black text-green-800 mb-4 uppercase tracking-wider">Destination</h2>
                            <p className="text-gray-600 font-bold text-lg leading-snug">
                                {shippingAddress.address}, {shippingAddress.city}<br />
                                {shippingAddress.postalCode}, {shippingAddress.country}
                            </p>
                        </div>

                        {/* Items */}
                        <div className="bg-white/70 backdrop-blur-md border border-white/50 rounded-3xl p-8 shadow-sm">
                            <h2 className="text-xl font-black text-green-800 mb-6 uppercase tracking-wider">Organic Goods</h2>
                            <div className="space-y-4">
                                {cartItems.map((item, index) => (
                                    <div key={index} className="flex items-center gap-6 border-b border-green-50 pb-4">
                                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl shadow-sm" />
                                        <div className="flex-grow">
                                            <p className="font-bold text-green-900">{item.name}</p>
                                            <p className="text-xs font-bold text-green-600 italic">{item.qty} x ₹{item.price} = ₹{item.qty * item.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Final Payment Summary */}
                    <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-2xl h-fit sticky top-10">
                        <h2 className="text-2xl font-black text-green-900 mb-8 uppercase tracking-tight text-center">Checkout</h2>
                        <div className="space-y-5 mb-10">
                            <div className="flex justify-between font-bold text-xs uppercase tracking-[0.2em] text-gray-500">
                                <span>Subtotal</span>
                                <span>₹{itemsPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-xs uppercase tracking-[0.2em] text-gray-500">
                                <span>Shipping Fees</span>
                                <span>₹{shippingPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-xs uppercase tracking-[0.2em] text-gray-500">
                                <span>Eco Tax (15%)</span>
                                <span>₹{taxPrice}</span>
                            </div>
                            <div className="pt-6 border-t border-green-100 flex justify-between items-center text-4xl font-black text-green-800">
                                <span className="text-sm uppercase italic opacity-50">Total</span>
                                <span>₹{totalPrice}</span>
                            </div>
                        </div>
                        <button
                            onClick={placeOrderHandler}
                            className="w-full bg-green-600 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-green-700 transform hover:-translate-y-1 transition-all tracking-[0.2em] text-sm"
                        >
                            CONFIRM AND PAY
                        </button>
                        <p className="text-[10px] text-center text-gray-400 font-bold uppercase mt-4 tracking-widest px-4">
                            By clicking confirm, you agree to our sustainable sourcing terms.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaceOrder;
