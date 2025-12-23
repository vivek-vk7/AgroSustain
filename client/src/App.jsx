import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import ProposerDashboard from './pages/ProposerDashboard';
import UserDashboard from './pages/UserDashboard';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Education from './pages/Education';
import ArticleView from './pages/ArticleView';
import Shipping from './pages/Shipping';
import PlaceOrder from './pages/PlaceOrder';
import OrderView from './pages/OrderView';
import Navbar from './components/Navbar';
import ParticleBackground from './components/ParticleBackground';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 relative overflow-hidden">
            <ParticleBackground />
            <Navbar />
            <div className="pt-24 md:pt-32 relative z-10">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/education" element={<Education />} />
                    <Route path="/article/:id" element={<ArticleView />} />
                    <Route path="/shipping" element={<ProtectedRoute><Shipping /></ProtectedRoute>} />
                    <Route path="/placeorder" element={<ProtectedRoute><PlaceOrder /></ProtectedRoute>} />
                    <Route path="/order/:id" element={<ProtectedRoute><OrderView /></ProtectedRoute>} />

                    {/* Protected Routes */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <UserDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute roles={['admin']}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/proposer/dashboard"
                        element={
                            <ProtectedRoute roles={['farmer', 'expert', 'admin']} requireVerified={true}>
                                <ProposerDashboard />
                            </ProtectedRoute>
                        }
                    />
                    {/* Redirects for legacy paths */}
                    <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
                    <Route path="/proposer" element={<Navigate to="/proposer/dashboard" />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;
