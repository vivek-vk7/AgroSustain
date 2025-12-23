import { Link } from 'react-router-dom';

const Product = ({ product }) => {
    return (
        <div className="bg-white/70 backdrop-blur-md border border-white/50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden h-full flex flex-col">
            <Link to={`/product/${product._id}`} className="block overflow-hidden relative h-48">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-green-600/90 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                    {product.category}
                </div>
            </Link>

            <div className="p-5 flex flex-col flex-grow">
                <Link to={`/product/${product._id}`}>
                    <h3 className="text-xl font-bold text-green-800 mb-2 hover:text-green-600 transition-colors line-clamp-1">
                        {product.name}
                    </h3>
                </Link>

                <div className="flex items-center gap-1 mb-3 text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < Math.floor(product.rating || 0) ? 'fill-current' : 'text-gray-300'}>
                            ★
                        </span>
                    ))}
                    <span className="text-xs text-gray-500 ml-1">({product.numReviews || 0})</span>
                </div>

                <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-grow">
                    {product.description}
                </p>

                <div className="flex items-center justify-between mt-auto">
                    <span className="text-2xl font-black text-green-700">${product.price}</span>
                    <Link
                        to={`/product/${product._id}`}
                        className="bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors shadow-md"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Product;
