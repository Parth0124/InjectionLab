import React, { useState } from 'react'
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon } from '@heroicons/react/24/solid'

function QueryResults({ result, history }) {
  const [activeTab, setActiveTab] = useState('result')

  if (!result && (!history || history.length === 0)) {
    return (
      <div className="text-center py-8 text-gray-500">
        No results yet. Execute a query to see results here.
      </div>
    )
  }

  return (
    <div>
      <div className="border-b border-gray-200 mb-4">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('result')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'result'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Current Result
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'history'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Query History ({history?.length || 0})
          </button>
        </nav>
      </div>

      {activeTab === 'result' && result && (
        <div>
          {/* Status */}
          <div className={`mb-4 p-3 rounded-lg flex items-start ${
            result.isInjectionSuccessful 
              ? 'bg-green-50 text-green-800' 
              : result.success 
              ? 'bg-blue-50 text-blue-800'
              : 'bg-red-50 text-red-800'
          }`}>
            {result.isInjectionSuccessful ? (
              <CheckCircleIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            ) : result.success ? (
              <InformationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircleIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-medium">
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
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {Object.keys(result.results[0]).map((column) => (
                      <th
                        key={column}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {result.results.map((row, idx) => (
                    <tr key={idx}>
                      {Object.values(row).map((value, cellIdx) => (
                        <td
                          key={cellIdx}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                        >
                          {value !== null ? String(value) : 'NULL'}
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
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-1">Technical Analysis</h4>
              <p className="text-sm text-gray-600">{result.analysis}</p>
            </div>
          )}

          {/* Educational Tip */}
          {result.educationalTip && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-1">Learning Tip</h4>
              <p className="text-sm text-blue-700">{result.educationalTip}</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && history && (
        <div className="space-y-4">
          {history.length === 0 ? (
            <p className="text-center text-gray-500">No query history yet.</p>
          ) : (
            history.map((item, idx) => (
              <div key={idx} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    Query #{history.length - idx}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    item.result?.isInjectionSuccessful 
                      ? 'bg-green-100 text-green-800'
                      : item.result?.success
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.result?.isInjectionSuccessful 
                      ? 'Successful Injection'
                      : item.result?.success
                      ? 'Executed'
                      : 'Failed'}
                  </span>
                </div>
                <pre className="text-sm bg-gray-50 p-2 rounded overflow-x-auto">
                  {item.query}
                </pre>
                {item.result?.rowCount !== undefined && (
                  <p className="text-xs text-gray-600 mt-2">
                    Rows returned: {item.result.rowCount}
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