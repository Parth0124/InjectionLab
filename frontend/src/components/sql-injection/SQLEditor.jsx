import React, { useState, useRef } from 'react'
import Editor from '@monaco-editor/react'
import { PlayIcon, ArrowPathIcon } from '@heroicons/react/24/solid'
import LoadingSpinner from '../common/LoadingSpinner'

function SQLEditor({ onExecute, isExecuting, defaultQuery = '' }) {
  const [query, setQuery] = useState(defaultQuery)
  const editorRef = useRef(null)

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor
    
    // Configure SQL language features
    monaco.languages.setLanguageConfiguration('sql', {
      comments: {
        lineComment: '--',
        blockComment: ['/*', '*/']
      },
      brackets: [
        ['(', ')'],
        ['[', ']']
      ],
      autoClosingPairs: [
        { open: '(', close: ')' },
        { open: '[', close: ']' },
        { open: "'", close: "'" },
        { open: '"', close: '"' }
      ],
      surroundingPairs: [
        { open: '(', close: ')' },
        { open: '[', close: ']' },
        { open: "'", close: "'" },
        { open: '"', close: '"' }
      ]
    })
  }

  const handleExecute = () => {
    if (query.trim() && !isExecuting) {
      onExecute(query)
    }
  }

  const handleClear = () => {
    setQuery('')
    editorRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    // Execute on Ctrl/Cmd + Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      handleExecute()
    }
  }

  // Sample queries for quick testing
  const sampleQueries = [
    {
      label: 'Basic SELECT',
      query: "SELECT * FROM users WHERE username='admin'"
    },
    {
      label: 'OR Bypass',
      query: "admin' OR '1'='1'--"
    },
    {
      label: 'Comment Bypass',
      query: "admin'--"
    },
    {
      label: 'UNION Attack',
      query: "' UNION SELECT username, password FROM users--"
    }
  ]

  const insertSampleQuery = (sampleQuery) => {
    setQuery(sampleQuery)
    editorRef.current?.focus()
  }

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">SQL Query Editor</h3>
          <div className="flex space-x-2">
            <button
              onClick={handleClear}
              className="bg-gradient-to-r from-gray-700 to-gray-800 text-white px-4 py-2 rounded-lg font-semibold hover:from-gray-600 hover:to-gray-700 transform hover:scale-105 transition-all duration-200 border border-gray-600 flex items-center text-sm shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={isExecuting}
            >
              <ArrowPathIcon className="h-4 w-4 mr-1" />
              Clear
            </button>
            <button
              onClick={handleExecute}
              disabled={!query.trim() || isExecuting}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-cyan-500/50 flex items-center text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isExecuting ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Executing...</span>
                </>
              ) : (
                <>
                  <PlayIcon className="h-4 w-4 mr-1" />
                  Execute (Ctrl+Enter)
                </>
              )}
            </button>
          </div>
        </div>

        <div className="border border-gray-700 rounded-xl overflow-hidden shadow-inner" onKeyDown={handleKeyDown}>
          <Editor
            height="200px"
            defaultLanguage="sql"
            value={query}
            onChange={(value) => setQuery(value || '')}
            onMount={handleEditorDidMount}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: 'on',
              suggestOnTriggerCharacters: true,
              quickSuggestions: true,
              acceptSuggestionOnEnter: 'on'
            }}
          />
        </div>

        <div className="mt-4 p-4 bg-gradient-to-r from-cyan-900/40 to-blue-900/40 rounded-xl border border-cyan-700/50">
          <p className="text-xs text-cyan-200 mb-2">
            <strong className="text-cyan-400">Tip:</strong> Try different SQL injection techniques to bypass authentication or extract data.
          </p>
          <p className="text-xs text-cyan-300">
            Press <kbd className="px-2 py-1 bg-cyan-700 rounded text-xs font-mono">Ctrl</kbd> + <kbd className="px-2 py-1 bg-cyan-700 rounded text-xs font-mono">Enter</kbd> to execute
          </p>
        </div>
      </div>

      {/* Sample Queries */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl">
        <h4 className="text-lg font-bold mb-4 text-white">Sample Queries</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sampleQueries.map((sample, index) => (
            <button
              key={index}
              onClick={() => insertSampleQuery(sample.query)}
              disabled={isExecuting}
              className="text-left p-4 border border-gray-700 rounded-xl hover:border-cyan-500 hover:bg-gray-800/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <div className="text-sm font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                {sample.label}
              </div>
              <div className="text-xs text-cyan-400 font-mono bg-gray-950 p-2 rounded border border-gray-800">
                {sample.query}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* SQL Injection Tips */}
      <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 rounded-2xl p-5 border border-yellow-700/50 shadow-xl">
        <h4 className="text-sm font-bold text-yellow-400 mb-3">
          Common SQL Injection Techniques
        </h4>
        <ul className="text-xs text-yellow-200 space-y-2">
          <li>• Use <code className="bg-yellow-700/50 px-2 py-0.5 rounded font-mono">OR '1'='1'</code> to make conditions always true</li>
          <li>• Use <code className="bg-yellow-700/50 px-2 py-0.5 rounded font-mono">--</code> or <code className="bg-yellow-700/50 px-2 py-0.5 rounded font-mono">/* */</code> to comment out rest of query</li>
          <li>• Use <code className="bg-yellow-700/50 px-2 py-0.5 rounded font-mono">UNION</code> to combine results from multiple tables</li>
          <li>• Try closing quotes with <code className="bg-yellow-700/50 px-2 py-0.5 rounded font-mono">'</code> or <code className="bg-yellow-700/50 px-2 py-0.5 rounded font-mono">"</code></li>
          <li>• Experiment with different quote types and combinations</li>
        </ul>
      </div>
    </div>
  )
}

export default SQLEditor