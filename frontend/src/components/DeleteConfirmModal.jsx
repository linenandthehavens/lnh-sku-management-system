import React from 'react'
import './DeleteConfirmModal.css'

function DeleteConfirmModal({ isOpen, skuName, skuCode, onConfirm, onCancel }) {
  if (!isOpen) return null

  console.log('🗑️ DeleteConfirmModal props:', {
    isOpen,
    skuName,
    skuCode
  });

  return (
    <div className="delete-modal-overlay" onClick={onCancel}>
      <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
        {/* Warning Icon */}
        <div className="delete-modal-icon">
          <div className="delete-icon-circle">
            <span className="delete-icon">⚠️</span>
          </div>
        </div>

        {/* Modal Content */}
        <div className="delete-modal-content">
          <h2 className="delete-modal-title">Delete SKU?</h2>
          
          <div className="delete-modal-sku-info">
            <div className="delete-sku-detail">
              <span className="delete-label">Product:</span>
              <span className="delete-value">{skuName || 'N/A'}</span>
            </div>
            <div className="delete-sku-detail">
              <span className="delete-label">SKU Code:</span>
              <span className="delete-value sku-code-delete">{skuCode || 'N/A'}</span>
            </div>
          </div>

          <p className="delete-modal-message">
            This action cannot be undone. The SKU will be permanently removed from your inventory.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="delete-modal-actions">
          <button 
            className="btn btn-cancel"
            onClick={onCancel}
          >
            ✖️ Cancel
          </button>
          <button 
            className="btn btn-delete-confirm"
            onClick={onConfirm}
          >
            🗑️ Yes, Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmModal
