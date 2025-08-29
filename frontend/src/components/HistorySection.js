'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { History, FileText, Calendar, Eye, Loader2, AlertCircle, Brain, Hash } from 'lucide-react'

const API_BASE_URL = 'http://localhost:8001'

export default function HistorySection({ onViewInsight, refreshTrigger }) {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE_URL}/insights`)
      setDocuments(response.data.documents || [])
      setError('')
    } catch (err) {
      console.error('Error fetching documents:', err)
      setError('Failed to load document history')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [refreshTrigger])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const truncateSummary = (summary, maxLength = 150) => {
    if (summary.length <= maxLength) return summary
    return summary.substring(0, maxLength) + '...'
  }

  if (loading) {
    return (
      <div className="card text-center">
        <Loader2 className="w-8 h-8 text-blue-600 mx-auto mb-4 animate-spin" />
        <p className="text-gray-600">Loading document history...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card text-center">
        <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-4" />
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={fetchDocuments} className="btn-primary">
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <History className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Document History
        </h2>
        <p className="text-gray-600">
          View all your previously uploaded documents and their insights
        </p>
      </div>

      {documents.length === 0 ? (
        <div className="card text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            No documents yet
          </h3>
          <p className="text-gray-500">
            Upload your first PDF document to see it appear here
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {documents.map((doc) => (
            <div key={doc.id} className="card hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <FileText className="w-5 h-5 text-blue-600 mr-2" />
                    <h3 className="font-semibold text-gray-800 truncate">
                      {doc.filename}
                    </h3>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(doc.upload_date)}
                    </div>
                    <div className="flex items-center">
                      {doc.is_ai_generated ? (
                        <>
                          <Brain className="w-4 h-4 mr-1 text-green-600" />
                          <span className="text-green-600">AI Summary</span>
                        </>
                      ) : (
                        <>
                          <Hash className="w-4 h-4 mr-1 text-orange-600" />
                          <span className="text-orange-600">Word Analysis</span>
                        </>
                      )}
                    </div>
                    <div>
                      {doc.word_count} words
                    </div>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed">
                    {truncateSummary(doc.summary)}
                  </p>
                </div>
                
                <button
                  onClick={() => onViewInsight(doc)}
                  className="ml-4 btn-primary flex items-center"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {documents.length > 0 && (
        <div className="text-center">
          <button
            onClick={fetchDocuments}
            className="btn-secondary"
          >
            Refresh History
          </button>
        </div>
      )}
    </div>
  )
}