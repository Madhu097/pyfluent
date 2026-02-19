import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/lib/auth-context'
import TopLoader from '@/components/TopLoader'
import PageTransition from '@/components/PageTransition'

export const metadata: Metadata = {
    title: 'PyFluent - Learn Python Through English',
    description: 'Master Python programming while improving your English with our structured daily mission system',
    keywords: 'Python, English, Learning, Programming, Developer English',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                {/* Preconnect to Google Fonts for faster load */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            </head>
            <body>
                <AuthProvider>
                    {/* Top progress bar — instant navigation feedback */}
                    <TopLoader />
                    {/* Smooth page fade-in on every route change */}
                    <PageTransition>
                        {children}
                    </PageTransition>
                </AuthProvider>
            </body>
        </html>
    )
}
