import Link from 'next/link'
import { Code2, Target, Users, Zap } from 'lucide-react'

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="border-b sticky top-0 bg-white z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/landing" className="flex items-center space-x-2">
                            <Code2 className="w-8 h-8 text-primary-600" />
                            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-success-600 bg-clip-text text-transparent">
                                PyFluent
                            </span>
                        </Link>
                        <div className="flex items-center space-x-4">
                            <Link href="/landing" className="text-gray-600 hover:text-gray-900 transition">
                                Home
                            </Link>
                            <Link href="/pricing" className="text-gray-600 hover:text-gray-900 transition">
                                Pricing
                            </Link>
                            <Link href="/login" className="btn btn-primary">
                                Login
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="bg-gradient-to-br from-primary-50 to-success-50 py-20">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h1 className="text-5xl font-bold mb-6">About PyFluent</h1>
                    <p className="text-xl text-gray-600">
                        We believe learning Python should be structured, engaging, and practical—not overwhelming.
                    </p>
                </div>
            </section>

            {/* Mission */}
            <section className="max-w-4xl mx-auto px-4 py-20">
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <p className="text-lg text-gray-700 mb-4">
                    PyFluent was created to solve a common problem: learning Python while improving English can feel scattered and inconsistent. Most resources teach either programming OR language—rarely both in a structured way.
                </p>
                <p className="text-lg text-gray-700 mb-4">
                    We designed PyFluent to be different. Our daily mission system ensures you learn Python fundamentals while building real developer English vocabulary—the kind you'll actually use in the workplace.
                </p>
                <p className="text-lg text-gray-700">
                    Whether you have 10, 20, or 30 minutes a day, PyFluent adapts to your schedule and keeps you on track with streak tracking and progress analytics.
                </p>
            </section>

            {/* Values */}
            <section className="bg-gray-50 py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">What We Stand For</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <ValueCard
                            icon={<Target className="w-10 h-10 text-primary-600" />}
                            title="Structured"
                            description="30-day curriculum with clear progression from basics to projects"
                        />
                        <ValueCard
                            icon={<Zap className="w-10 h-10 text-success-600" />}
                            title="Practical"
                            description="Real developer English and coding patterns you'll use in your career"
                        />
                        <ValueCard
                            icon={<Users className="w-10 h-10 text-warning-600" />}
                            title="Consistent"
                            description="Daily missions and streak tracking to build lasting habits"
                        />
                        <ValueCard
                            icon={<Code2 className="w-10 h-10 text-danger-600" />}
                            title="Engaging"
                            description="Interactive tasks, quizzes, and projects—not passive videos"
                        />
                    </div>
                </div>
            </section>

            {/* Curriculum */}
            <section className="max-w-4xl mx-auto px-4 py-20">
                <h2 className="text-3xl font-bold mb-6">30-Day Curriculum</h2>
                <div className="space-y-6">
                    <WeekCard
                        week="Week 1"
                        title="Python Basics"
                        topics={['print & basics', 'variables & types', 'input/output', 'operators', 'if/else', 'logical operators', 'mini project: calculator']}
                    />
                    <WeekCard
                        week="Week 2"
                        title="Loops & Strings"
                        topics={['while loop', 'for loop', 'range', 'break/continue', 'strings basics', 'string methods', 'mini project: guess game']}
                    />
                    <WeekCard
                        week="Week 3"
                        title="Data Structures"
                        topics={['lists', 'list methods', 'tuples', 'dictionaries', 'dict methods', 'sets', 'mini project: to-do list']}
                    />
                    <WeekCard
                        week="Week 4"
                        title="Functions & OOP"
                        topics={['functions', 'parameters & return', 'scope', 'error handling', 'file I/O', 'OOP basics', 'classes & methods', 'revision', 'final project: quiz app']}
                    />
                </div>
            </section>

            {/* CTA */}
            <section className="bg-gradient-to-r from-primary-600 to-success-600 py-20">
                <div className="max-w-4xl mx-auto text-center px-4">
                    <h2 className="text-4xl font-bold text-white mb-6">
                        Ready to Start?
                    </h2>
                    <p className="text-xl text-white/90 mb-8">
                        Join PyFluent today and complete your first mission in under 20 minutes.
                    </p>
                    <Link href="/signup" className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3">
                        Get Started Free
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8">
                <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
                    <p>&copy; 2024 PyFluent. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}

function ValueCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-center mb-4">{icon}</div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    )
}

function WeekCard({ week, title, topics }: { week: string; title: string; topics: string[] }) {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center space-x-4 mb-4">
                <span className="text-sm font-semibold text-primary-600 bg-primary-100 px-3 py-1 rounded-full">
                    {week}
                </span>
                <h3 className="text-2xl font-bold">{title}</h3>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {topics.map((topic, index) => (
                    <li key={index} className="flex items-center space-x-2 text-gray-700">
                        <span className="text-success-600">✓</span>
                        <span>{topic}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}
