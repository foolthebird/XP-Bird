import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { useState } from 'react'
import Signup from './components/Signup'
import Signin from './components/Signin'
import Addproducts from './components/Addproducts'
import Getproducts from './components/Getproducts'
import Homepage from './components/Homepage'
import AboutUs from './components/AboutUs'
import Makepayment from './components/Makepayment'
import Addtocart from './components/Addtocart'
import Chatbot from './components/Chatbot'
import ProductDetails from './components/ProductDetails'
import { CartProvider, useCart } from './context/CartContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { BrowserRouter, Link, NavLink, Route, Routes } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Home', icon: 'home', end: true },
  { to: '/products', label: 'Shop', icon: 'shop' },
  { to: '/about', label: 'About Us', icon: 'info' },
  { to: '/cart', label: 'Cart', icon: 'cart' },
  { to: '/addproduct', label: 'Sell', icon: 'plus' }
]

function Icon({ name, className = 'nav-icon' }) {
  const paths = {
    home: 'M3 10.8 12 3l9 7.8v9.45a.75.75 0 0 1-.75.75h-5.1v-5.8h-6.3V21h-5.1a.75.75 0 0 1-.75-.75V10.8Z',
    shop: 'M4.8 4h14.4l1.3 6.3a3.1 3.1 0 0 1-4.8 3.2 3.12 3.12 0 0 1-3.7 0 3.12 3.12 0 0 1-3.7 0 3.1 3.1 0 0 1-4.8-3.2L4.8 4Zm.7 10.3V21h13v-6.7a4.4 4.4 0 0 1-2.8-.7 4.55 4.55 0 0 1-3.7 0 4.55 4.55 0 0 1-3.7 0 4.4 4.4 0 0 1-2.8.7Z',
    info: 'M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Zm-1-10v6h2v-6h-2Zm0-4v2h2V7h-2Z',
    plus: 'M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z',
    cart: 'M7.2 18.8a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4Zm9.2 0a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4ZM4.2 4H2V2h3.7l.8 3.4H22l-2.1 8.2a3 3 0 0 1-2.9 2.3H8.2a3 3 0 0 1-2.9-2.4L4.2 4Zm2.8 3.4 1.1 5.7a1 1 0 0 0 1 .8H17a1 1 0 0 0 1-.8l1.5-5.7H7Z',
    user: 'M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm-8 9a8 8 0 0 1 16 0H4Z',
    menu: 'M4 6h16v2H4V6Zm0 5h16v2H4v-2Zm0 5h16v2H4v-2Z',
    close: 'm6.4 5 12.6 12.6-1.4 1.4L5 6.4 6.4 5Zm12.6 1.4L6.4 19 5 17.6 17.6 5 19 6.4Z'
  }

  return (
    <svg viewBox='0 0 24 24' aria-hidden='true' className={className}>
      <path fill='currentColor' d={paths[name]} />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg viewBox='0 0 24 24' aria-hidden='true' className='social-icon-svg'>
      <path
        fill='currentColor'
        d='M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5a4.25 4.25 0 0 0 4.25 4.25h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5a4.25 4.25 0 0 0-4.25-4.25h-8.5Zm8.88 1.75a1.12 1.12 0 1 1 0 2.25 1.12 1.12 0 0 1 0-2.25ZM12 6.5A5.5 5.5 0 1 1 6.5 12 5.5 5.5 0 0 1 12 6.5Zm0 1.5A4 4 0 1 0 16 12a4 4 0 0 0-4-4Z'
      />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg viewBox='0 0 24 24' aria-hidden='true' className='social-icon-svg'>
      <path
        fill='currentColor'
        d='M12 2a9.9 9.9 0 0 0-8.56 14.88L2 22l5.3-1.39A10 10 0 1 0 12 2Zm0 18.2a8.18 8.18 0 0 1-4.17-1.14l-.3-.17-3.14.82.84-3.05-.2-.31A8.19 8.19 0 1 1 12 20.2Zm4.49-6.12c-.24-.12-1.42-.7-1.64-.78s-.38-.12-.54.12-.62.78-.76.94-.28.18-.52.06a6.67 6.67 0 0 1-1.96-1.21 7.28 7.28 0 0 1-1.35-1.68c-.14-.24 0-.37.1-.49s.24-.28.36-.42a1.6 1.6 0 0 0 .24-.4.44.44 0 0 0 0-.42c-.06-.12-.54-1.3-.74-1.78s-.39-.4-.54-.41h-.46a.9.9 0 0 0-.66.3 2.73 2.73 0 0 0-.84 2 4.77 4.77 0 0 0 1 2.54A10.84 10.84 0 0 0 13 16.72a11.87 11.87 0 0 0 1.58.58 3.79 3.79 0 0 0 1.74.11 2.86 2.86 0 0 0 1.88-1.32 2.32 2.32 0 0 0 .16-1.32c-.06-.1-.22-.16-.46-.28Z'
      />
    </svg>
  )
}

function AppNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { totalCount } = useCart()
  const { user, logout, isAuthenticated } = useAuth()
  const userName = user?.username || user?.email || 'Account'

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
  }

  const toggleMenu = () => {
    setIsMenuOpen((current) => !current)
  }

  return (
    <header className='main-navbar'>
      <div className='navbar-container'>
        <Link to='/' className='navbar-logo' aria-label='XP-Bird home'>
          <span className='brand-mark'>XP</span>
          <span className='brand-copy'>
            <span className='brand-name'>XP-Bird</span>
            <span className='brand-tagline'>Tech gear market</span>
          </span>
        </Link>

        <button
          type='button'
          className={`navbar-toggle ${isMenuOpen ? 'open' : ''}`}
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          onClick={toggleMenu}
        >
          <Icon name={isMenuOpen ? 'close' : 'menu'} className='navbar-toggle-icon' />
        </button>

        <nav className={`navbar-nav ${isMenuOpen ? 'open' : ''}`} aria-label='Primary navigation'>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
              <Icon name={item.icon} />
              {item.label}
              {item.label === 'Cart' && totalCount > 0 && <span className='cart-count'>{totalCount}</span>}
            </NavLink>
          ))}
        </nav>

        <div className={`navbar-actions ${isMenuOpen ? 'open' : ''}`}>
          {isAuthenticated ? (
            <div className='user-menu'>
              <span className='user-greeting'>Hi, {userName}</span>
              <button type='button' className='auth-btn signin-btn' onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className='auth-buttons'>
              <Link to='/signin' className='auth-btn signin-btn' onClick={() => setIsMenuOpen(false)}>
                Sign In
              </Link>
              <Link to='/signup' className='auth-btn signup-btn' onClick={() => setIsMenuOpen(false)}>
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

function SiteFooter() {
  return (
    <footer className='site-footer'>
      <div className='site-footer-inner'>
        <div>
          <h3>XP-Bird</h3>
          <p>Quality computer components and gaming accessories for every setup.</p>
        </div>
        <div className='footer-links'>
          <Link to='/about' className='footer-about-link'>
            About Us
          </Link>
          <div className='footer-social-icons'>
            <a
              href='https://www.instagram.com/fool._once/'
              target='_blank'
              rel='noreferrer'
              className='footer-social-link'
              aria-label='Instagram'
              title='Instagram'
            >
              <InstagramIcon />
            </a>
            <a
              href='https://wa.me/254745390073'
              target='_blank'
              rel='noreferrer'
              className='footer-social-link'
              aria-label='WhatsApp'
              title='WhatsApp'
            >
              <WhatsAppIcon />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className='App'>
            <AppNavbar />
            <main className='app-main'>
              <div className='app-content'>
                <Routes>
                  <Route path='/signup' element={<Signup />} />
                  <Route path='/signin' element={<Signin />} />
                  <Route path='/addproduct' element={<Addproducts />} />
                  <Route path='/cart' element={<Addtocart />} />
                  <Route path='/products' element={<Getproducts />} />
                  <Route path='/products/:productId' element={<ProductDetails />} />
                  <Route path='/about' element={<AboutUs />} />
                  <Route path='/' element={<Homepage />} />
                  <Route path='/makepayment' element={<Makepayment />} />
                </Routes>
              </div>
              <SiteFooter />
              <Chatbot />
            </main>
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
