import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const Addtocart = () => {
  const { cart, updateQuantity, totalAmount, totalCount, clearCart } = useCart()
  const navigate = useNavigate()

  const handleCheckout = () => {
    if (cart.length === 0) return
    navigate('/makepayment', { state: { cart } })
  }

  return (
    <div className='cart-page cart-fullscreen'>
      <div className='container-fluid'>
        <div className='cart-hero-panel mb-5'>
          <div className='cart-hero-content'>
            <span className='cart-hero-badge'>Your choice is the esteemed selection</span>
            <h1>Thank you for choosing XP-Bird</h1>
            <p>Every product you selected is carefully wrapped in our digital cart. Review your order below, then checkout with confidence.</p>
          </div>
        </div>

        <h2 className='section-title text-center mb-4'>Your Cart</h2>

        {cart.length === 0 ? (
          <div className='cart-empty glass-product-card p-5 text-center'>
            <h4 className='mb-3'>Your cart is empty.</h4>
            <p className='mb-4 text-muted'>Add products to experience the full XP-Bird shopping flow.</p>
            <button className='neon-btn' onClick={() => navigate('/')}>Continue Shopping</button>
          </div>
        ) : (
          <div className='row gx-4 gy-4'>
            <div className='col-lg-8'>
              {cart.map((item) => (
                <div className='cart-item glass-product-card p-4 mb-4' key={item.id}>
                  <div className='d-flex align-items-center gap-4 flex-wrap'>
                    <img
                      src={`https://johnson.alwaysdata.net/static/images/${item.product_photo}`}
                      alt={item.product_name}
                      className='cart-item-img me-4'
                    />
                    <div className='flex-fill'>
                      <h5 className='product-title'>{item.product_name}</h5>
                      <p className='product-text mb-2'>Ksh {item.product_cost} each</p>
                      <div className='d-flex align-items-center gap-2 flex-wrap'>
                        <label className='mb-0'>Qty</label>
                        <input
                          type='number'
                          min='1'
                          value={item.quantity}
                          className='cart-quantity-input'
                          onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                        />
                        <button className='btn btn-outline-danger btn-sm' onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className='text-end'>
                      <p className='mb-2 text-muted'>Line total</p>
                      <p className='fs-5 mb-0'>Ksh <strong>{item.quantity * Number(item.product_cost)}</strong></p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className='col-lg-4'>
              <div className='cart-summary glass-product-card p-5'>
                <h5 className='mb-4'>Order Summary</h5>
                <div className='summary-row'>
                  <span>Total items</span>
                  <strong>{totalCount}</strong>
                </div>
                <div className='summary-row'>
                  <span>Product lines</span>
                  <strong>{cart.length}</strong>
                </div>
                <div className='summary-row summary-total'>
                  <span>Estimated total</span>
                  <strong>Ksh {totalAmount}</strong>
                </div>
                <button className='neon-btn w-100 mb-3' onClick={handleCheckout}>
                  Checkout
                </button>
                <button className='btn btn-outline-light w-100' onClick={clearCart}>
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Addtocart