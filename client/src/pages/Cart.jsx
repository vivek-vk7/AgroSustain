import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import ParticleBackground from '../components/ParticleBackground';

const Cart = () => {
    const { cartItems, addToCart, removeFromCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const checkoutHandler = () => {
        if (user) {
            navigate('/shipping');
        } else {
            navigate('/login?redirect=shipping');
        }
    };

    const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 md:p-8 relative overflow-hidden">
            <ParticleBackground />
            <div className="max-w-6xl mx-auto z-10 relative mt-10">
                <h1 className="text-4xl font-black text-green-800 mb-8 uppercase tracking-tighter">Shopping Bag</h1>

                {cartItems.length === 0 ? (
                    <div className="bg-white/70 backdrop-blur-lg border border-white/50 rounded-3xl p-20 text-center shadow-xl">
                        <p className="text-2xl text-green-800 font-bold mb-6 italic opacity-70">Your bag is empty. 🌱</p>
                        <Link to="/" className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg">Start Shopping</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Items List */}
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => (
                                <div key={item.product} className="bg-white/70 backdrop-blur-md border border-white/50 rounded-3xl p-6 flex items-center gap-6 shadow-sm hover:shadow-xl transition-all group">
                                    <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-2xl border border-green-50 group-hover:scale-105 transition-transform" />
                                    <div className="flex-grow">
                                        <Link to={`/product/${item.product}`} className="text-xl font-black text-green-900 line-clamp-1 hover:text-green-600 transition-colors uppercase tracking-tight">{item.name}</Link>
                                        <p className="text-sm font-bold text-green-700">₹{item.price}</p>
                                    </div>
                                    <div className="flex items-center border border-green-100 bg-white/50 rounded-xl overflow-hidden shadow-inner">
                                        <select
                                            value={item.qty}
                                            onChange={(e) => addToCart({ _id: item.product, ...item }, e.target.value)}
                                            className="px-4 py-2 bg-transparent outline-none font-bold text-green-800 cursor-pointer"
                                        >
                                            {[...Array(item.countInStock).keys()].map((x) => (
                                                <option key={x + 1} value={x + 1}>{x + 1}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.product)}
                                        className="text-red-400 hover:text-red-600 transition-colors p-2"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-2xl h-fit sticky top-10">
                            <h2 className="text-2xl font-black text-green-900 mb-6 uppercase tracking-tight">Order Summary</h2>
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-gray-600 font-bold uppercase text-xs tracking-widest">
                                    <span>Items ({cartItems.reduce((acc, i) => acc + Number(i.qty), 0)})</span>
                                    <span>₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 font-bold uppercase text-xs tracking-widest">
                                    <span>Shipping</span>
                                    <span className="text-green-600">FREE</span>
                                </div>
                                <div className="pt-4 border-t border-green-100 flex justify-between items-center text-3xl font-black text-green-800">
                                    <span>Total</span>
                                    <span>₹{subtotal}</span>
                                </div>
                            </div>
                            <button
                                onClick={checkoutHandler}
                                className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white font-black py-5 rounded-2xl shadow-xl hover:from-green-700 hover:to-green-600 transform hover:-translate-y-1 transition-all tracking-widest"
                            >
                                SECURE CHECKOUT
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
