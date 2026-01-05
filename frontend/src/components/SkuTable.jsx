import React from 'react'

function SkuTable({ skus, onEdit, onDelete }) {
  const getCategoryClass = (category) => {
    return `category-${category.toLowerCase().replace(/\s+/g, '-').replace(/'/g, '')}`
  }

  const getStockStatus = (quantity) => {
    if (quantity < 50) return 'low'
    if (quantity < 100) return 'medium'
    return 'high'
  }

  const getStockText = (quantity) => {
    if (quantity < 50) return 'Low Stock'
    if (quantity < 100) return 'Medium'
    return 'In Stock'
  }

  if (skus.length === 0) {
    return (
      <div className="table-container">
        <div className="empty-state">
          <h3>📦 No SKUs Found</h3>
          <p>Try adjusting your search or filters, or add a new SKU to get started.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="table-container">
      {/* Desktop Table View */}
      <table className="sku-table">
        <thead>
          <tr>
            <th>SKU Code</th>
            <th>Product Name</th>
            <th>Style</th>
            <th>Color</th>
            <th>Size</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Price (₹)</th>
            <th>Supplier</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {skus.map((sku, index) => (
            <tr key={sku.id} style={{ animationDelay: `${index * 0.05}s` }}>
              <td>
                <span className="sku-code">{sku.skuCode}</span>
              </td>
              <td>
                <strong>{sku.name}</strong>
                {sku.description && (
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                    {sku.description.length > 50 
                      ? `${sku.description.substring(0, 50)}...` 
                      : sku.description}
                  </div>
                )}
              </td>
              <td>
                <span className="style-name">{sku.styleName || '—'}</span>
              </td>
              <td>
                {sku.colour ? (
                  <span className="color-badge">
                    <span className="color-dot" style={{ backgroundColor: sku.colour.toLowerCase() }}></span>
                    {sku.colour}
                  </span>
                ) : '—'}
              </td>
              <td>
                <span className="size-badge">{sku.size || '—'}</span>
              </td>
              <td>
                <span className={`category-badge ${getCategoryClass(sku.category)}`}>
                  {sku.category}
                </span>
              </td>
              <td>
                <div className="stock-status">
                  <span className={`stock-indicator stock-${getStockStatus(sku.quantity)}`}></span>
                  <div>
                    <div style={{ fontWeight: 600 }}>{sku.quantity}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                      {getStockText(sku.quantity)}
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <span className="price">₹{sku.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </td>
              <td>{sku.supplier || '—'}</td>
              <td>
                <div className="actions">
                  <button 
                    className="btn btn-sm btn-secondary"
                    onClick={() => onEdit(sku)}
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => onDelete(sku)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile Card View */}
      <div className="sku-cards">
        {skus.map((sku, index) => (
          <div key={sku.id} className="sku-card" style={{ animationDelay: `${index * 0.05}s` }}>
            <div className="sku-card-header">
              <div className="sku-card-title">
                <h3>{sku.name}</h3>
                <span className="sku-code">{sku.skuCode}</span>
              </div>
            </div>

            <div className="sku-card-body">
              {sku.description && (
                <div className="sku-card-row">
                  <span className="sku-card-value" style={{ fontStyle: 'italic', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                    {sku.description.length > 80 
                      ? `${sku.description.substring(0, 80)}...` 
                      : sku.description}
                  </span>
                </div>
              )}

              <div className="sku-card-row">
                <span className="sku-card-label">Style</span>
                <span className="style-name">{sku.styleName || '—'}</span>
              </div>

              <div className="sku-card-row">
                <span className="sku-card-label">Color</span>
                {sku.colour ? (
                  <span className="color-badge">
                    <span className="color-dot" style={{ backgroundColor: sku.colour.toLowerCase() }}></span>
                    {sku.colour}
                  </span>
                ) : <span>—</span>}
              </div>

              <div className="sku-card-row">
                <span className="sku-card-label">Size</span>
                <span className="size-badge">{sku.size || '—'}</span>
              </div>

              <div className="sku-card-row">
                <span className="sku-card-label">Category</span>
                <span className={`category-badge ${getCategoryClass(sku.category)}`}>
                  {sku.category}
                </span>
              </div>

              <div className="sku-card-row">
                <span className="sku-card-label">Quantity</span>
                <div className="stock-status">
                  <span className={`stock-indicator stock-${getStockStatus(sku.quantity)}`}></span>
                  <div>
                    <div style={{ fontWeight: 600 }}>{sku.quantity}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                      {getStockText(sku.quantity)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="sku-card-row">
                <span className="sku-card-label">Price</span>
                <span className="price">₹{sku.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>

              {sku.supplier && (
                <div className="sku-card-row">
                  <span className="sku-card-label">Supplier</span>
                  <span className="sku-card-value">{sku.supplier}</span>
                </div>
              )}
            </div>

            <div className="sku-card-actions">
              <button 
                className="btn btn-sm btn-secondary"
                onClick={() => onEdit(sku)}
              >
                ✏️ Edit
              </button>
              <button 
                className="btn btn-sm btn-danger"
                onClick={() => onDelete(sku)}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SkuTable
