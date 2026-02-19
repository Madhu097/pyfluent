import Link from 'next/link'
import { Code2, Check } from 'lucide-react'

export default function PricingPage() {
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
                            <Link href="/about" className="text-gray-600 hover:text-gray-900 transition">
                                About
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
                    <h1 className="text-5xl font-bold mb-6">Simple, Transparent Pricing</h1>
                    <p className="text-xl text-gray-600">
                        Start learning Python through English today. No hidden fees.
                    </p>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="max-w-7xl mx-auto px-4 py-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Free Plan */}
                    <div className="border border-gray-200 rounded-2xl p-8 bg-white shadow-sm">
                        <h3 className="text-2xl font-bold mb-2">Free</h3>
                        <div className="mb-6">
                            <span className="text-5xl font-bold">$0</span>
                            <span className="text-gray-600">/month</span>
                        </div>
                        <ul className="space-y-4 mb-8">
                            <Feature text="Access to first 7 days" />
                            <Feature text="All mission types" />
                            <Feature text="Progress tracking" />
                            <Feature text="Streak tracking" />
                            <Feature text="Basic analytics" />
                        </ul>
                        <Link href="/signup" className="btn btn-secondary w-full">
                            Get Started
                        </Link>
                    </div>

                    {/* Pro Plan */}
                    <div className="border-2 border-primary-600 rounded-2xl p-8 bg-gradient-to-br from-primary-50 to-white shadow-lg relative">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                            Most Popular
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Pro</h3>
                        <div className="mb-6">
                            <span className="text-5xl font-bold">$9</span>
                            <span className="text-gray-600">/month</span>
                        </div>
                        <ul className="space-y-4 mb-8">
                            <Feature text="Full 30-day curriculum" />
                            <Feature text="All mission types" />
                            <Feature text="Advanced analytics" />
                            <Feature text="Streak freezes" />
                            <Feature text="Downloadable certificates" />
                            <Feature text="Priority support" />
                        </ul>
                        <Link href="/signup" className="btn btn-primary w-full">
                            Start Pro Trial
                        </Link>
                    </div>

                    {/* Lifetime Plan */}
                    <div className="border border-gray-200 rounded-2xl p-8 bg-white shadow-sm">
                        <h3 className="text-2xl font-bold mb-2">Lifetime</h3>
                        <div className="mb-6">
                            <span className="text-5xl font-bold">$49</span>
                            <span className="text-gray-600">/one-time</span>
                        </div>
                        <ul className="space-y-4 mb-8">
                            <Feature text="Everything in Pro" />
                            <Feature text="Lifetime access" />
                            <Feature text="Future curriculum updates" />
                            <Feature text="Exclusive community" />
                            <Feature text="Early access to features" />
                        </ul>
                        <Link href="/signup" className="btn btn-success w-full">
                            Get Lifetime Access
                        </Link>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="bg-gray-50 py-20">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                        <FAQItem
                            question="Can I try before I buy?"
                            answer="Yes! The free plan gives you access to the first 7 days of content so you can experience the full PyFluent learning system."
                        />
                        <FAQItem
                            question="What happens after 30 days?"
                            answer="After completing the 30-day curriculum, you'll have mastered Python fundamentals. We're working on advanced courses that will be available to Pro and Lifetime members."
                        />
                        <FAQItem
                            question="Can I cancel anytime?"
                            answer="Yes, you can cancel your Pro subscription at any time. You'll retain access until the end of your billing period."
                        />
                        <FAQItem
                            question="Is there a refund policy?"
                            answer="We offer a 14-day money-back guarantee for all paid plans. If you're not satisfied, contact us for a full refund."
                        />
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-gradient-to-r from-primary-600 to-success-600 py-20">
                <div className="max-w-4xl mx-auto text-center px-4">
                    <h2 className="text-4xl font-bold text-white mb-6">
                        Start Your Python Journey Today
                    </h2>
                    <p className="text-xl text-white/90 mb-8">
                        Join thousands of learners mastering Python through English.
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

function Feature({ text }: { text: string }) {
    return (
        <li className="flex items-center space-x-2">
            <Check className="w-5 h-5 text-success-600 flex-shrink-0" />
            <span className="text-gray-700">{text}</span>
        </li>
    )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
    return (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-xl font-semibold mb-2">{question}</h3>
            <p className="text-gray-600">{answer}</p>
        </div>
    )
}
