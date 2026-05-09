import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const CartDropdown = () => {
  const { cart, totalAmount, totalCount } = useCart()
  const navigate = useNavigate()

  return (
    <div className='cart-dropdown'>
      {cart.length === 0 ? (
        <div className='cart-dropdown-empty'>
          <p>Your cart is empty.</p>
        </div>
      ) : (
        <>
          <div className='cart-dropdown-items'>
            {cart.slice(0, 4).map((item) => (
              <div className='cart-dropdown-item' key={item.id}>
                <div>
                  <p className='cart-dropdown-title'>{item.product_name}</p>
                  <small>{item.quantity} x Ksh {item.product_cost}</small>
                </div>
                <p className='cart-dropdown-total'>Ksh {item.quantity * Number(item.product_cost)}</p>
              </div>
            ))}
          </div>
          {cart.length > 4 && (
            <div className='cart-dropdown-more'>+{cart.length - 4} more product line(s)</div>
          )}
          <div className='cart-dropdown-summary'>
            <span>{totalCount} item{totalCount !== 1 ? 's' : ''}</span>
            <strong>Ksh {totalAmount}</strong>
          </div>
          <button className='neon-btn w-100' onClick={() => navigate('/cart')}>
            Open Cart
          </button>
        </>
      )}
    </div>
  )
}

export default CartDropdown
