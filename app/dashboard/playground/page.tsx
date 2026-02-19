'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import {
    Play, RotateCcw, Terminal, Lightbulb, CheckCircle,
    ChevronLeft, ChevronRight, Lock, Star, Zap, BookOpen,
    Code2, Trophy, ArrowLeft
} from 'lucide-react'

/* ─── Challenge Data ──────────────────────────────────── */
const CHALLENGES = [
    {
        id: 1, title: 'Hello, World!', difficulty: 'Beginner', xp: 10, category: 'Basics',
        description: 'Write a Python program that prints "Hello, World!" to the screen.',
        hint: 'Use the print() function with the text inside quotes.',
        starterCode: '# Your first Python program!\n# Print "Hello, World!" below\n\n',
        solution: 'print("Hello, World!")',
        testCases: [{ input: '', expected: 'Hello, World!' }],
        tip: '💡 print() is the most basic Python function. It displays text to the console.',
    },
    {
        id: 2, title: 'Sum of Two Numbers', difficulty: 'Beginner', xp: 15, category: 'Basics',
        description: 'Create variables a = 5 and b = 3, then print their sum.',
        hint: 'Use the + operator to add numbers.',
        starterCode: '# Create two variables and print their sum\na = 5\nb = 3\n# Print the sum of a and b\n',
        solution: 'a = 5\nb = 3\nprint(a + b)',
        testCases: [{ input: '', expected: '8' }],
        tip: '💡 In Python, you can add numbers directly: a + b',
    },
    {
        id: 3, title: 'String Greeting', difficulty: 'Beginner', xp: 15, category: 'Strings',
        description: 'Create a variable name = "Python" and print "Hello, Python!"',
        hint: 'Use an f-string: f"Hello, {name}!"',
        starterCode: '# Create a name variable and greet it\nname = "Python"\n# Print: Hello, Python!\n',
        solution: 'name = "Python"\nprint(f"Hello, {name}!")',
        testCases: [{ input: '', expected: 'Hello, Python!' }],
        tip: '💡 f-strings let you embed variables inside strings using {variable_name}',
    },
    {
        id: 4, title: 'Even or Odd', difficulty: 'Beginner', xp: 20, category: 'Conditionals',
        description: 'Write a program that checks if the number 7 is even or odd and prints the result.',
        hint: 'Use the modulo operator % to check if a number is divisible by 2.',
        starterCode: '# Check if 7 is even or odd\nnum = 7\n# Write your if/else here\n',
        solution: 'num = 7\nif num % 2 == 0:\n    print("Even")\nelse:\n    print("Odd")',
        testCases: [{ input: '', expected: 'Odd' }],
        tip: '💡 num % 2 gives the remainder when dividing by 2. If it\'s 0, the number is even.',
    },
    {
        id: 5, title: 'Count to 5', difficulty: 'Beginner', xp: 20, category: 'Loops',
        description: 'Use a for loop to print numbers 1 through 5, each on a new line.',
        hint: 'Use range(1, 6) to get numbers from 1 to 5.',
        starterCode: '# Print numbers 1 to 5 using a loop\n',
        solution: 'for i in range(1, 6):\n    print(i)',
        testCases: [{ input: '', expected: '1\n2\n3\n4\n5' }],
        tip: '💡 range(start, stop) generates numbers from start up to (but not including) stop.',
    },
    {
        id: 6, title: 'List Sum', difficulty: 'Intermediate', xp: 30, category: 'Lists',
        description: 'Given the list numbers = [1, 2, 3, 4, 5], print the sum of all elements.',
        hint: 'Python has a built-in sum() function.',
        starterCode: '# Find the sum of all numbers in the list\nnumbers = [1, 2, 3, 4, 5]\n# Print the sum\n',
        solution: 'numbers = [1, 2, 3, 4, 5]\nprint(sum(numbers))',
        testCases: [{ input: '', expected: '15' }],
        tip: '💡 sum() is a built-in function that adds all elements in a list.',
    },
    {
        id: 7, title: 'Reverse a String', difficulty: 'Intermediate', xp: 30, category: 'Strings',
        description: 'Print the reverse of the string "Python".',
        hint: 'Use Python\'s slice notation: text[::-1]',
        starterCode: '# Reverse the string "Python"\ntext = "Python"\n# Print the reversed string\n',
        solution: 'text = "Python"\nprint(text[::-1])',
        testCases: [{ input: '', expected: 'nohtyP' }],
        tip: '💡 [::-1] is a slice that steps backwards through the string.',
    },
    {
        id: 8, title: 'FizzBuzz', difficulty: 'Intermediate', xp: 40, category: 'Conditionals',
        description: 'Print numbers 1-15. For multiples of 3 print "Fizz", for multiples of 5 print "Buzz", for both print "FizzBuzz".',
        hint: 'Check for FizzBuzz first (divisible by both 3 and 5), then Fizz, then Buzz.',
        starterCode: '# Classic FizzBuzz challenge\nfor i in range(1, 16):\n    # Add your conditions here\n    pass\n',
        solution: 'for i in range(1, 16):\n    if i % 15 == 0:\n        print("FizzBuzz")\n    elif i % 3 == 0:\n        print("Fizz")\n    elif i % 5 == 0:\n        print("Buzz")\n    else:\n        print(i)',
        testCases: [{ input: '', expected: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz' }],
        tip: '💡 Always check the most specific condition first (FizzBuzz) before the general ones.',
    },
    {
        id: 9, title: 'Factorial', difficulty: 'Intermediate', xp: 40, category: 'Functions',
        description: 'Write a function factorial(n) that returns n! (factorial). Print factorial(5).',
        hint: 'Factorial of n = n × (n-1) × ... × 1. Use a loop or recursion.',
        starterCode: '# Write a factorial function\ndef factorial(n):\n    # Your code here\n    pass\n\nprint(factorial(5))  # Should print 120\n',
        solution: 'def factorial(n):\n    result = 1\n    for i in range(1, n + 1):\n        result *= i\n    return result\n\nprint(factorial(5))',
        testCases: [{ input: '', expected: '120' }],
        tip: '💡 5! = 5 × 4 × 3 × 2 × 1 = 120. Start with result = 1 and multiply each number.',
    },
    {
        id: 10, title: 'Palindrome Check', difficulty: 'Advanced', xp: 50, category: 'Strings',
        description: 'Write a function is_palindrome(s) that returns True if s reads the same forwards and backwards. Test with "racecar" and "hello".',
        hint: 'Compare the string with its reverse using [::-1].',
        starterCode: '# Check if a string is a palindrome\ndef is_palindrome(s):\n    # Your code here\n    pass\n\nprint(is_palindrome("racecar"))  # True\nprint(is_palindrome("hello"))    # False\n',
        solution: 'def is_palindrome(s):\n    return s == s[::-1]\n\nprint(is_palindrome("racecar"))\nprint(is_palindrome("hello"))',
        testCases: [{ input: '', expected: 'True\nFalse' }],
        tip: '💡 A palindrome reads the same forwards and backwards. "racecar" reversed is still "racecar".',
    },
]

const DIFFICULTY_COLORS: Record<string, string> = {
    Beginner: 'text-success-700 bg-success-100 border-success-200',
    Intermediate: 'text-warning-700 bg-warning-100 border-warning-200',
    Advanced: 'text-red-700 bg-red-100 border-red-200',
}

/* ─── Python Runner Hook ──────────────────────────────── */
function usePyodide() {
    const pyodideRef = useRef<any>(null)
    const [ready, setReady] = useState(false)

    useEffect(() => {
        const load = async () => {
            if (!(window as any).loadPyodide) {
                await new Promise<void>(resolve => {
                    const s = document.createElement('script')
                    s.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js'
                    s.onload = () => resolve()
                    document.head.appendChild(s)
                })
            }
            pyodideRef.current = await (window as any).loadPyodide({
                indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/',
            })
            setReady(true)
        }
        load().catch(console.error)
    }, [])

    const run = async (code: string): Promise<string> => {
        if (!pyodideRef.current) return '⏳ Python is still loading...'
        try {
            pyodideRef.current.runPython(`
import sys, io
sys.stdout = io.StringIO()
sys.stderr = sys.stdout
`)
            pyodideRef.current.runPython(code)
            return pyodideRef.current.runPython('sys.stdout.getvalue()') || '(no output)'
        } catch (err: any) {
            return `❌ ${err.message}`
        }
    }

    return { ready, run }
}

/* ─── Main Playground Page ────────────────────────────── */
export default function PlaygroundPage() {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()
    const { ready: pyReady, run: runPython } = usePyodide()

    const [selectedId, setSelectedId] = useState(1)
    const [code, setCode] = useState(CHALLENGES[0].starterCode)
    const [output, setOutput] = useState('')
    const [running, setRunning] = useState(false)
    const [showHint, setShowHint] = useState(false)
    const [showSolution, setShowSolution] = useState(false)
    const [passed, setPassed] = useState<boolean | null>(null)
    const [completedIds, setCompletedIds] = useState<Set<number>>(new Set())
    const [filter, setFilter] = useState<string>('All')

    useEffect(() => {
        if (!authLoading && !user) router.replace('/login')
    }, [user, authLoading]) // eslint-disable-line

    const challenge = CHALLENGES.find(c => c.id === selectedId)!

    const selectChallenge = (c: typeof CHALLENGES[0]) => {
        setSelectedId(c.id)
        setCode(c.starterCode)
        setOutput('')
        setPassed(null)
        setShowHint(false)
        setShowSolution(false)
    }

    const handleRun = async () => {
        setRunning(true)
        setPassed(null)
        const result = await runPython(code)
        setOutput(result)

        // Check against expected output
        const expected = challenge.testCases[0].expected.trim()
        const actual = result.trim()
        const ok = actual === expected || actual.includes(expected)
        setPassed(ok)
        if (ok) setCompletedIds(prev => new Set(Array.from(prev).concat(challenge.id)))

        setRunning(false)
    }

    const handleReset = () => {
        setCode(challenge.starterCode)
        setOutput('')
        setPassed(null)
        setShowHint(false)
        setShowSolution(false)
    }

    const categories = ['All', ...Array.from(new Set(CHALLENGES.map(c => c.category)))]
    const filtered = filter === 'All' ? CHALLENGES : CHALLENGES.filter(c => c.category === filter)

    if (authLoading) return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
            {/* Top Nav */}
            <nav className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm">Dashboard</span>
                    </Link>
                    <div className="h-4 w-px bg-gray-700" />
                    <div className="flex items-center gap-2">
                        <Code2 className="w-5 h-5 text-green-400" />
                        <span className="font-bold text-white">Python Playground</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full ${pyReady ? 'bg-green-900 text-green-400' : 'bg-yellow-900 text-yellow-400'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${pyReady ? 'bg-green-400' : 'bg-yellow-400 animate-pulse'}`} />
                        {pyReady ? 'Python Ready' : 'Loading Python...'}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Trophy className="w-4 h-4 text-yellow-400" />
                        {completedIds.size}/{CHALLENGES.length} solved
                    </div>
                </div>
            </nav>

            <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 57px)' }}>
                {/* ── Left Panel: Challenge List ── */}
                <div className="w-72 bg-gray-900 border-r border-gray-800 flex flex-col flex-shrink-0 overflow-hidden">
                    <div className="p-3 border-b border-gray-800">
                        <div className="flex flex-wrap gap-1">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setFilter(cat)}
                                    className={`text-xs px-2.5 py-1 rounded-full transition-all font-medium ${filter === cat ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="overflow-y-auto flex-1">
                        {filtered.map(c => (
                            <button
                                key={c.id}
                                onClick={() => selectChallenge(c)}
                                className={`w-full text-left px-4 py-3 border-b border-gray-800 transition-all hover:bg-gray-800 ${selectedId === c.id ? 'bg-gray-800 border-l-2 border-l-green-500' : ''
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            {completedIds.has(c.id)
                                                ? <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                                                : <div className="w-3.5 h-3.5 rounded-full border border-gray-600 flex-shrink-0" />
                                            }
                                            <span className="text-sm font-medium text-white truncate">{c.title}</span>
                                        </div>
                                        <div className="flex items-center gap-2 ml-5">
                                            <span className={`text-xs px-1.5 py-0.5 rounded border font-medium ${DIFFICULTY_COLORS[c.difficulty]}`}>
                                                {c.difficulty}
                                            </span>
                                            <span className="text-xs text-gray-500">{c.category}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-yellow-400 flex-shrink-0">
                                        <Zap className="w-3 h-3" />
                                        {c.xp}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Middle Panel: Problem ── */}
                <div className="w-80 bg-gray-900 border-r border-gray-800 flex flex-col flex-shrink-0 overflow-hidden">
                    <div className="p-4 border-b border-gray-800">
                        <div className="flex items-center justify-between mb-2">
                            <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${DIFFICULTY_COLORS[challenge.difficulty]}`}>
                                {challenge.difficulty}
                            </span>
                            <div className="flex items-center gap-1 text-yellow-400 text-sm font-semibold">
                                <Zap className="w-4 h-4" />
                                {challenge.xp} XP
                            </div>
                        </div>
                        <h2 className="text-lg font-bold text-white">{challenge.title}</h2>
                        <span className="text-xs text-gray-500">{challenge.category}</span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        <div>
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Description</h3>
                            <p className="text-gray-300 text-sm leading-relaxed">{challenge.description}</p>
                        </div>

                        <div>
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Expected Output</h3>
                            <pre className="bg-gray-950 border border-gray-700 rounded-lg p-3 text-green-400 text-xs font-mono">
                                {challenge.testCases[0].expected}
                            </pre>
                        </div>

                        {/* Tip */}
                        <div className="bg-blue-950 border border-blue-800 rounded-lg p-3">
                            <p className="text-blue-300 text-xs leading-relaxed">{challenge.tip}</p>
                        </div>

                        {/* Hint */}
                        <div>
                            <button
                                onClick={() => setShowHint(!showHint)}
                                className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 text-sm transition"
                            >
                                <Lightbulb className="w-4 h-4" />
                                {showHint ? 'Hide Hint' : 'Show Hint'}
                            </button>
                            {showHint && (
                                <div className="mt-2 bg-yellow-950 border border-yellow-800 rounded-lg p-3">
                                    <p className="text-yellow-200 text-xs leading-relaxed">{challenge.hint}</p>
                                </div>
                            )}
                        </div>

                        {/* Solution */}
                        <div>
                            <button
                                onClick={() => setShowSolution(!showSolution)}
                                className="flex items-center gap-2 text-gray-500 hover:text-gray-400 text-xs transition"
                            >
                                <BookOpen className="w-3.5 h-3.5" />
                                {showSolution ? 'Hide Solution' : 'View Solution'}
                            </button>
                            {showSolution && (
                                <pre className="mt-2 bg-gray-950 border border-gray-700 rounded-lg p-3 text-green-400 text-xs font-mono overflow-x-auto">
                                    {challenge.solution}
                                </pre>
                            )}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="p-3 border-t border-gray-800 flex items-center justify-between">
                        <button
                            onClick={() => {
                                const prev = CHALLENGES.find(c => c.id === selectedId - 1)
                                if (prev) selectChallenge(prev)
                            }}
                            disabled={selectedId === 1}
                            className="flex items-center gap-1 text-xs text-gray-400 hover:text-white disabled:opacity-30 transition"
                        >
                            <ChevronLeft className="w-4 h-4" /> Prev
                        </button>
                        <span className="text-xs text-gray-600">{selectedId}/{CHALLENGES.length}</span>
                        <button
                            onClick={() => {
                                const next = CHALLENGES.find(c => c.id === selectedId + 1)
                                if (next) selectChallenge(next)
                            }}
                            disabled={selectedId === CHALLENGES.length}
                            className="flex items-center gap-1 text-xs text-gray-400 hover:text-white disabled:opacity-30 transition"
                        >
                            Next <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* ── Right Panel: Editor + Output ── */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Editor toolbar */}
                    <div className="bg-gray-900 border-b border-gray-800 px-4 py-2 flex items-center justify-between flex-shrink-0">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            <span className="text-gray-500 text-xs ml-2 font-mono">solution.py</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleReset}
                                className="flex items-center gap-1.5 text-gray-400 hover:text-white text-xs px-3 py-1.5 rounded-lg border border-gray-700 hover:border-gray-500 transition"
                            >
                                <RotateCcw className="w-3.5 h-3.5" /> Reset
                            </button>
                            <button
                                onClick={handleRun}
                                disabled={running || !pyReady}
                                className="flex items-center gap-2 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm px-4 py-1.5 rounded-lg transition-all font-semibold"
                            >
                                {running ? (
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <Play className="w-4 h-4" />
                                )}
                                {!pyReady ? 'Loading...' : running ? 'Running...' : 'Run Code'}
                            </button>
                        </div>
                    </div>

                    {/* Code editor */}
                    <textarea
                        value={code}
                        onChange={e => setCode(e.target.value)}
                        className="flex-1 bg-gray-950 text-green-300 font-mono text-sm p-4 resize-none focus:outline-none leading-relaxed"
                        spellCheck={false}
                        style={{ minHeight: '300px' }}
                    />

                    {/* Output panel */}
                    <div className="bg-gray-900 border-t border-gray-800 flex-shrink-0" style={{ height: '200px' }}>
                        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800">
                            <div className="flex items-center gap-2">
                                <Terminal className="w-4 h-4 text-gray-400" />
                                <span className="text-xs text-gray-400 font-mono">Output</span>
                            </div>
                            {passed !== null && (
                                <div className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${passed ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'
                                    }`}>
                                    {passed ? <CheckCircle className="w-3.5 h-3.5" /> : <span>✗</span>}
                                    {passed ? 'All Tests Passed!' : 'Not quite right'}
                                </div>
                            )}
                            {output && (
                                <button onClick={() => { setOutput(''); setPassed(null) }} className="text-gray-600 hover:text-gray-400 transition">
                                    <RotateCcw className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                        <pre className="px-4 py-3 text-sm font-mono overflow-auto h-[calc(100%-41px)] whitespace-pre-wrap leading-relaxed"
                            style={{ color: passed === false ? '#f87171' : passed === true ? '#4ade80' : '#d1d5db' }}
                        >
                            {output || <span className="text-gray-600">Click "Run Code" to execute your Python program...</span>}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    )
}
