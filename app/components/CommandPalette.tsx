import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';

interface Command {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    action: () => void;
    shortcut?: string;
    category: string;
}

export default function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const commands: Command[] = [
        {
            id: 'dashboard',
            title: 'Go to Dashboard',
            description: 'View all shipments and statistics',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
            ),
            action: () => navigate('/dashboard'),
            shortcut: 'G D',
            category: 'Navigation',
        },
        {
            id: 'ai-insights',
            title: 'Go to AI Insights',
            description: 'View ML-powered analytics and predictions',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
            ),
            action: () => navigate('/ai-insights'),
            shortcut: 'G A',
            category: 'Navigation',
        },
        {
            id: 'home',
            title: 'Go to Home',
            description: 'Return to the landing page',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
            action: () => navigate('/'),
            shortcut: 'G H',
            category: 'Navigation',
        },
        {
            id: 'new-shipment',
            title: 'Create New Shipment',
            description: 'Add a new shipment to track',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            ),
            action: () => {
                navigate('/dashboard');
                // Trigger modal open - this would require a global state
            },
            shortcut: 'N',
            category: 'Actions',
        },
        {
            id: 'refresh',
            title: 'Refresh Data',
            description: 'Reload all shipment data',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
            ),
            action: () => window.location.reload(),
            shortcut: 'R',
            category: 'Actions',
        },
        {
            id: 'search-shipment',
            title: 'Search Shipments',
            description: 'Find a specific shipment by ID',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            ),
            action: () => navigate('/dashboard'),
            shortcut: '/',
            category: 'Actions',
        },
        {
            id: 'export',
            title: 'Export Data',
            description: 'Download shipment data as CSV',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
            ),
            action: () => alert('Export feature coming soon!'),
            category: 'Actions',
        },
        {
            id: 'github',
            title: 'View on GitHub',
            description: 'Open the project repository',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
            ),
            action: () => window.open('https://github.com/The-ChandanKV/ChainSight', '_blank'),
            category: 'Help',
        },
    ];

    const filteredCommands = commands.filter(
        (cmd) =>
            cmd.title.toLowerCase().includes(search.toLowerCase()) ||
            cmd.description.toLowerCase().includes(search.toLowerCase()) ||
            cmd.category.toLowerCase().includes(search.toLowerCase())
    );

    const groupedCommands = filteredCommands.reduce((acc, cmd) => {
        if (!acc[cmd.category]) acc[cmd.category] = [];
        acc[cmd.category].push(cmd);
        return acc;
    }, {} as Record<string, Command[]>);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            // Cmd/Ctrl + K to open
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen((prev) => !prev);
                return;
            }

            if (!isOpen) return;

            if (e.key === 'Escape') {
                setIsOpen(false);
                setSearch('');
                setSelectedIndex(0);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
            } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
                filteredCommands[selectedIndex].action();
                setIsOpen(false);
                setSearch('');
                setSelectedIndex(0);
            }
        },
        [isOpen, filteredCommands, selectedIndex]
    );

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        setSelectedIndex(0);
    }, [search]);

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 text-gray-400 hover:text-white"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-sm">Search...</span>
                <kbd className="ml-2 px-2 py-0.5 text-xs bg-white/10 rounded border border-white/20">⌘K</kbd>
            </button>
        );
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                onClick={() => {
                    setIsOpen(false);
                    setSearch('');
                }}
            />

            {/* Command Palette */}
            <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-full max-w-xl z-50 animate-fadeInUp">
                <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
                    {/* Search Input */}
                    <div className="flex items-center gap-3 p-4 border-b border-white/10">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            ref={inputRef}
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Type a command or search..."
                            className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-lg"
                        />
                        <kbd className="px-2 py-1 text-xs text-gray-400 bg-white/10 rounded border border-white/20">ESC</kbd>
                    </div>

                    {/* Commands List */}
                    <div className="max-h-96 overflow-y-auto p-2">
                        {Object.entries(groupedCommands).map(([category, cmds]) => (
                            <div key={category} className="mb-4">
                                <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    {category}
                                </p>
                                {cmds.map((cmd) => {
                                    const globalIndex = filteredCommands.findIndex((c) => c.id === cmd.id);
                                    const isSelected = globalIndex === selectedIndex;

                                    return (
                                        <button
                                            key={cmd.id}
                                            onClick={() => {
                                                cmd.action();
                                                setIsOpen(false);
                                                setSearch('');
                                            }}
                                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-150 ${isSelected ? 'bg-blue-500/20 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                                                }`}
                                        >
                                            <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-500/30 text-blue-400' : 'bg-white/10'}`}>
                                                {cmd.icon}
                                            </div>
                                            <div className="flex-1 text-left">
                                                <p className="font-medium">{cmd.title}</p>
                                                <p className="text-sm text-gray-500">{cmd.description}</p>
                                            </div>
                                            {cmd.shortcut && (
                                                <kbd className="px-2 py-1 text-xs bg-white/10 rounded border border-white/20">
                                                    {cmd.shortcut}
                                                </kbd>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        ))}

                        {filteredCommands.length === 0 && (
                            <div className="p-8 text-center">
                                <svg className="w-12 h-12 mx-auto text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-gray-400">No commands found for "{search}"</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-3 border-t border-white/10 flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 bg-white/10 rounded">↑↓</kbd> Navigate
                            </span>
                            <span className="flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 bg-white/10 rounded">↵</kbd> Select
                            </span>
                        </div>
                        <span>ChainSight Command Palette</span>
                    </div>
                </div>
            </div>
        </>
    );
}
