import React, { useState } from 'react'
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon } from '@heroicons/react/24/solid'

function QueryResults({ result, history }) {
  const [activeTab, setActiveTab] = useState('result')

  if (!result && (!history || history.length === 0)) {
    return (
      <div className="text-center py-8 text-gray-400">
        No results yet. Execute a query to see results here.
      </div>
    )
  }

  return (
    <div>
      <div className="border-b border-gray-700 mb-4">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('result')}
            className={`py-2 px-1 border-b-2 font-semibold text-sm transition-all duration-200 ${
              activeTab === 'result'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            Current Result
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-2 px-1 border-b-2 font-semibold text-sm transition-all duration-200 ${
              activeTab === 'history'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            Query History ({history?.length || 0})
          </button>
        </nav>
      </div>

      {activeTab === 'result' && result && (
        <div>
          {/* Status */}
          <div className={`mb-4 p-4 rounded-xl flex items-start border ${
            result.isInjectionSuccessful 
              ? 'bg-gradient-to-r from-green-900/40 to-emerald-900/40 border-green-700/50 text-green-300' 
              : result.success 
              ? 'bg-gradient-to-r from-blue-900/40 to-cyan-900/40 border-blue-700/50 text-blue-300'
              : 'bg-gradient-to-r from-red-900/40 to-rose-900/40 border-red-700/50 text-red-300'
          }`}>
            {result.isInjectionSuccessful ? (
              <CheckCircleIcon className="h-6 w-6 mr-3 flex-shrink-0 mt-0.5 text-green-400" />
            ) : result.success ? (
              <InformationCircleIcon className="h-6 w-6 mr-3 flex-shrink-0 mt-0.5 text-blue-400" />
            ) : (
              <XCircleIcon className="h-6 w-6 mr-3 flex-shrink-0 mt-0.5 text-red-400" />
            )}
            <div>
              <p className="font-bold text-lg">
                {result.isInjectionSuccessful 
                  ? 'SQL Injection Successful!' 
                  : result.success 
                  ? 'Query Executed'
                  : 'Query Failed'}
              </p>
              {result.feedback && (
                <p className="text-sm mt-1">{result.feedback}</p>
              )}
            </div>
          </div>

          {/* Results Table */}
          {result.results && result.results.length > 0 && (
            <div className="overflow-x-auto rounded-xl border border-gray-700">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-900/50">
                  <tr>
                    {Object.keys(result.results[0]).map((column) => (
                      <th
                        key={column}
                        className="px-6 py-3 text-left text-xs font-bold text-cyan-400 uppercase tracking-wider"
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-gray-800/30 divide-y divide-gray-700">
                  {result.results.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-700/30 transition-colors">
                      {Object.values(row).map((value, cellIdx) => (
                        <td
                          key={cellIdx}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-300"
                        >
                          {value !== null ? String(value) : <span className="text-gray-500 italic">NULL</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Analysis */}
          {result.analysis && (
            <div className="mt-4 p-4 bg-gray-900/50 rounded-xl border border-gray-700">
              <h4 className="font-bold text-white mb-2">Technical Analysis</h4>
              <p className="text-sm text-gray-300 leading-relaxed">{result.analysis}</p>
            </div>
          )}

          {/* Educational Tip */}
          {result.educationalTip && (
            <div className="mt-4 p-4 bg-gradient-to-r from-cyan-900/40 to-blue-900/40 rounded-xl border border-cyan-700/50">
              <h4 className="font-bold text-cyan-400 mb-2">Learning Tip</h4>
              <p className="text-sm text-cyan-200 leading-relaxed">{result.educationalTip}</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && history && (
        <div className="space-y-4">
          {history.length === 0 ? (
            <p className="text-center text-gray-400">No query history yet.</p>
          ) : (
            history.map((item, idx) => (
              <div key={idx} className="border border-gray-700 rounded-xl p-4 bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm font-bold text-white">
                    Query #{history.length - idx}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    item.result?.isInjectionSuccessful 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30'
                      : item.result?.success
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/30'
                  }`}>
                    {item.result?.isInjectionSuccessful 
                      ? 'Successful Injection'
                      : item.result?.success
                      ? 'Executed'
                      : 'Failed'}
                  </span>
                </div>
                <pre className="text-sm bg-gray-950 p-3 rounded-lg overflow-x-auto text-cyan-400 border border-gray-800">
                  {item.query}
                </pre>
                {item.result?.rowCount !== undefined && (
                  <p className="text-xs text-gray-400 mt-2">
                    Rows returned: <span className="text-cyan-400 font-semibold">{item.result.rowCount}</span>
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default QueryResults