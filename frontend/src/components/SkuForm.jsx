import { useState, useEffect } from 'react'

function SkuForm({ sku, onSave, onClose }) {
  const [formData, setFormData] = useState({
    skuCode: '',
    name: '',
    description: '',
    styleName: '',
    colour: '',
    quantity: '',
    price: '',
    category: '',
    supplier: ''
  })

  useEffect(() => {
    if (sku) {
      setFormData({
        skuCode: sku.skuCode || '',
        name: sku.name || '',
        description: sku.description || '',
        styleName: sku.styleName || '',
        colour: sku.colour || '',
        quantity: sku.quantity || '',
        price: sku.price || '',
        category: sku.category || '',
        supplier: sku.supplier || ''
      })
    }
  }, [sku])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validation - now includes styleName and colour
    if (!formData.skuCode || !formData.name || !formData.styleName || !formData.colour || !formData.quantity || !formData.price || !formData.category) {
      alert('Please fill in all required fields (SKU Code, Name, Style Name, Colour, Quantity, Price, Category)')
      return
    }

    const skuData = {
      ...formData,
      quantity: parseInt(formData.quantity),
      price: parseFloat(formData.price)
    }

    onSave(skuData)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{sku ? 'Edit SKU' : 'Add New SKU'}</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>SKU Code *</label>
              <input
                type="text"
                name="skuCode"
                value={formData.skuCode}
                onChange={handleChange}
                placeholder="e.g., MEN-TS-001, WOM-JNS-002, KID-SRT-003, UGM-BXR-004"
                required
              />
            </div>

            <div className="form-group">
              <label>Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Men's Cotton T-Shirt, Women's Denim Jeans, Kids Shorts, Cotton Boxers"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="e.g., Premium cotton fabric, comfortable fit, size M, machine washable..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Style Name *</label>
                <input
                  type="text"
                  name="styleName"
                  value={formData.styleName}
                  onChange={handleChange}
                  placeholder="e.g., Casual, Formal, Sports, Ethnic, Party Wear"
                  required
                />
              </div>

              <div className="form-group">
                <label>Colour *</label>
                <input
                  type="text"
                  name="colour"
                  value={formData.colour}
                  onChange={handleChange}
                  placeholder="e.g., Navy Blue, White, Black, Red, Grey"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Quantity *</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                  required
                />
              </div>

              <div className="form-group">
                <label>Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g., Men's Shirts, Women's Dresses, Kids Wear, Undergarments"
                  required
                />
              </div>

              <div className="form-group">
                <label>Supplier</label>
                <input
                  type="text"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleChange}
                  placeholder="e.g., Fashion Hub Pvt Ltd, Garment Manufacturers"
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-success">
              {sku ? 'Update SKU' : 'Create SKU'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SkuForm
