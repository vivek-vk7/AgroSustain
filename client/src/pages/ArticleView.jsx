import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ParticleBackground from '../components/ParticleBackground';

const ArticleView = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/education/${id}`);
                setArticle(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchArticle();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-green-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
        </div>
    );

    if (!article) return (
        <div className="min-h-screen flex items-center justify-center bg-green-50">
            <div className="text-center p-8 bg-white/70 backdrop-blur-md rounded-2xl shadow-xl">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Article Not Found</h2>
                <Link to="/education" className="text-green-600 font-bold hover:underline">Back to Knowledge Hub</Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 md:p-8 relative overflow-hidden">
            <ParticleBackground />

            <div className="max-w-4xl mx-auto z-10 relative pt-10 pb-20">
                <Link to="/education" className="inline-block mb-8 text-green-700 font-bold hover:text-green-500 transition-colors">
                    ← Back to Articles
                </Link>

                <article className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-[2.5rem] shadow-2xl p-8 md:p-16">
                    <header className="mb-12 border-b border-green-100 pb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="bg-green-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg">
                                {article.category}
                            </span>
                            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest border-l border-gray-200 pl-4">
                                {new Date(article.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-green-900 tracking-tighter leading-tight mb-8">
                            {article.title}
                        </h1>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-600 to-green-400 flex items-center justify-center font-black text-white text-xl shadow-lg ring-4 ring-green-100">
                                {article.user?.name?.[0] || 'A'}
                            </div>
                            <div>
                                <p className="text-xs font-black text-green-900 uppercase tracking-widest mb-0.5">Written By</p>
                                <p className="text-lg font-bold text-green-700 leading-none">{article.user?.name}</p>
                            </div>
                        </div>
                    </header>

                    <div className="prose prose-lg prose-green max-w-none">
                        <div className="text-gray-700 leading-relaxed space-y-6 text-xl font-medium whitespace-pre-wrap">
                            {article.content}
                        </div>
                    </div>

                    {article.resourceUrl && (
                        <div className="mt-16 p-8 bg-green-900/10 rounded-3xl border border-green-200/50 backdrop-blur-md">
                            <h3 className="text-lg font-black text-green-900 mb-4 uppercase tracking-widest flex items-center gap-2">
                                <span className="text-2xl">🔗</span> Deep Dive Resources
                            </h3>
                            <a
                                href={article.resourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block bg-white/50 hover:bg-white text-green-700 font-bold py-3 px-6 rounded-2xl border border-green-100 transition-all truncate max-w-full italic"
                            >
                                {article.resourceUrl}
                            </a>
                        </div>
                    )}

                    <footer className="mt-20 pt-10 border-t border-green-100 text-center">
                        <p className="text-gray-500 font-bold text-sm uppercase tracking-widest mb-6">Found this helpful?</p>
                        <div className="flex justify-center gap-6">
                            <button className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-xl hover:bg-green-100 transition-colors shadow-sm">🌱</button>
                            <button className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-xl hover:bg-green-100 transition-colors shadow-sm">♻️</button>
                            <button className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-xl hover:bg-green-100 transition-colors shadow-sm">💚</button>
                        </div>
                    </footer>
                </article>
            </div>
        </div>
    );
};

export default ArticleView;
