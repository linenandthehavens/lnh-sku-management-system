import { useState, useEffect } from 'react'
import axios from 'axios'
import SkuForm from './components/SkuForm'
import SkuTable from './components/SkuTable'
import Login from './components/Login'
import { authService } from './utils/auth'

// ✅ Read backend URL from environment variable (set during build)
// Falls back to localhost for local development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
const API_ENDPOINT = `${API_BASE_URL}/api/skus`

// Debug logging to verify configuration
console.log('🚀 Frontend Configuration:')
console.log('API Base URL:', API_BASE_URL)
console.log('API Endpoint:', API_ENDPOINT)
console.log('Environment:', import.meta.env.MODE)

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [skus, setSkus] = useState([])
  const [filteredSkus, setFilteredSkus] = useState([])
  const [categories, setCategories] = useState([])
  const [styleNames, setStyleNames] = useState([])
  const [colours, setColours] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingSku, setEditingSku] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStyleName, setSelectedStyleName] = useState('all')
  const [selectedColour, setSelectedColour] = useState('all')

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated()
      setIsAuthenticated(authenticated)
      if (!authenticated) {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      loadSkus()
      loadCategories()
    }
  }, [isAuthenticated])

  useEffect(() => {
    filterSkus()
  }, [skus, searchTerm, selectedCategory, selectedStyleName, selectedColour])

  const loadSkus = async () => {
    try {
      console.log('📡 Fetching SKUs from:', API_ENDPOINT)
      const response = await axios.get(API_ENDPOINT, {
        headers: authService.getAuthHeader()
      })
      console.log('✅ Received', response.data.length, 'SKUs')
      setSkus(response.data)
      loadStyleNamesAndColours(response.data)
      setLoading(false)
    } catch (error) {
      console.error('❌ Error loading SKUs:', error)
      console.error('Request URL was:', API_ENDPOINT)
      if (error.response?.status === 401) {
        handleLogout()
      }
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const response = await axios.get(`${API_ENDPOINT}/categories`, {
        headers: authService.getAuthHeader()
      })
      setCategories(response.data)
    } catch (error) {
      console.error('Error loading categories:', error)
      if (error.response?.status === 401) {
        handleLogout()
      }
    }
  }

  const loadStyleNamesAndColours = (skuData) => {
    // Extract unique style names
    const uniqueStyleNames = [...new Set(skuData.map(sku => sku.styleName).filter(Boolean))]
    setStyleNames(uniqueStyleNames.sort())
    
    // Extract unique colours
    const uniqueColours = [...new Set(skuData.map(sku => sku.colour).filter(Boolean))]
    setColours(uniqueColours.sort())
  }

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
    setLoading(true)
  }

  const handleLogout = () => {
    authService.removeToken()
    setIsAuthenticated(false)
    setSkus([])
    setFilteredSkus([])
    setCategories([])
    setStyleNames([])
    setColours([])
  }

  const filterSkus = () => {
    let filtered = skus

    if (searchTerm) {
      filtered = filtered.filter(sku =>
        sku.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sku.skuCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sku.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sku.styleName && sku.styleName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (sku.colour && sku.colour.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(sku => sku.category === selectedCategory)
    }

    if (selectedStyleName !== 'all') {
      filtered = filtered.filter(sku => sku.styleName === selectedStyleName)
    }

    if (selectedColour !== 'all') {
      filtered = filtered.filter(sku => sku.colour === selectedColour)
    }

    setFilteredSkus(filtered)
  }

  const handleAddSku = () => {
    setEditingSku(null)
    setShowModal(true)
  }

  const handleEditSku = (sku) => {
    setEditingSku(sku)
    setShowModal(true)
  }

  const handleDeleteSku = async (id) => {
    if (window.confirm('Are you sure you want to delete this SKU?')) {
      try {
        await axios.delete(`${API_ENDPOINT}/${id}`, {
          headers: authService.getAuthHeader()
        })
        loadSkus()
      } catch (error) {
        console.error('Error deleting SKU:', error)
        if (error.response?.status === 401) {
          handleLogout()
        } else {
          alert('Failed to delete SKU')
        }
      }
    }
  }

  const handleSaveSku = async (skuData) => {
    // Debug: Log what we're about to send
    console.log('=== App.jsx - Data to be sent to backend ===')
    console.log('Full skuData:', JSON.stringify(skuData, null, 2))
    console.log('API Endpoint:', API_ENDPOINT)
    console.log('===========================================')
    
    try {
      if (editingSku) {
        const response = await axios.put(`${API_ENDPOINT}/${editingSku.id}`, skuData, {
          headers: authService.getAuthHeader()
        })
        console.log('PUT Response:', response.data)
      } else {
        const response = await axios.post(API_ENDPOINT, skuData, {
          headers: authService.getAuthHeader()
        })
        console.log('POST Response:', response.data)
      }
      setShowModal(false)
      setEditingSku(null)
      loadSkus()
      loadCategories()
    } catch (error) {
      console.error('Error saving SKU:', error)
      if (error.response?.status === 401) {
        handleLogout()
      } else if (error.response?.data?.message) {
        alert(error.response.data.message)
      } else {
        alert('Failed to save SKU')
      }
    }
  }

  const calculateStats = () => {
    const totalItems = skus.length
    const totalValue = skus.reduce((sum, sku) => sum + (sku.price * sku.quantity), 0)
    const lowStock = skus.filter(sku => sku.quantity < 50).length

    return { totalItems, totalValue, lowStock }
  }

  const stats = calculateStats()

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />
  }

  if (loading) {
    return (
      <div className="app">
        <div className="container">
          <div className="loading">Loading SKU data...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <div className="header-top">
            <div className="header-branding">
              <img src="/logo.png" alt="Linen & The Havens" className="header-logo" />
              <div className="header-title-group">
                <h1>Linen & The Havens</h1>
                <p className="header-subtitle">SKU Management System</p>
              </div>
            </div>
            <button className="btn btn-logout" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
          
          <div className="header-stats">
            <div className="stat-card">
              <div className="stat-label">Total Items</div>
              <div className="stat-value">{stats.totalItems}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Value</div>
              <div className="stat-value">₹{stats.totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Low Stock</div>
              <div className="stat-value" style={{ color: 'var(--color-error)' }}>{stats.lowStock}</div>
            </div>
          </div>
        </header>

        <div className="controls">
          <div className="controls-row">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by name, SKU, category, style, or colour..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label>Category:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Style:</label>
              <select
                value={selectedStyleName}
                onChange={(e) => setSelectedStyleName(e.target.value)}
              >
                <option value="all">All Styles</option>
                {styleNames.map(style => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Colour:</label>
              <select
                value={selectedColour}
                onChange={(e) => setSelectedColour(e.target.value)}
              >
                <option value="all">All Colours</option>
                {colours.map(colour => (
                  <option key={colour} value={colour}>{colour}</option>
                ))}
              </select>
            </div>
            <button className="btn btn-primary" onClick={handleAddSku}>
              + Add SKU
            </button>
          </div>
        </div>

        <SkuTable
          skus={filteredSkus}
          onEdit={handleEditSku}
          onDelete={handleDeleteSku}
        />

        {showModal && (
          <SkuForm
            sku={editingSku}
            onSave={handleSaveSku}
            onClose={() => {
              setShowModal(false)
              setEditingSku(null)
            }}
          />
        )}
      </div>
    </div>
  )
}

export default App
