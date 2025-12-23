import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import ParticleBackground from '../components/ParticleBackground';

const Shipping = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login?redirect=shipping');
        }
    }, [user, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        localStorage.setItem('shippingAddress', JSON.stringify({ address, city, postalCode, country }));
        navigate('/placeorder');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 md:p-8 relative overflow-hidden">
            <ParticleBackground />
            <div className="max-w-xl mx-auto z-10 relative mt-16">
                <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-[2.5rem] shadow-2xl p-8 md:p-12">
                    <h1 className="text-3xl font-black text-green-900 mb-8 uppercase tracking-tighter text-center">Shipping Details</h1>

                    <form onSubmit={submitHandler} className="space-y-6">
                        <div>
                            <label className="block text-xs font-black text-green-700 uppercase tracking-[0.2em] mb-2 ml-1">Address</label>
                            <input
                                className="w-full px-5 py-4 bg-white/50 border border-green-100 rounded-2xl focus:ring-4 focus:ring-green-500/10 outline-none transition-all placeholder-green-900/20 font-bold text-green-900"
                                type="text"
                                placeholder="Street Address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-black text-green-700 uppercase tracking-[0.2em] mb-2 ml-1">City</label>
                                <input
                                    className="w-full px-5 py-4 bg-white/50 border border-green-100 rounded-2xl focus:ring-4 focus:ring-green-500/10 outline-none transition-all placeholder-green-900/20 font-bold text-green-900"
                                    type="text"
                                    placeholder="City"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-green-700 uppercase tracking-[0.2em] mb-2 ml-1">Postal Code</label>
                                <input
                                    className="w-full px-5 py-4 bg-white/50 border border-green-100 rounded-2xl focus:ring-4 focus:ring-green-500/10 outline-none transition-all placeholder-green-900/20 font-bold text-green-900"
                                    type="text"
                                    placeholder="Code"
                                    value={postalCode}
                                    onChange={(e) => setPostalCode(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-black text-green-700 uppercase tracking-[0.2em] mb-2 ml-1">Country</label>
                            <input
                                className="w-full px-5 py-4 bg-white/50 border border-green-100 rounded-2xl focus:ring-4 focus:ring-green-500/10 outline-none transition-all placeholder-green-900/20 font-bold text-green-900"
                                type="text"
                                placeholder="Country"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-green-700 transform hover:-translate-y-1 transition-all tracking-widest mt-4"
                        >
                            CONTINUE TO ORDER SUMMARY
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Shipping;
