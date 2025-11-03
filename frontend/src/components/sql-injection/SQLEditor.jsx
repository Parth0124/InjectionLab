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
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">SQL Query Editor</h3>
          <div className="flex space-x-2">
            <button
              onClick={handleClear}
              className="btn-secondary flex items-center text-sm"
              disabled={isExecuting}
            >
              <ArrowPathIcon className="h-4 w-4 mr-1" />
              Clear
            </button>
            <button
              onClick={handleExecute}
              disabled={!query.trim() || isExecuting}
              className="btn-primary flex items-center text-sm"
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

        <div className="border rounded-lg overflow-hidden" onKeyDown={handleKeyDown}>
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

        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-900 mb-2">
            <strong>Tip:</strong> Try different SQL injection techniques to bypass authentication or extract data.
          </p>
          <p className="text-xs text-blue-700">
            Press <kbd className="px-1 py-0.5 bg-blue-200 rounded text-xs">Ctrl</kbd> + <kbd className="px-1 py-0.5 bg-blue-200 rounded text-xs">Enter</kbd> to execute
          </p>
        </div>
      </div>

      {/* Sample Queries */}
      <div className="card">
        <h4 className="text-sm font-semibold mb-3">Sample Queries</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {sampleQueries.map((sample, index) => (
            <button
              key={index}
              onClick={() => insertSampleQuery(sample.query)}
              disabled={isExecuting}
              className="text-left p-3 border rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <div className="text-sm font-medium text-gray-900 mb-1">
                {sample.label}
              </div>
              <div className="text-xs text-gray-600 font-mono bg-gray-50 p-1 rounded">
                {sample.query}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* SQL Injection Tips */}
      <div className="card bg-yellow-50 border-yellow-200">
        <h4 className="text-sm font-semibold text-yellow-900 mb-2">
          Common SQL Injection Techniques
        </h4>
        <ul className="text-xs text-yellow-800 space-y-1">
          <li>• Use <code className="bg-yellow-200 px-1 rounded">OR '1'='1'</code> to make conditions always true</li>
          <li>• Use <code className="bg-yellow-200 px-1 rounded">--</code> or <code className="bg-yellow-200 px-1 rounded">/* */</code> to comment out rest of query</li>
          <li>• Use <code className="bg-yellow-200 px-1 rounded">UNION</code> to combine results from multiple tables</li>
          <li>• Try closing quotes with <code className="bg-yellow-200 px-1 rounded">'</code> or <code className="bg-yellow-200 px-1 rounded">"</code></li>
          <li>• Experiment with different quote types and combinations</li>
        </ul>
      </div>
    </div>
  )
}

export default SQLEditor