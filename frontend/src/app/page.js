'use client'

import { useState } from 'react'
import UploadSection from '../components/UploadSection'
import HistorySection from '../components/HistorySection'
import InsightDisplay from '../components/InsightDisplay'
import { FileText, History, Upload } from 'lucide-react'

export default function Home() {
  const [activeTab, setActiveTab] = useState('upload')
  const [currentInsight, setCurrentInsight] = useState(null)
  const [refreshHistory, setRefreshHistory] = useState(0)

  const handleUploadSuccess = (insight) => {
    setCurrentInsight(insight)
    setRefreshHistory(prev => prev + 1)
    setActiveTab('insight')
  }

  const handleViewInsight = (insight) => {
    setCurrentInsight(insight)
    setActiveTab('insight')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            AI Document Insight Tool
          </h1>
          <p className="text-gray-600 text-lg">
            Upload PDF documents and get intelligent insights powered by AI
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex items-center px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'upload'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload Document
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'history'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <History className="w-5 h-5 mr-2" />
              History
            </button>
            {currentInsight && (
              <button
                onClick={() => setActiveTab('insight')}
                className={`flex items-center px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                  activeTab === 'insight'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <FileText className="w-5 h-5 mr-2" />
                Current Insight
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {activeTab === 'upload' && (
            <UploadSection onUploadSuccess={handleUploadSuccess} />
          )}
          
          {activeTab === 'history' && (
            <HistorySection 
              onViewInsight={handleViewInsight}
              refreshTrigger={refreshHistory}
            />
          )}
          
          {activeTab === 'insight' && currentInsight && (
            <InsightDisplay insight={currentInsight} />
          )}
        </div>
      </div>
    </div>
  )
}