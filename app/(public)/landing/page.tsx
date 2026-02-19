import Link from 'next/link'
import { Code2, Flame, Target, Trophy, BookOpen, Zap } from 'lucide-react'

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-success-50">
            {/* Navigation */}
            <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <Code2 className="w-8 h-8 text-primary-600" />
                            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-success-600 bg-clip-text text-transparent">
                                PyFluent
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link href="/about" className="text-gray-600 hover:text-gray-900 transition">
                                About
                            </Link>
                            <Link href="/pricing" className="text-gray-600 hover:text-gray-900 transition">
                                Pricing
                            </Link>
                            <Link href="/login" className="text-gray-600 hover:text-gray-900 transition">
                                Login
                            </Link>
                            <Link href="/signup" className="btn btn-primary">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
                        Learn Python Through
                        <span className="block bg-gradient-to-r from-primary-600 to-success-600 bg-clip-text text-transparent">
                            Professional English
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-slide-up">
                        Master Python programming while building your developer English vocabulary.
                        Structured daily missions designed for consistent, practical learning.
                    </p>
                    <div className="flex justify-center space-x-4 animate-slide-up">
                        <Link href="/signup" className="btn btn-primary text-lg px-8 py-3">
                            Start Learning Free
                        </Link>
                        <Link href="/about" className="btn btn-secondary text-lg px-8 py-3">
                            Learn More
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
                    <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200 animate-scale-in">
                        <div className="text-4xl font-bold text-primary-600 mb-2">30 Days</div>
                        <div className="text-gray-600">Structured Curriculum</div>
                    </div>
                    <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200 animate-scale-in">
                        <div className="text-4xl font-bold text-success-600 mb-2">150+</div>
                        <div className="text-gray-600">Vocabulary Words</div>
                    </div>
                    <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200 animate-scale-in">
                        <div className="text-4xl font-bold text-warning-600 mb-2">90+</div>
                        <div className="text-gray-600">Coding Challenges</div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-center mb-12">Why PyFluent?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Target className="w-12 h-12 text-primary-600" />}
                            title="Daily Mission System"
                            description="Structured learning with 10, 20, or 30-minute daily missions. Stay consistent without feeling overwhelmed."
                        />
                        <FeatureCard
                            icon={<BookOpen className="w-12 h-12 text-success-600" />}
                            title="Developer English"
                            description="Learn real programming vocabulary, workplace terms, and professional communication—not random words."
                        />
                        <FeatureCard
                            icon={<Code2 className="w-12 h-12 text-warning-600" />}
                            title="Interactive Coding"
                            description="Practice with fill-in-the-blank, predict output, fix bugs, and MCQ challenges. No sandbox needed."
                        />
                        <FeatureCard
                            icon={<Flame className="w-12 h-12 text-danger-600" />}
                            title="Streak Tracking"
                            description="Build consistency with streak tracking, weekly goals, and streak freeze protection."
                        />
                        <FeatureCard
                            icon={<Trophy className="w-12 h-12 text-primary-600" />}
                            title="Progress Analytics"
                            description="Track your mission completion, quiz accuracy, vocabulary mastery, and skill level growth."
                        />
                        <FeatureCard
                            icon={<Zap className="w-12 h-12 text-success-600" />}
                            title="Fast & Practical"
                            description="Learn Python fundamentals in 30 days with real-world examples and mini projects."
                        />
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-gradient-to-br from-primary-50 to-success-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <StepCard number="1" title="Choose Your Pace" description="Select 10, 20, or 30 minutes per day" />
                        <StepCard number="2" title="Complete Missions" description="Lesson → Vocab → Coding → Quiz → Writing" />
                        <StepCard number="3" title="Build Streaks" description="Stay consistent and track your progress" />
                        <StepCard number="4" title="Master Python" description="Complete 30 days and become proficient" />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-primary-600 to-success-600 py-20">
                <div className="max-w-4xl mx-auto text-center px-4">
                    <h2 className="text-4xl font-bold text-white mb-6">
                        Ready to Start Your Python Journey?
                    </h2>
                    <p className="text-xl text-white/90 mb-8">
                        Join thousands of learners mastering Python through English. Start your first mission today.
                    </p>
                    <Link href="/signup" className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3">
                        Get Started Free
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <Code2 className="w-6 h-6" />
                                <span className="text-xl font-bold">PyFluent</span>
                            </div>
                            <p className="text-gray-400">
                                Learn Python through professional English. Structured, engaging, and practical.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Quick Links</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="/about" className="hover:text-white transition">About</Link></li>
                                <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
                                <li><Link href="/login" className="hover:text-white transition">Login</Link></li>
                                <li><Link href="/signup" className="hover:text-white transition">Sign Up</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Contact</h3>
                            <p className="text-gray-400">
                                Questions? Reach out at<br />
                                <a href="mailto:hello@pyfluent.com" className="text-primary-400 hover:text-primary-300">
                                    hello@pyfluent.com
                                </a>
                            </p>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2024 PyFluent. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
            <div className="mb-4">{icon}</div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    )
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
    return (
        <div className="text-center">
            <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {number}
            </div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    )
}
