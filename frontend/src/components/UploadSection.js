'use client'

import { useState, useRef } from 'react'
import axios from 'axios'
import { Upload, FileText, Loader2, AlertCircle } from 'lucide-react'

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.com' 
  : 'http://localhost:8001'

export default function UploadSection({ onUploadSuccess }) {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile)
      setError('')
    } else {
      setError('Please select a PDF file')
    }
  }

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile)
        setError('')
      } else {
        setError('Please select a PDF file')
      }
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first')
      return
    }

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await axios.post(`${API_BASE_URL}/upload-resume`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // 60 seconds timeout
      })

      onUploadSuccess(response.data)
      setFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err) {
      console.error('Upload error:', err)
      if (err.response?.data?.detail) {
        setError(err.response.data.detail)
      } else if (err.code === 'ECONNABORTED') {
        setError('Upload timeout. Please try again.')
      } else {
        setError('Failed to upload file. Please try again.')
      }
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="card max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Upload Your Document
        </h2>
        <p className="text-gray-600">
          Upload a PDF document to get AI-powered insights and analysis
        </p>
      </div>

      {/* Drag and Drop Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-blue-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-700 mb-2">
          Drag and drop your PDF here
        </p>
        <p className="text-gray-500 mb-4">or</p>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
        />
        
        <label
          htmlFor="file-upload"
          className="btn-primary cursor-pointer inline-block"
        >
          Choose File
        </label>
      </div>

      {/* Selected File Display */}
      {file && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-blue-600 mr-2" />
              <span className="font-medium text-blue-800">{file.name}</span>
              <span className="text-blue-600 ml-2">
                ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
            <button
              onClick={() => {
                setFile(null)
                if (fileInputRef.current) {
                  fileInputRef.current.value = ''
                }
              }}
              className="text-blue-600 hover:text-blue-800"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200 flex items-center">
          <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
          <span className="text-red-800">{error}</span>
        </div>
      )}

      {/* Upload Button */}
      <div className="mt-6 text-center">
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className={`btn-primary px-8 py-3 text-lg ${
            (!file || uploading) ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {uploading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin inline" />
              Processing...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5 mr-2 inline" />
              Upload & Analyze
            </>
          )}
        </button>
      </div>
    </div>
  )
}