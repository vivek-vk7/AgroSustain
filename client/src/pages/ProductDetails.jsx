import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CartContext from '../context/CartContext';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
                setProduct(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching product details", error);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-green-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-green-50">
                <div className="text-center p-8 bg-white/70 backdrop-blur-md rounded-2xl shadow-xl">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Product Not Found</h2>
                    <Link to="/" className="text-green-600 font-bold hover:underline">Back to Shop</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative p-4 md:p-8">
            {/* Global background enabled */}

            <div className="max-w-6xl mx-auto z-10 relative mt-10">
                <Link to="/" className="inline-block mb-6 text-green-700 font-bold hover:text-green-500 transition-colors">
                    ← Back to Products
                </Link>

                <div className="bg-white/70 backdrop-blur-lg border border-white/50 rounded-3xl shadow-2xl overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                        {/* Product Image */}
                        <div className="md:w-1/2 h-[400px] md:h-auto relative overflow-hidden">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-4 left-4 bg-green-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                                {product.category}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="md:w-1/2 p-8 md:p-12">
                            <h1 className="text-4xl font-black text-green-800 mb-4 leading-tight">{product.name}</h1>

                            <div className="flex items-center gap-2 mb-6">
                                <div className="flex text-yellow-500 text-lg">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className={i < Math.floor(product.rating || 0) ? 'fill-current' : 'text-gray-300'}>
                                            ★
                                        </span>
                                    ))}
                                </div>
                                <span className="text-gray-600 text-sm font-medium">({product.numReviews || 0} customer reviews)</span>
                            </div>

                            <p className="text-3xl font-black text-green-700 mb-8">${product.price}</p>

                            <div className="bg-green-100/50 p-6 rounded-2xl mb-8 border border-green-200/50 text-gray-700 leading-relaxed text-lg">
                                {product.description}
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center gap-6">
                                    <span className="font-bold text-green-900">Stock:</span>
                                    <span className={`font-bold px-3 py-1 rounded-full text-sm ${product.countInStock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {product.countInStock > 0 ? `${product.countInStock} available` : 'Out of Stock'}
                                    </span>
                                </div>

                                {product.countInStock > 0 && (
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center border-2 border-green-200 rounded-xl bg-white overflow-hidden shadow-sm">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="px-4 py-2 hover:bg-green-50 text-green-700 font-bold transition-colors"
                                            >
                                                -
                                            </button>
                                            <span className="px-6 py-2 font-bold text-gray-800">{quantity}</span>
                                            <button
                                                onClick={() => setQuantity(Math.min(product.countInStock, quantity + 1))}
                                                className="px-4 py-2 hover:bg-green-50 text-green-700 font-bold transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => {
                                                addToCart(product, quantity);
                                                navigate('/cart');
                                            }}
                                            className="flex-grow bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold py-4 rounded-xl shadow-xl transform hover:-translate-y-1 transition-all"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
