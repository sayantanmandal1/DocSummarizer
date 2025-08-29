'use client'

import { FileText, Calendar, Brain, Hash, BarChart3, CheckCircle } from 'lucide-react'

export default function InsightDisplay({ insight }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Document Insight
        </h2>
        <p className="text-gray-600">
          AI-powered analysis of your uploaded document
        </p>
      </div>

      <div className="card">
        {/* Document Info Header */}
        <div className="border-b border-gray-200 pb-4 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {insight.filename}
              </h3>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-1" />
                Uploaded on {formatDate(insight.upload_date)}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {insight.word_count}
                </div>
                <div className="text-xs text-gray-500">Words</div>
              </div>
              
              <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                insight.is_ai_generated 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-orange-100 text-orange-800'
              }`}>
                {insight.is_ai_generated ? (
                  <>
                    <Brain className="w-4 h-4 mr-1" />
                    AI Generated
                  </>
                ) : (
                  <>
                    <Hash className="w-4 h-4 mr-1" />
                    Word Analysis
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Type Indicator */}
        <div className="mb-6">
          {insight.is_ai_generated ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <h4 className="font-semibold text-green-800">AI Analysis Complete</h4>
              </div>
              <p className="text-green-700 text-sm">
                This summary was generated using advanced AI to provide you with key insights 
                and highlights from your document.
              </p>
            </div>
          ) : (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <BarChart3 className="w-5 h-5 text-orange-600 mr-2" />
                <h4 className="font-semibold text-orange-800">Fallback Analysis</h4>
              </div>
              <p className="text-orange-700 text-sm">
                AI service was unavailable, so we&apos;ve provided a word frequency analysis 
                of your document instead.
              </p>
            </div>
          )}
        </div>

        {/* Summary/Analysis Content */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="font-semibold text-gray-800 mb-3">
            {insight.is_ai_generated ? 'AI Summary' : 'Word Frequency Analysis'}
          </h4>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {insight.summary}
            </p>
          </div>
        </div>

        {/* Additional Metadata */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="font-semibold text-blue-800">Document ID</div>
              <div className="text-blue-600">#{insight.id}</div>
            </div>
            
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="font-semibold text-purple-800">Processing Type</div>
              <div className="text-purple-600">
                {insight.is_ai_generated ? 'AI Powered' : 'Statistical'}
              </div>
            </div>
            
            <div className="text-center p-3 bg-indigo-50 rounded-lg">
              <div className="font-semibold text-indigo-800">Content Length</div>
              <div className="text-indigo-600">{insight.word_count} words</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}