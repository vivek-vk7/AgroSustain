import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import InputField from '../components/InputField';
import AuthButton from '../components/AuthButton';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { user, login } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            const role = user.role;
            if (role === 'admin') {
                navigate('/admin/dashboard');
            } else if (role === 'farmer' || role === 'expert') {
                navigate('/proposer/dashboard');
            } else {
                navigate('/');
            }
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const result = await login(email, password);

        if (result.success) {
            const role = result.user.role;
            if (role === 'admin') {
                navigate('/admin/dashboard');
            } else if (role === 'farmer' || role === 'expert') {
                navigate('/proposer/dashboard');
            } else {
                navigate('/');
            }
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative">
            {/* Global background enabled */}

            {/* Glass Card */}
            <div className="w-full max-w-md bg-white/70 backdrop-blur-lg border border-white/50 rounded-2xl shadow-2xl p-8 z-10 relative">

                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-green-800 tracking-tight">Login to AgroSustain</h2>
                    <p className="text-sm text-green-600 mt-2 font-medium">Welcome back! 👋</p>
                </div>

                {error && <div className="text-red-500 bg-red-100 p-2 rounded mb-4 text-center text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <InputField
                        label="Email Address"
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                    />

                    <InputField
                        label="Password"
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                    />

                    <AuthButton text="Login" />
                </form>

                <p className="text-center text-sm text-gray-600 mt-6 font-medium">
                    New Customer? <Link to="/signup" className="text-green-700 font-bold hover:underline hover:text-green-800 transition-colors">Signup</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
