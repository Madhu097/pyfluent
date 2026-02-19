'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase'
import { isAdmin } from '@/lib/admin'
import {
    ArrowLeft, BookOpen, Code, Upload, FileText, Trash2,
    Eye, ChevronRight, Play, CheckCircle, Lightbulb, X,
    Search, Filter, Star, Lock, Unlock, ExternalLink,
    Plus, AlertCircle, RotateCcw, Download
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────
interface Resource {
    id: string
    title: string
    description: string
    category: string
    file_url: string
    file_name: string
    file_size_bytes: number
    uploaded_by: string
    view_count: number
    created_at: string
}

interface Problem {
    id: string
    title: string
    description: string
    difficulty: 'easy' | 'medium' | 'hard'
    category: string
    starter_code: string
    solution_code: string
    hints: string[]
    expected_output: string
    xp_reward: number
    solve_count: number
    uploaded_by: string
    created_at: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const difficultyColor: Record<string, string> = {
    easy: 'bg-green-100 text-green-700 border-green-200',
    medium: 'bg-amber-100 text-amber-700 border-amber-200',
    hard: 'bg-red-100 text-red-700 border-red-200',
}

const categoryColor: Record<string, string> = {
    beginner: 'bg-blue-50 text-blue-600',
    intermediate: 'bg-purple-50 text-purple-600',
    advanced: 'bg-rose-50 text-rose-600',
    general: 'bg-gray-50 text-gray-600',
    basics: 'bg-green-50 text-green-600',
    loops: 'bg-cyan-50 text-cyan-600',
    functions: 'bg-indigo-50 text-indigo-600',
    'data-structures': 'bg-orange-50 text-orange-600',
    oop: 'bg-pink-50 text-pink-600',
}

function formatBytes(bytes: number) {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ResourcesPage() {
    const { user } = useAuth()
    const router = useRouter()
    const supabase = createClient()

    const [tab, setTab] = useState<'pdfs' | 'problems'>('pdfs')
    const [resources, setResources] = useState<Resource[]>([])
    const [problems, setProblems] = useState<Problem[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filterCat, setFilterCat] = useState('all')
    const [selectedPDF, setSelectedPDF] = useState<Resource | null>(null)
    const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null)
    const [showUpload, setShowUpload] = useState(false)

    const admin = isAdmin(user?.email)

    useEffect(() => {
        if (!user) { router.replace('/login'); return }
        fetchAll()
    }, [user])

    const fetchAll = async () => {
        setLoading(true)
        const [resResult, probResult] = await Promise.all([
            supabase.from('learning_resources').select('*').eq('is_published', true).order('created_at', { ascending: false }),
            supabase.from('coding_problems').select('*').eq('is_published', true).order('created_at', { ascending: false }),
        ])
        setResources(resResult.data ?? [])
        setProblems(probResult.data ?? [])
        setLoading(false)
    }

    const deleteResource = async (id: string) => {
        if (!confirm('Delete this resource?')) return
        await supabase.from('learning_resources').delete().eq('id', id)
        setResources(prev => prev.filter(r => r.id !== id))
    }

    const deleteProblem = async (id: string) => {
        if (!confirm('Delete this problem?')) return
        await supabase.from('coding_problems').delete().eq('id', id)
        setProblems(prev => prev.filter(p => p.id !== id))
    }

    const filteredResources = resources.filter(r =>
        (filterCat === 'all' || r.category === filterCat) &&
        (r.title.toLowerCase().includes(search.toLowerCase()) || r.description?.toLowerCase().includes(search.toLowerCase()))
    )

    const filteredProblems = problems.filter(p =>
        (filterCat === 'all' || p.difficulty === filterCat || p.category === filterCat) &&
        (p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()))
    )

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
                    <Link href="/dashboard" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 font-medium group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        <span className="hidden sm:inline">Dashboard</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-primary-500" />
                        <span className="font-bold text-gray-800 text-sm sm:text-base">Learning Resources</span>
                    </div>
                    <button
                        onClick={() => setShowUpload(true)}
                        className="flex items-center gap-1.5 bg-primary-500 hover:bg-primary-600 text-white px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all active:scale-95"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        <span className="hidden xs:inline">Upload</span>
                    </button>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
                {/* Hero */}
                <div className="bg-gradient-to-br from-primary-600 to-indigo-700 rounded-2xl p-5 sm:p-8 mb-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
                    <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-2xl">📚</span>
                            <span className="text-xs font-bold uppercase tracking-wider text-primary-200">Learning Hub</span>
                        </div>
                        <h1 className="text-xl sm:text-3xl font-black mb-2 leading-tight">Study Materials & Challenges</h1>
                        <p className="text-primary-100 text-sm sm:text-base max-w-xl">
                            Access PDF guides, cheat sheets, and coding challenges to accelerate your Python learning journey.
                        </p>
                        <div className="flex flex-wrap gap-3 mt-4">
                            <div className="bg-white/10 backdrop-blur rounded-lg px-3 py-1.5 text-xs font-semibold">
                                📄 {resources.length} PDFs
                            </div>
                            <div className="bg-white/10 backdrop-blur rounded-lg px-3 py-1.5 text-xs font-semibold">
                                💻 {problems.length} Problems
                            </div>
                            <div className="bg-white/10 backdrop-blur rounded-lg px-3 py-1.5 text-xs font-semibold">
                                🤝 Community Uploads
                            </div>
                            {admin && (
                                <div className="bg-amber-400/20 border border-amber-300/30 rounded-lg px-3 py-1.5 text-xs font-semibold text-amber-200">
                                    ⚡ Admin Mode
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tabs + Search */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-5">
                    <div className="flex bg-white border border-gray-100 rounded-xl p-1 shadow-sm">
                        <button
                            onClick={() => { setTab('pdfs'); setFilterCat('all') }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all flex-1 justify-center ${tab === 'pdfs' ? 'bg-primary-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <FileText className="w-4 h-4" /> PDFs
                        </button>
                        <button
                            onClick={() => { setTab('problems'); setFilterCat('all') }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all flex-1 justify-center ${tab === 'problems' ? 'bg-primary-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Code className="w-4 h-4" /> Challenges
                        </button>
                    </div>

                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder={tab === 'pdfs' ? 'Search PDFs...' : 'Search problems...'}
                            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-primary-300 shadow-sm"
                        />
                    </div>

                    {/* Filter chips */}
                    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                        {tab === 'pdfs'
                            ? ['all', 'beginner', 'intermediate', 'advanced', 'general'].map(cat => (
                                <button key={cat} onClick={() => setFilterCat(cat)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${filterCat === cat ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'}`}>
                                    {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </button>
                            ))
                            : ['all', 'easy', 'medium', 'hard', 'basics', 'loops', 'functions', 'data-structures', 'oop'].map(cat => (
                                <button key={cat} onClick={() => setFilterCat(cat)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${filterCat === cat ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'}`}>
                                    {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
                                </button>
                            ))
                        }
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
                                <div className="h-4 bg-gray-100 rounded mb-3 w-3/4" />
                                <div className="h-3 bg-gray-100 rounded mb-2" />
                                <div className="h-3 bg-gray-100 rounded w-2/3" />
                            </div>
                        ))}
                    </div>
                ) : tab === 'pdfs' ? (
                    filteredResources.length === 0 ? (
                        <EmptyState
                            icon="📄"
                            title={search ? 'No PDFs match your search' : 'No PDFs uploaded yet'}
                            subtitle='Click "Upload" to be the first to share a PDF resource!'
                        />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredResources.map(r => (
                                <PDFCard key={r.id} resource={r} canDelete={admin || r.uploaded_by === user?.email} onView={() => setSelectedPDF(r)} onDelete={() => deleteResource(r.id)} />
                            ))}
                        </div>
                    )
                ) : (
                    filteredProblems.length === 0 ? (
                        <EmptyState
                            icon="💻"
                            title={search ? 'No problems match your search' : 'No challenges uploaded yet'}
                            subtitle='Click "Upload" to share a coding challenge with the community!'
                        />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredProblems.map(p => (
                                <ProblemCard key={p.id} problem={p} canDelete={admin || p.uploaded_by === user?.email} onSolve={() => setSelectedProblem(p)} onDelete={() => deleteProblem(p.id)} />
                            ))}
                        </div>
                    )
                )}
            </div>

            {/* PDF Viewer Modal */}
            {selectedPDF && (
                <PDFViewerModal resource={selectedPDF} onClose={() => setSelectedPDF(null)} />
            )}

            {/* Problem Solver Modal */}
            {selectedProblem && (
                <ProblemSolverModal problem={selectedProblem} userId={user?.uid ?? ''} onClose={() => setSelectedProblem(null)} />
            )}

            {/* Upload Modal — open to all users */}
            {showUpload && (
                <UploadModal
                    userId={user?.uid ?? ''}
                    userEmail={user?.email ?? ''}
                    onClose={() => setShowUpload(false)}
                    onSuccess={() => { setShowUpload(false); fetchAll() }}
                />
            )}
        </div>
    )
}

// ─── PDF Card ─────────────────────────────────────────────────────────────────
function PDFCard({ resource, canDelete, onView, onDelete }: { resource: Resource; canDelete: boolean; onView: () => void; onDelete: () => void }) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col">
            {/* Top color bar */}
            <div className="h-1.5 rounded-t-xl bg-gradient-to-r from-primary-400 to-indigo-500" />
            <div className="p-4 sm:p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${categoryColor[resource.category] || 'bg-gray-50 text-gray-500'}`}>
                            {resource.category}
                        </span>
                        {canDelete && (
                            <button onClick={onDelete} className="p-1 text-gray-300 hover:text-red-500 transition-colors rounded" title="Delete">
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                </div>

                <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1 leading-tight line-clamp-2">{resource.title}</h3>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2 flex-1">{resource.description}</p>

                <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                    <span>{formatBytes(resource.file_size_bytes)}</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {resource.view_count}</span>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={onView}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-lg text-xs font-semibold transition-all active:scale-95"
                    >
                        <Eye className="w-3.5 h-3.5" /> View PDF
                    </button>
                    <a
                        href={resource.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1 bg-gray-50 hover:bg-gray-100 text-gray-600 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
                    >
                        <Download className="w-3.5 h-3.5" />
                    </a>
                </div>
            </div>
        </div>
    )
}

// ─── Problem Card ─────────────────────────────────────────────────────────────
function ProblemCard({ problem, canDelete, onSolve, onDelete }: { problem: Problem; canDelete: boolean; onSolve: () => void; onDelete: () => void }) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col">
            <div className={`h-1.5 rounded-t-xl ${problem.difficulty === 'easy' ? 'bg-green-400' : problem.difficulty === 'medium' ? 'bg-amber-400' : 'bg-red-400'}`} />
            <div className="p-4 sm:p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Code className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap justify-end">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${difficultyColor[problem.difficulty]}`}>
                            {problem.difficulty}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${categoryColor[problem.category] || 'bg-gray-50 text-gray-500'}`}>
                            {problem.category.replace('-', ' ')}
                        </span>
                        {canDelete && (
                            <button onClick={onDelete} className="p-1 text-gray-300 hover:text-red-500 transition-colors rounded" title="Delete">
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                </div>

                <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1 leading-tight">{problem.title}</h3>
                <p className="text-xs text-gray-500 mb-3 line-clamp-3 flex-1">{problem.description}</p>

                <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-current" /> +{problem.xp_reward} XP</span>
                    <span>{problem.solve_count} solved</span>
                </div>

                <button
                    onClick={onSolve}
                    className="w-full flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-xs font-semibold transition-all active:scale-95"
                >
                    <Play className="w-3.5 h-3.5 fill-current" /> Solve Challenge
                </button>
            </div>
        </div>
    )
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) {
    return (
        <div className="text-center py-16 sm:py-20">
            <div className="text-5xl mb-4">{icon}</div>
            <h3 className="text-lg font-bold text-gray-700 mb-2">{title}</h3>
            <p className="text-sm text-gray-400 max-w-xs mx-auto">{subtitle}</p>
        </div>
    )
}

// ─── PDF Viewer Modal ─────────────────────────────────────────────────────────
function PDFViewerModal({ resource, onClose }: { resource: Resource; onClose: () => void }) {
    const supabase = createClient()

    useEffect(() => {
        // Increment view count
        ; (async () => { try { await supabase.rpc('increment_view_count', { resource_id: resource.id }) } catch { } })()
    }, [])

    return (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
            <div className="bg-white rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="w-4 h-4 text-red-500" />
                        </div>
                        <div className="min-w-0">
                            <h2 className="font-bold text-gray-900 text-sm sm:text-base truncate">{resource.title}</h2>
                            <p className="text-xs text-gray-400">{resource.file_name} · {formatBytes(resource.file_size_bytes)}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <a href={resource.file_url} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all">
                            <ExternalLink className="w-3.5 h-3.5" /> Open
                        </a>
                        <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* PDF iframe */}
                <div className="flex-1 overflow-hidden rounded-b-2xl">
                    <iframe
                        src={`${resource.file_url}#toolbar=1&navpanes=0`}
                        className="w-full h-full"
                        title={resource.title}
                    />
                </div>
            </div>
        </div>
    )
}

// ─── Problem Solver Modal ─────────────────────────────────────────────────────
function ProblemSolverModal({ problem, userId, onClose }: { problem: Problem; userId: string; onClose: () => void }) {
    const supabase = createClient()
    const [code, setCode] = useState(problem.starter_code || `# ${problem.title}\n# Write your solution below\n\n`)
    const [output, setOutput] = useState('')
    const [running, setRunning] = useState(false)
    const [pyodideReady, setPyodideReady] = useState(false)
    const [showHint, setShowHint] = useState(false)
    const [hintIndex, setHintIndex] = useState(0)
    const [showSolution, setShowSolution] = useState(false)
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
    const [xpAwarded, setXpAwarded] = useState(false)
    const pyodideRef = useRef<any>(null)

    useEffect(() => {
        const load = async () => {
            if (!(window as any).loadPyodide) {
                const script = document.createElement('script')
                script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js'
                script.onload = () => init()
                document.head.appendChild(script)
            } else { init() }
        }
        load()
    }, [])

    const init = async () => {
        try {
            if (pyodideRef.current) { setPyodideReady(true); return }
            const pyo = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/' })
            pyodideRef.current = pyo
            setPyodideReady(true)
        } catch (e) { console.error(e) }
    }

    const runCode = async () => {
        if (!pyodideRef.current) return
        setRunning(true); setOutput(''); setIsCorrect(null)
        try {
            const wrapped = `
import sys, io, traceback
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
try:
${code.split('\n').map(l => '    ' + l).join('\n')}
except Exception:
    print(traceback.format_exc(), file=sys.stderr)
`
            await pyodideRef.current.runPythonAsync(wrapped)
            const stdout = pyodideRef.current.runPython('sys.stdout.getvalue()')
            const stderr = pyodideRef.current.runPython('sys.stderr.getvalue()')
            const result = (stdout + (stderr ? '\n' + stderr : '')).trim() || '(no output)'
            setOutput(result)

            // Check correctness
            if (problem.expected_output) {
                const correct = result.trim().toLowerCase() === problem.expected_output.trim().toLowerCase()
                setIsCorrect(correct)
                if (correct && !xpAwarded) {
                    setXpAwarded(true)
                    await supabase.from('user_problem_attempts').insert({
                        user_id: userId, problem_id: problem.id,
                        code_submitted: code, is_correct: true, xp_earned: problem.xp_reward
                    })
                }
            }
        } catch (err: any) {
            setOutput(`Error: ${err.message}`)
        } finally { setRunning(false) }
    }

    return (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white rounded-2xl w-full max-w-5xl h-[92vh] flex flex-col shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-gray-100 flex-shrink-0">
                    <div className="flex items-center gap-2 min-w-0">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${difficultyColor[problem.difficulty]}`}>
                            {problem.difficulty}
                        </span>
                        <h2 className="font-bold text-gray-900 text-sm sm:text-base truncate">{problem.title}</h2>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="hidden sm:flex items-center gap-1 text-xs font-semibold text-amber-600">
                            <Star className="w-3.5 h-3.5 fill-current" /> +{problem.xp_reward} XP
                        </span>
                        <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Body — split layout */}
                <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
                    {/* Left: Problem description */}
                    <div className="lg:w-2/5 border-b lg:border-b-0 lg:border-r border-gray-100 overflow-y-auto p-4 sm:p-5 flex-shrink-0">
                        <h3 className="font-bold text-gray-800 mb-2 text-sm">Problem</h3>
                        <p className="text-sm text-gray-600 leading-relaxed mb-4">{problem.description}</p>

                        {problem.expected_output && (
                            <div className="bg-gray-50 rounded-xl p-3 mb-4 border border-gray-100">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Expected Output</p>
                                <pre className="text-sm font-mono text-gray-700">{problem.expected_output}</pre>
                            </div>
                        )}

                        {/* Hints */}
                        {problem.hints?.length > 0 && (
                            <div className="mb-4">
                                <button
                                    onClick={() => setShowHint(!showHint)}
                                    className="flex items-center gap-2 text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors"
                                >
                                    <Lightbulb className="w-3.5 h-3.5" />
                                    {showHint ? 'Hide Hint' : `Show Hint (${problem.hints.length} available)`}
                                </button>
                                {showHint && (
                                    <div className="mt-2 bg-amber-50 border border-amber-100 rounded-xl p-3">
                                        <p className="text-xs text-amber-800 leading-relaxed">{problem.hints[hintIndex]}</p>
                                        {problem.hints.length > 1 && (
                                            <button
                                                onClick={() => setHintIndex(i => (i + 1) % problem.hints.length)}
                                                className="text-[10px] text-amber-600 font-semibold mt-2"
                                            >
                                                Next hint →
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Solution toggle */}
                        {problem.solution_code && (
                            <div>
                                <button
                                    onClick={() => setShowSolution(!showSolution)}
                                    className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showSolution ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                                    {showSolution ? 'Hide Solution' : 'View Solution'}
                                </button>
                                {showSolution && (
                                    <pre className="mt-2 bg-gray-900 text-green-400 p-3 rounded-xl text-xs font-mono overflow-x-auto">
                                        {problem.solution_code}
                                    </pre>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right: Code editor */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                        {/* Editor toolbar */}
                        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                            <div className="flex items-center gap-3">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                                </div>
                                <span className="text-gray-400 text-xs font-mono">solution.py</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCode(problem.starter_code || '')}
                                    className="flex items-center gap-1 text-gray-500 hover:text-gray-300 text-xs transition-colors"
                                >
                                    <RotateCcw className="w-3 h-3" /> Reset
                                </button>
                                <button
                                    onClick={runCode}
                                    disabled={running || !pyodideReady}
                                    className="flex items-center gap-1.5 bg-green-600 hover:bg-green-500 disabled:bg-gray-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all active:scale-95"
                                >
                                    {running ? <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" /> : <Play className="w-3 h-3 fill-current" />}
                                    {!pyodideReady ? 'Loading...' : running ? 'Running' : 'Run Code'}
                                </button>
                            </div>
                        </div>

                        {/* Code textarea */}
                        <div className="relative flex-1 overflow-hidden">
                            <textarea
                                value={code}
                                onChange={e => setCode(e.target.value)}
                                className="w-full h-full bg-gray-900 text-green-400 font-mono text-sm p-4 resize-none focus:outline-none leading-6"
                                spellCheck={false}
                            />
                            {!pyodideReady && (
                                <div className="absolute inset-0 bg-gray-900/95 flex flex-col items-center justify-center gap-3">
                                    <div className="w-8 h-8 border-2 border-green-500/20 border-t-green-500 rounded-full animate-spin" />
                                    <span className="text-xs text-green-500/70 font-mono">Loading Python runtime...</span>
                                </div>
                            )}
                        </div>

                        {/* Output */}
                        <div className="border-t border-gray-800 bg-black/50 flex-shrink-0">
                            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800/50">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-gray-600" />
                                    <span className="text-xs text-gray-500 font-mono uppercase tracking-wider">Output</span>
                                </div>
                                {isCorrect !== null && (
                                    <div className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg ${isCorrect ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                                        {isCorrect ? <><CheckCircle className="w-3.5 h-3.5" /> Correct! +{problem.xp_reward} XP</> : <><AlertCircle className="w-3.5 h-3.5" /> Not quite</>}
                                    </div>
                                )}
                            </div>
                            <pre className="px-4 py-3 text-sm font-mono text-gray-300 min-h-[80px] max-h-[120px] overflow-y-auto whitespace-pre-wrap leading-5">
                                {output || <span className="text-gray-700 italic text-xs">Run your code to see output...</span>}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ─── Upload Modal ─────────────────────────────────────────────────────────────
function UploadModal({ userId, userEmail, onClose, onSuccess }: {
    userId: string; userEmail: string; onClose: () => void; onSuccess: () => void
}) {
    const supabase = createClient()
    const [uploadTab, setUploadTab] = useState<'pdf' | 'problem'>('pdf')
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const fileRef = useRef<HTMLInputElement>(null)

    // PDF form
    const [pdfForm, setPdfForm] = useState({ title: '', description: '', category: 'general' })
    const [pdfFile, setPdfFile] = useState<File | null>(null)

    // Problem form
    const [probForm, setProbForm] = useState({
        title: '', description: '', difficulty: 'easy', category: 'basics',
        starter_code: '# Write your solution here\n', solution_code: '',
        hints: '', expected_output: '', xp_reward: 10
    })

    const handlePDFUpload = async () => {
        if (!pdfFile || !pdfForm.title) { setError('Please fill in title and select a PDF file.'); return }
        setSaving(true); setError('')
        try {
            const fileName = `${Date.now()}-${pdfFile.name.replace(/\s+/g, '-')}`
            const { data: uploadData, error: uploadErr } = await supabase.storage
                .from('learning-resources')
                .upload(fileName, pdfFile, { contentType: 'application/pdf' })

            if (uploadErr) throw new Error(uploadErr.message)

            const { data: { publicUrl } } = supabase.storage.from('learning-resources').getPublicUrl(fileName)

            await supabase.from('learning_resources').insert({
                title: pdfForm.title,
                description: pdfForm.description,
                category: pdfForm.category,
                file_url: publicUrl,
                file_name: pdfFile.name,
                file_size_bytes: pdfFile.size,
                uploaded_by: userEmail,
            })
            onSuccess()
        } catch (err: any) {
            setError(err.message || 'Upload failed. Make sure the "learning-resources" storage bucket exists in Supabase.')
        } finally { setSaving(false) }
    }

    const handleProblemUpload = async () => {
        if (!probForm.title || !probForm.description) { setError('Please fill in title and description.'); return }
        setSaving(true); setError('')
        try {
            const hints = probForm.hints.split('\n').map(h => h.trim()).filter(Boolean)
            await supabase.from('coding_problems').insert({
                title: probForm.title,
                description: probForm.description,
                difficulty: probForm.difficulty,
                category: probForm.category,
                starter_code: probForm.starter_code,
                solution_code: probForm.solution_code,
                hints,
                expected_output: probForm.expected_output,
                xp_reward: Number(probForm.xp_reward),
                uploaded_by: userEmail,
            })
            onSuccess()
        } catch (err: any) {
            setError(err.message || 'Failed to save problem.')
        } finally { setSaving(false) }
    }

    return (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <Upload className="w-5 h-5 text-primary-500" />
                        <h2 className="font-bold text-gray-900">Upload Resource</h2>
                    </div>
                    <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tab switcher */}
                <div className="flex gap-1 p-3 border-b border-gray-100">
                    <button onClick={() => setUploadTab('pdf')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${uploadTab === 'pdf' ? 'bg-primary-500 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                        <FileText className="w-4 h-4" /> PDF Resource
                    </button>
                    <button onClick={() => setUploadTab('problem')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${uploadTab === 'problem' ? 'bg-primary-500 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                        <Code className="w-4 h-4" /> Coding Problem
                    </button>
                </div>

                {/* Form */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {error && (
                        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
                            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    {uploadTab === 'pdf' ? (
                        <>
                            <FormField label="Title *">
                                <input type="text" value={pdfForm.title} onChange={e => setPdfForm(p => ({ ...p, title: e.target.value }))}
                                    className="input-field" placeholder="e.g. Python Cheat Sheet" />
                            </FormField>
                            <FormField label="Description">
                                <textarea value={pdfForm.description} onChange={e => setPdfForm(p => ({ ...p, description: e.target.value }))}
                                    className="input-field resize-none" rows={2} placeholder="Brief description of this resource..." />
                            </FormField>
                            <FormField label="Category">
                                <select value={pdfForm.category} onChange={e => setPdfForm(p => ({ ...p, category: e.target.value }))} className="input-field">
                                    {['general', 'beginner', 'intermediate', 'advanced'].map(c => (
                                        <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                                    ))}
                                </select>
                            </FormField>
                            <FormField label="PDF File *">
                                <div
                                    onClick={() => fileRef.current?.click()}
                                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${pdfFile ? 'border-primary-300 bg-primary-50' : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'}`}
                                >
                                    <input ref={fileRef} type="file" accept=".pdf" className="hidden"
                                        onChange={e => setPdfFile(e.target.files?.[0] ?? null)} />
                                    {pdfFile ? (
                                        <div>
                                            <FileText className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                                            <p className="text-sm font-semibold text-primary-700">{pdfFile.name}</p>
                                            <p className="text-xs text-gray-400">{formatBytes(pdfFile.size)}</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                            <p className="text-sm text-gray-500">Click to select PDF</p>
                                            <p className="text-xs text-gray-400">Max 50MB</p>
                                        </div>
                                    )}
                                </div>
                            </FormField>
                        </>
                    ) : (
                        <>
                            <FormField label="Problem Title *">
                                <input type="text" value={probForm.title} onChange={e => setProbForm(p => ({ ...p, title: e.target.value }))}
                                    className="input-field" placeholder="e.g. Reverse a String" />
                            </FormField>
                            <FormField label="Description *">
                                <textarea value={probForm.description} onChange={e => setProbForm(p => ({ ...p, description: e.target.value }))}
                                    className="input-field resize-none" rows={3} placeholder="Explain the problem clearly..." />
                            </FormField>
                            <div className="grid grid-cols-2 gap-3">
                                <FormField label="Difficulty">
                                    <select value={probForm.difficulty} onChange={e => setProbForm(p => ({ ...p, difficulty: e.target.value }))} className="input-field">
                                        {['easy', 'medium', 'hard'].map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
                                    </select>
                                </FormField>
                                <FormField label="Category">
                                    <select value={probForm.category} onChange={e => setProbForm(p => ({ ...p, category: e.target.value }))} className="input-field">
                                        {['basics', 'loops', 'functions', 'data-structures', 'oop'].map(c => (
                                            <option key={c} value={c}>{c.replace('-', ' ')}</option>
                                        ))}
                                    </select>
                                </FormField>
                            </div>
                            <FormField label="Starter Code">
                                <textarea value={probForm.starter_code} onChange={e => setProbForm(p => ({ ...p, starter_code: e.target.value }))}
                                    className="input-field font-mono text-sm resize-none" rows={4} />
                            </FormField>
                            <FormField label="Solution Code">
                                <textarea value={probForm.solution_code} onChange={e => setProbForm(p => ({ ...p, solution_code: e.target.value }))}
                                    className="input-field font-mono text-sm resize-none" rows={4} placeholder="Optional: model solution..." />
                            </FormField>
                            <FormField label="Expected Output">
                                <input type="text" value={probForm.expected_output} onChange={e => setProbForm(p => ({ ...p, expected_output: e.target.value }))}
                                    className="input-field font-mono text-sm" placeholder="e.g. Hello, World!" />
                            </FormField>
                            <FormField label="Hints (one per line)">
                                <textarea value={probForm.hints} onChange={e => setProbForm(p => ({ ...p, hints: e.target.value }))}
                                    className="input-field resize-none" rows={3} placeholder="Hint 1&#10;Hint 2&#10;Hint 3" />
                            </FormField>
                            <FormField label="XP Reward">
                                <input type="number" value={probForm.xp_reward} onChange={e => setProbForm(p => ({ ...p, xp_reward: Number(e.target.value) }))}
                                    className="input-field" min={5} max={100} />
                            </FormField>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-100">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
                        Cancel
                    </button>
                    <button
                        onClick={uploadTab === 'pdf' ? handlePDFUpload : handleProblemUpload}
                        disabled={saving}
                        className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-200 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95"
                    >
                        {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Upload className="w-4 h-4" />}
                        {saving ? 'Uploading...' : uploadTab === 'pdf' ? 'Upload PDF' : 'Save Problem'}
                    </button>
                </div>
            </div>
        </div>
    )
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">{label}</label>
            {children}
        </div>
    )
}
