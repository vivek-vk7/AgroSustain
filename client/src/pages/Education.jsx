import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Education = () => {
    const [content, setContent] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/education');
                setContent(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchContent();
    }, []);

    return (
        <div className="min-h-screen p-4 md:p-8 relative">
            {/* Global background enabled */}

            <div className="max-w-6xl mx-auto z-10 relative">
                <header className="text-center mb-16 pt-10">
                    <h1 className="text-5xl md:text-6xl font-black text-green-800 tracking-tighter mb-4">Organic Knowledge</h1>
                    <p className="text-xl text-green-700 font-medium max-w-2xl mx-auto">Master the art of sustainable farming with guides from our experts and community. 📚</p>
                </header>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
                    </div>
                ) : content.length === 0 ? (
                    <div className="text-center py-20 bg-white/40 backdrop-blur-sm rounded-3xl border border-white/50">
                        <p className="text-green-800 text-xl font-medium">No articles yet. Check back soon for expert guides!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {content.map((item) => (
                            <div key={item._id} className="bg-white/70 backdrop-blur-lg border border-white/50 rounded-3xl shadow-xl p-6 flex flex-col hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                                <div className="mb-4">
                                    <span className="bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                                        {item.category}
                                    </span>
                                </div>
                                <h2 className="text-2xl font-black text-green-900 mb-3 line-clamp-2 leading-tight">
                                    {item.title}
                                </h2>
                                <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                                    {item.content}
                                </p>
                                <div className="mt-auto pt-6 border-t border-green-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center font-bold text-green-700 text-xs">
                                            {item.user?.name?.[0] || 'A'}
                                        </div>
                                        <span className="text-xs font-bold text-green-800">{item.user?.name || 'Anonymous'}</span>
                                    </div>
                                    <Link
                                        to={`/article/${item._id}`}
                                        className="text-green-600 font-black text-xs hover:text-green-800 transition-colors uppercase tracking-widest"
                                    >
                                        Read More →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Education;
