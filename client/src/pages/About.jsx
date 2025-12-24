export default function About() {
    return (
        <div className="min-h-screen bg-green-50 px-6 py-12">

            <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8 space-y-10">

                {/* Title */}
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-green-700">
                        About AgroSustain
                    </h1>
                    <p className="text-gray-600 mt-3">
                        Empowering sustainable farming through technology 🌱
                    </p>
                </div>

                {/* Introduction */}
                <section>
                    <h2 className="text-2xl font-semibold text-green-600 mb-3">
                        Who We Are
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                        AgroSustain is a MERN stack based platform designed to promote organic
                        farming practices while connecting verified farmers and agricultural
                        experts with consumers. The platform ensures trust, transparency, and
                        sustainability in agricultural trade.
                    </p>
                </section>

                {/* Problem */}
                <section>
                    <h2 className="text-2xl font-semibold text-green-600 mb-3">
                        Problem Statement
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                        Organic farmers often face challenges such as limited market access,
                        lack of awareness, and consumer trust issues. On the other hand,
                        consumers struggle to find verified organic products and reliable
                        farming knowledge.
                    </p>
                </section>

                {/* Solution */}
                <section>
                    <h2 className="text-2xl font-semibold text-green-600 mb-3">
                        Our Solution
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                        AgroSustain provides a unified platform that offers an organic
                        marketplace, educational resources, and admin-verified user roles.
                        This ensures quality, trust, and sustainable agricultural growth.
                    </p>
                </section>

                {/* Features */}
                <section>
                    <h2 className="text-2xl font-semibold text-green-600 mb-3">
                        Key Features
                    </h2>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li>Verified organic farmers and experts</li>
                        <li>Organic product marketplace</li>
                        <li>Educational content on organic farming</li>
                        <li>Role-based dashboards</li>
                        <li>Secure authentication and authorization</li>
                    </ul>
                </section>

                {/* Mission */}
                <section>
                    <h2 className="text-2xl font-semibold text-green-600 mb-3">
                        Our Mission & Vision
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                        <strong>Mission:</strong> To promote sustainable agriculture by
                        empowering organic farmers and educating consumers.
                    </p>
                    <p className="text-gray-700 leading-relaxed mt-2">
                        <strong>Vision:</strong> To build a trusted digital ecosystem that
                        supports eco-friendly farming and healthy living.
                    </p>
                </section>

                {/* Tech Stack */}
                <section>
                    <h2 className="text-2xl font-semibold text-green-600 mb-3">
                        Technology Stack
                    </h2>
                    <p className="text-gray-700">
                        This platform is built using React, Node.js, Express.js, MongoDB,
                        and Tailwind CSS following modern web development practices.
                    </p>
                </section>

            </div>
        </div>
    );
}
