import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import InputField from "../components/InputField";
import SelectField from "../components/SelectField";
import AuthButton from "../components/AuthButton";

export default function Signup() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "user",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");

    const { user, register } = useContext(AuthContext);
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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        const result = await register(formData);

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
                    <h2 className="text-3xl font-bold text-green-800 tracking-tight">
                        Create Account
                    </h2>
                    <p className="text-sm text-green-600 mt-2 font-medium">
                        Join our organic farming community 🌱
                    </p>
                </div>

                {error && <div className="text-red-500 bg-red-100 p-2 rounded mb-4 text-center text-sm">{error}</div>}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    <InputField
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                    />

                    <InputField
                        label="Email Address"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                    />

                    <SelectField
                        label="Signup As"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        options={[
                            { value: "user", label: "User (Buyer)" },
                            { value: "farmer", label: "Organic Farmer" },
                            { value: "expert", label: "Agricultural Expert" }
                        ]}
                    />

                    <InputField
                        label="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a password"
                    />

                    <InputField
                        label="Confirm Password"
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Re-enter password"
                    />

                    <AuthButton text="Signup" />
                </form>

                {/* Footer */}
                <p className="text-center text-sm text-gray-600 mt-6 font-medium">
                    Already have an account?{" "}
                    <Link to="/login" className="text-green-700 font-bold hover:underline hover:text-green-800 transition-colors">
                        Login
                    </Link>
                </p>

            </div>
        </div>
    );
}
