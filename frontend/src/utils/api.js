// API utility functions
const API_BASE_URL = process.env.NODE_ENV === 'production'
    ? '/api'
    : 'http://localhost:8001'

export const testConnection = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/`)
        const data = await response.json()
        return { success: true, data }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

export { API_BASE_URL }