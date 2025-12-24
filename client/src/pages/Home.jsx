import { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Product from '../components/Product';

const Home = () => {
    const { user } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);

    // Search State
    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState('');
    const [location, setLocation] = useState('');

    const fetchProducts = useCallback(async (searchParams = {}) => {
        setLoading(true);
        try {
            // Construct query string
            const params = new URLSearchParams();
            if (searchParams.keyword) params.append('keyword', searchParams.keyword);
            if (searchParams.category) params.append('category', searchParams.category);
            if (searchParams.location) params.append('location', searchParams.location);

            const { data } = await axios.get(`http://localhost:5000/api/products?${params.toString()}`);
            setProducts(data.filter(p => p.isApproved)); // Ensure we only show approved products
            setLoading(false);
        } catch (error) {
            console.error("Error fetching products", error);
            setLoading(false);
        }
    }, []);

    const fetchCategories = useCallback(async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/admin/categories');
            setCategories(data);
        } catch (error) { console.error(error); }
    }, []);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, [fetchProducts, fetchCategories]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchProducts({ keyword, category, location });
    };

    return (
        <div className="min-h-screen relative">
            {/* Using global ParticleBackground and background from App.jsx */}

            {/* Hero Section */}
            <div className="relative pt-20 pb-12 md:pt-32 md:pb-24 px-4 z-10">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-5xl md:text-7xl font-black text-green-800 tracking-tight mb-6">
                        Agro<span className="text-green-600">Sustain</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-green-700 font-medium max-w-2xl mx-auto mb-10">
                        Connecting passionate farmers, expert advisors, and conscious buyers for a better, greener future. 🌱
                    </p>
                    {/* Search/Filter Bar could go here */}
                    {/* Search/Filter Bar */}
                    <form onSubmit={handleSearch} className="bg-white/90 backdrop-blur-md p-4 rounded-3xl shadow-2xl max-w-4xl mx-auto flex flex-col md:flex-row gap-4 border border-white/50">
                        <input
                            className="flex-grow px-6 py-4 rounded-2xl bg-green-50/50 border border-green-100 focus:ring-4 focus:ring-green-500/10 outline-none transition-all placeholder-green-800/40 text-green-900 font-medium"
                            placeholder="What are you looking for?"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                        <select
                            className="px-6 py-4 rounded-2xl bg-green-50/50 border border-green-100 focus:ring-4 focus:ring-green-500/10 outline-none transition-all text-green-900 font-medium cursor-pointer appearance-none"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                        </select>
                        <input
                            className="px-6 py-4 rounded-2xl bg-green-50/50 border border-green-100 focus:ring-4 focus:ring-green-500/10 outline-none transition-all placeholder-green-800/40 text-green-900 font-medium md:w-48"
                            placeholder="Location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                        <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transition-all active:scale-95">
                            Search
                        </button>
                    </form>
                </div>
            </div>

            {/* Featured Products */}
            <div className="relative px-4 pb-20 z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-10 px-2">
                        <h2 className="text-3xl font-bold text-green-800">Fresh from the Farm</h2>
                        <div className="h-1 flex-grow mx-8 bg-green-200/50 rounded-full hidden md:block"></div>
                        <button className="text-green-700 font-bold hover:text-green-500 transition-colors">See All →</button>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-20 bg-white/40 backdrop-blur-sm rounded-3xl border border-white/50">
                            <p className="text-green-800 text-xl font-medium">No organic products available right now. Check back soon!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {products.map((product) => (
                                <Product key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Why Us? */}
            <div className="relative px-4 py-20 bg-green-900/10 z-10 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    <div className="p-8 bg-white/60 rounded-3xl shadow-lg border border-white/50">
                        <div className="text-4xl mb-4 text-green-600">🌿</div>
                        <h3 className="text-xl font-bold text-green-800 mb-2">100% Organic</h3>
                        <p className="text-gray-600">All products are certified organic and sustainable.</p>
                    </div>
                    <div className="p-8 bg-white/60 rounded-3xl shadow-lg border border-white/50">
                        <div className="text-4xl mb-4 text-green-600">🤝</div>
                        <h3 className="text-xl font-bold text-green-800 mb-2">Direct Trade</h3>
                        <p className="text-gray-600">Supporting local farmers directly without middlemen.</p>
                    </div>
                    <div className="p-8 bg-white/60 rounded-3xl shadow-lg border border-white/50">
                        <div className="text-4xl mb-4 text-green-600">👨‍🔬</div>
                        <h3 className="text-xl font-bold text-green-800 mb-2">Expert-Vetted</h3>
                        <p className="text-gray-600">Agricultural experts verify quality and sustainability.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
