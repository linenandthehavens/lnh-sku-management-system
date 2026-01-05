import { useState, useEffect } from 'react'
import axios from 'axios'
import SkuForm from './components/SkuForm'
import SkuTable from './components/SkuTable'
import Login from './components/Login'
import DeleteConfirmModal from './components/DeleteConfirmModal'
import { authService } from './utils/auth'

// ✅ Read backend URL from environment variable (set during build)
// Falls back to localhost for local development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
const API_ENDPOINT = `${API_BASE_URL}/api/skus`

// Debug logging to verify configuration
console.log('🚀 Frontend Configuration:')
console.log('API Base URL:', API_BASE_URL)
console.log('API Endpoint:', API_ENDPOINT)

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [skus, setSkus] = useState([])
  const [filteredSkus, setFilteredSkus] = useState([])
  const [categories, setCategories] = useState([])
  const [styleNames, setStyleNames] = useState([])
  const [colours, setColours] = useState([])
  const [sizes, setSizes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingSku, setEditingSku] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStyleName, setSelectedStyleName] = useState('all')
  const [selectedColour, setSelectedColour] = useState('all')
  const [selectedSize, setSelectedSize] = useState('all')
  
  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [skuToDelete, setSkuToDelete] = useState(null)

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
  }, [skus, searchTerm, selectedCategory, selectedStyleName, selectedColour, selectedSize])

  const loadSkus = async () => {
    try {
      console.log('📡 Fetching SKUs from:', API_ENDPOINT)
      const response = await axios.get(API_ENDPOINT, {
        headers: authService.getAuthHeader()
      })
      console.log('✅ Received', response.data.length, 'SKUs')
      setSkus(response.data)
      loadStyleNamesColoursAndSizes(response.data)
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

  const loadStyleNamesColoursAndSizes = (skuData) => {
    // Extract unique style names
    const uniqueStyleNames = [...new Set(skuData.map(sku => sku.styleName).filter(Boolean))]
    setStyleNames(uniqueStyleNames.sort())
    
    // Extract unique colours
    const uniqueColours = [...new Set(skuData.map(sku => sku.colour).filter(Boolean))]
    setColours(uniqueColours.sort())
    
    // Extract unique sizes
    const uniqueSizes = [...new Set(skuData.map(sku => sku.size).filter(Boolean))]
    // Sort sizes in proper order: S, M, L, XL, XXL, XXXL
    const sizeOrder = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL']
    const sortedSizes = uniqueSizes.sort((a, b) => {
      return sizeOrder.indexOf(a) - sizeOrder.indexOf(b)
    })
    setSizes(sortedSizes)
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
    setSizes([])
  }

  const filterSkus = () => {
    let filtered = skus

    if (searchTerm) {
      filtered = filtered.filter(sku =>
        sku.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sku.skuCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sku.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sku.styleName && sku.styleName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (sku.colour && sku.colour.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (sku.size && sku.size.toLowerCase().includes(searchTerm.toLowerCase()))
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

    if (selectedSize !== 'all') {
      filtered = filtered.filter(sku => sku.size === selectedSize)
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

  const handleDeleteSku = (skuOrId) => {
    // Support both old (just ID) and new (full SKU object) formats
    let sku;
    
    if (typeof skuOrId === 'object' && skuOrId !== null) {
      // New format: full SKU object passed
      sku = skuOrId;
      console.log('✅ Received full SKU object:', sku);
    } else {
      // Old format: just ID passed - find the full SKU object
      sku = skus.find(s => s.id === skuOrId);
      console.log('⚠️ Received only ID, found SKU:', sku);
    }
    
    console.log('📋 SKU to delete:', {
      id: sku?.id,
      name: sku?.name,
      skuCode: sku?.skuCode
    });
    
    // Show custom delete confirmation modal
    setSkuToDelete(sku);
    setShowDeleteModal(true);
  }

  const confirmDelete = async () => {
    if (!skuToDelete) return

    try {
      await axios.delete(`${API_ENDPOINT}/${skuToDelete.id}`, {
        headers: authService.getAuthHeader()
      })
      
      // Close modal and clear state
      setShowDeleteModal(false)
      setSkuToDelete(null)
      
      // Reload SKUs
      loadSkus()
    } catch (error) {
      console.error('Error deleting SKU:', error)
      if (error.response?.status === 401) {
        handleLogout()
      } else {
        alert('Failed to delete SKU')
      }
      
      // Close modal even on error
      setShowDeleteModal(false)
      setSkuToDelete(null)
    }
  }

  const cancelDelete = () => {
    setShowDeleteModal(false)
    setSkuToDelete(null)
  }

  const handleSaveSku = async (skuData) => {
    try {
      if (editingSku) {
        await axios.put(`${API_ENDPOINT}/${editingSku.id}`, skuData, {
          headers: authService.getAuthHeader()
        })
      } else {
        await axios.post(API_ENDPOINT, skuData, {
          headers: authService.getAuthHeader()
        })
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
          <div className="loading">⏳ Loading SKU data...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="container">
        {/* Enhanced Header with Logo */}
        <header className="header">
          <div className="header-top">
            <div className="header-top-content">
              <div className="header-branding">
                {/* Logo Container */}
                <div className="logo-container">
                  <img src="/logo.png" alt="Linen & The Havens" className="header-logo" />
                </div>
                
                {/* Company Title */}
                <div className="header-title-group">
                  <h1>Linen & The Havens</h1>
                  <p className="header-subtitle">Private Limited</p>
                  <p className="header-tagline">SKU Management System</p>
                </div>
              </div>
              
              {/* Logout Button */}
              <button className="btn btn-logout" onClick={handleLogout}>
                🚪 Sign Out
              </button>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="header-stats">
            <div className="stat-card">
              <div className="stat-label">📦 Total Items</div>
              <div className="stat-value">{stats.totalItems}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">💰 Total Value</div>
              <div className="stat-value">₹{stats.totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">⚠️ Low Stock</div>
              <div className="stat-value" style={{ color: 'var(--color-error)' }}>{stats.lowStock}</div>
            </div>
          </div>
        </header>

        {/* Controls */}
        <div className="controls">
          <div className="controls-row">
            {/* Search and Add Button */}
            <div className="controls-main">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="🔍 Search by name, SKU, category, style, colour, or size..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="btn btn-primary" onClick={handleAddSku}>
                ➕ Add SKU
              </button>
            </div>
            
            {/* Filters */}
            <div className="filters-row">
              <div className="filter-group">
                <label>📂 Category</label>
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
                <label>✨ Style</label>
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
                <label>🎨 Colour</label>
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
              
              <div className="filter-group">
                <label>📏 Size</label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                >
                  <option value="all">All Sizes</option>
                  {sizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* SKU Table */}
        <SkuTable
          skus={filteredSkus}
          onEdit={handleEditSku}
          onDelete={handleDeleteSku}
        />

        {/* SKU Form Modal */}
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

        {/* Custom Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={showDeleteModal}
          skuName={skuToDelete?.name}
          skuCode={skuToDelete?.skuCode}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      </div>
    </div>
  )
}

export default App
