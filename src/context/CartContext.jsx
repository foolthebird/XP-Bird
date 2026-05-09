import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = window.localStorage.getItem('xp_bird_cart')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    window.localStorage.setItem('xp_bird_cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (product) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id)
      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...current, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId) => {
    setCart((current) => current.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId)
      return
    }
    setCart((current) =>
      current.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => setCart([])

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.quantity * Number(item.product_cost ?? item.cost ?? 0),
    0
  )

  const value = useMemo(
    () => ({ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalCount, totalAmount }),
    [cart, totalCount, totalAmount]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
