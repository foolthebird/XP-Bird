import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import {
  formatProductPrice,
  getProductCategory,
  getProductDescription,
  getProductName,
  getProductRouteId,
  productImageBaseUrl,
  productsEndpoint,
} from '../utils/productCatalog'
import './Getproducts.css'

const heroSlides = [
  {
    id: 'neon-rigs',
    eyebrow: 'Neon Rigs',
    title: 'Build a battlestation that owns the room.',
    description:
      'Scan premium components, glowing peripherals, and performance-first gear built for late-night play.',
    image:
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1600&h=900&fit=crop',
    panelLabel: 'Signal',
    panelValue: 'High',
    panelText: 'Frames, lighting, and clean performance energy for serious setups.',
  },
  {
    id: 'creator-zones',
    eyebrow: 'Creator Zone',
    title: 'Sharper screens, cleaner desks, faster flow.',
    description:
      'Mix monitors, accessories, and dependable parts into a setup that feels fast before you even click launch.',
    image:
      'https://images.unsplash.com/photo-1527814050087-3793815479db?w=1600&h=900&fit=crop',
    panelLabel: 'Mode',
    panelValue: 'Focus',
    panelText: 'Curated tech for streaming, editing, learning, and everyday creative work.',
  },
  {
    id: 'future-drop',
    eyebrow: 'Future Drop',
    title: 'Upgrade your desk like it belongs in the next city over.',
    description:
      'From compact upgrades to full cyberpunk glow-ups, XP-Bird keeps the catalog ready for your next move.',
    image:
      'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=1600&h=900&fit=crop',
    panelLabel: 'Catalog',
    panelValue: 'Live',
    panelText: 'Jump from discovery to checkout with a faster, brighter shopping flow.',
  },
]

const cardSignals = ['Nova Live', 'Pulse Sync', 'Grid Ready', 'Night Mode']
const cardAccents = ['Cyber Pick', 'Fresh Drop', 'Scan Locked', 'Prime Loadout']
const productsPerPage = 12

const Getproducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [currentSlide, setCurrentSlide] = useState(0)

  const navigate = useNavigate()
  const { addToCart, totalCount } = useCart()

  useEffect(() => {
    let ignore = false

    const loadProducts = async () => {
      try {
        const response = await axios.get(productsEndpoint)
        if (!ignore) {
          setProducts(Array.isArray(response.data) ? response.data : [])
          setError('')
        }
      } catch (requestError) {
        if (!ignore) {
          setError(requestError.message || 'Unable to load products right now.')
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadProducts()

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentSlide((previousSlide) =>
        previousSlide === heroSlides.length - 1 ? 0 : previousSlide + 1,
      )
    }, 5200)

    return () => window.clearInterval(timer)
  }, [])

  const retryLoadProducts = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await axios.get(productsEndpoint)
      setProducts(Array.isArray(response.data) ? response.data : [])
    } catch (requestError) {
      setError(requestError.message || 'Unable to load products right now.')
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (nextMessage) => {
    setMessage(nextMessage)
    window.setTimeout(() => setMessage(''), 2200)
  }

  const handleAddToCart = (product) => {
    addToCart(product)
    showMessage(`${getProductName(product)} added to cart`)
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
    setCurrentPage(1)
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleResetFilters = () => {
    setSearchTerm('')
    setSelectedCategory('All')
    setCurrentPage(1)
  }

  const goToSlide = (slideIndex) => {
    setCurrentSlide(slideIndex)
  }

  const nextSlide = () => {
    setCurrentSlide((previousSlide) =>
      previousSlide === heroSlides.length - 1 ? 0 : previousSlide + 1,
    )
  }

  const previousSlide = () => {
    setCurrentSlide((previousSlideValue) =>
      previousSlideValue === 0 ? heroSlides.length - 1 : previousSlideValue - 1,
    )
  }

  const scrollToCatalog = () => {
    document.getElementById('product-catalog')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  const openProductDetails = (product, fallbackId) => {
    navigate(`/products/${getProductRouteId(product, fallbackId)}`, {
      state: { product },
    })
  }

  const handleCardKeyDown = (event, product, fallbackId) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openProductDetails(product, fallbackId)
    }
  }

  const stopCardNavigation = (event, action) => {
    event.stopPropagation()
    action()
  }

  const normalizedSearch = searchTerm.trim().toLowerCase()

  const filteredProducts = products.filter((product) => {
    const productName = getProductName(product).toLowerCase()
    const productDescription = getProductDescription(product).toLowerCase()
    const productCategory = getProductCategory(product)
    const matchesSearch =
      normalizedSearch === '' ||
      productName.includes(normalizedSearch) ||
      productDescription.includes(normalizedSearch)
    const matchesCategory =
      selectedCategory === 'All' || productCategory === selectedCategory

    return matchesSearch && matchesCategory
  })

  const categories = [
    'All',
    ...Array.from(
      new Set(products.map((product) => getProductCategory(product)).filter(Boolean)),
    ).sort((firstCategory, secondCategory) => firstCategory.localeCompare(secondCategory)),
  ]

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const endIndex = startIndex + productsPerPage
  const currentProducts = filteredProducts.slice(startIndex, endIndex)
  const hasActiveFilters = normalizedSearch !== '' || selectedCategory !== 'All'
  const displayStart = filteredProducts.length === 0 ? 0 : startIndex + 1
  const displayEnd = Math.min(endIndex, filteredProducts.length)
  const totalCategories = Math.max(categories.length - 1, 0)

  const heroStats = [
    { label: 'Products Online', value: loading ? '--' : products.length },
    { label: 'Visible Now', value: loading ? '--' : filteredProducts.length },
    { label: 'Categories', value: totalCategories || '--' },
    { label: 'Cart Pulse', value: totalCount || '0' },
  ]

  return (
    <div className='products-page'>
      <div className='container py-4 py-lg-5'>
        <section className='products-hero'>
          <div className='products-carousel'>
            {heroSlides.map((slide, index) => (
              <article
                key={slide.id}
                className={`products-slide ${index === currentSlide ? 'products-slide-active' : ''}`}
                style={{ '--slide-image': `url(${slide.image})` }}
              >
                <div className='products-slide-content'>
                  <span className='products-slide-eyebrow'>{slide.eyebrow}</span>
                  <h1>{slide.title}</h1>
                  <p>{slide.description}</p>
                  <div className='products-slide-actions'>
                    <button
                      type='button'
                      className='products-hero-primary'
                      onClick={scrollToCatalog}
                    >
                      Enter Catalog
                    </button>
                    <button
                      type='button'
                      className='products-hero-secondary'
                      onClick={() => navigate('/cart')}
                    >
                      View Cart
                    </button>
                  </div>
                </div>

                <div className='products-slide-panel'>
                  <span>{slide.panelLabel}</span>
                  <strong>{slide.panelValue}</strong>
                  <p>{slide.panelText}</p>
                </div>
              </article>
            ))}

            <div className='products-carousel-controls'>
              <button type='button' className='products-carousel-arrow' onClick={previousSlide}>
                {'<'}
              </button>
              <div className='products-carousel-dots'>
                {heroSlides.map((slide, index) => (
                  <button
                    key={slide.id}
                    type='button'
                    className={`products-carousel-dot ${index === currentSlide ? 'products-carousel-dot-active' : ''}`}
                    onClick={() => goToSlide(index)}
                    aria-label={`Show slide ${index + 1}`}
                  />
                ))}
              </div>
              <button type='button' className='products-carousel-arrow' onClick={nextSlide}>
                {'>'}
              </button>
            </div>
          </div>

          <div className='products-hero-stats'>
            {heroStats.map((stat) => (
              <div className='products-stat-card' key={stat.label}>
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className='products-command-center' id='product-catalog'>
          <div className='products-command-copy'>
            <span className='products-command-tag'>Market Console</span>
            <h2>Scan the catalog, lock onto a category, and launch your next upgrade.</h2>
            <p>
              Every card is live, searchable, and wired straight into cart and checkout so you can
              move from discovery to action fast.
            </p>
          </div>

          <div className='products-command-tools'>
            <label className='products-search-box'>
              <span>Signal Search</span>
              <input
                type='text'
                className='products-search-input'
                placeholder='Search products, upgrades, accessories...'
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </label>

            <div className='products-filter-summary'>
              <div className='products-filter-chip'>
                <span>Channel</span>
                <strong>{selectedCategory === 'All' ? 'Open Grid' : selectedCategory}</strong>
              </div>
              <div className='products-filter-chip'>
                <span>Showing</span>
                <strong>
                  {displayStart}-{displayEnd}
                </strong>
              </div>
              {hasActiveFilters && (
                <button
                  type='button'
                  className='products-reset-button'
                  onClick={handleResetFilters}
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          <div className='products-category-strip'>
            {categories.map((category) => (
              <button
                key={category}
                type='button'
                className={`products-category-button ${selectedCategory === category ? 'products-category-button-active' : ''}`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {loading && (
          <section className='products-feedback-panel'>
            <h3>Powering up the catalog</h3>
            <p>Please wait while XP-Bird syncs the latest products.</p>
          </section>
        )}

        {error && (
          <section className='products-feedback-panel products-feedback-error'>
            <h3>Signal interruption detected</h3>
            <p>{error}</p>
            <button type='button' className='products-retry-button' onClick={retryLoadProducts}>
              Retry Loading
            </button>
          </section>
        )}

        <div className={`toast-notification ${message ? 'show' : ''}`}>{message}</div>

        {!loading && !error && filteredProducts.length > 0 && (
          <>
            <section className='products-results-bar'>
              <div>
                <span className='products-results-label'>Visible Inventory</span>
                <h3>{filteredProducts.length} products ready for launch</h3>
              </div>
              <p>
                {normalizedSearch
                  ? `Search locked on "${searchTerm}".`
                  : 'Tap any neon card to open the full product briefing.'}{' '}
                {selectedCategory !== 'All' ? `Current category channel: ${selectedCategory}.` : ''}
              </p>
            </section>

            <section className='products-grid'>
              {currentProducts.map((product, index) => {
                const fallbackId = `product-${startIndex + index + 1}`
                const productName = getProductName(product)
                const productDescription = getProductDescription(product)
                const productCategory = getProductCategory(product)
                const productPrice = formatProductPrice(product)
                const productKey = getProductRouteId(product, fallbackId)
                const shortDescription =
                  productDescription.length > 140
                    ? `${productDescription.slice(0, 137)}...`
                    : productDescription
                const signal = cardSignals[index % cardSignals.length]
                const accent = cardAccents[index % cardAccents.length]

                return (
                  <article
                    className='products-card products-card-interactive'
                    key={productKey}
                    onClick={() => openProductDetails(product, fallbackId)}
                    onKeyDown={(event) => handleCardKeyDown(event, product, fallbackId)}
                    tabIndex={0}
                    role='button'
                    aria-label={`Open details for ${productName}`}
                  >
                    <div className='products-card-aura' />

                    <div className='products-card-media'>
                      <img
                        src={`${productImageBaseUrl}${product.product_photo}`}
                        alt={productName}
                        className='products-card-image'
                      />

                      <div className='products-card-hud'>
                        <span className='products-card-category'>{productCategory}</span>
                        <span className='products-card-signal'>{signal}</span>
                      </div>

                      <button
                        type='button'
                        className='products-card-spotlight'
                        onClick={(event) =>
                          stopCardNavigation(event, () => openProductDetails(product, fallbackId))
                        }
                      >
                        Open Loadout
                      </button>
                    </div>

                    <div className='products-card-body'>
                      <div className='products-card-topline'>
                        <div className='products-card-heading'>
                          <span className='products-card-accent'>{accent}</span>
                          <h4>{productName}</h4>
                        </div>
                        <strong>{productPrice}</strong>
                      </div>

                      <div className='products-card-copy'>
                        <p>{shortDescription}</p>
                      </div>

                      <div className='products-card-meta'>
                        <div className='products-card-meta-chip'>
                          <span>Status</span>
                          <strong>Live</strong>
                        </div>
                        <div className='products-card-meta-chip'>
                          <span>Channel</span>
                          <strong>{productCategory}</strong>
                        </div>
                      </div>

                      <div className='products-card-actions'>
                        <button
                          type='button'
                          className='products-card-button products-card-button-secondary'
                          onClick={(event) =>
                            stopCardNavigation(event, () => handleAddToCart(product))
                          }
                        >
                          Add to Cart
                        </button>
                        <button
                          type='button'
                          className='products-card-button products-card-button-outline'
                          onClick={(event) =>
                            stopCardNavigation(event, () => openProductDetails(product, fallbackId))
                          }
                        >
                          View Details
                        </button>
                        <button
                          type='button'
                          className='products-card-button products-card-button-primary'
                          onClick={(event) =>
                            stopCardNavigation(event, () =>
                              navigate('/makepayment', { state: { product } }),
                            )
                          }
                        >
                          Purchase
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </section>
          </>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <section className='products-empty-state'>
            <h3>No products matched this signal.</h3>
            <p>
              Try a different search term, switch back to another category, or reset the filters to
              reopen the full grid.
            </p>
            <button type='button' className='products-retry-button' onClick={handleResetFilters}>
              Clear Filters
            </button>
          </section>
        )}

        {totalPages > 1 && !loading && !error && (
          <div className='products-pagination'>
            <div className='products-pagination-wrapper'>
              <button
                type='button'
                className='products-pagination-button'
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              <div className='products-pagination-numbers'>
                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1

                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        type='button'
                        className={`products-pagination-number ${pageNumber === currentPage ? 'products-pagination-number-active' : ''}`}
                        onClick={() => handlePageChange(pageNumber)}
                      >
                        {pageNumber}
                      </button>
                    )
                  }

                  if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                    return (
                      <span key={pageNumber} className='products-pagination-dots'>
                        ...
                      </span>
                    )
                  }

                  return null
                })}
              </div>

              <button
                type='button'
                className='products-pagination-button'
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>

            <div className='products-pagination-info'>
              Showing {displayStart}-{displayEnd} of {filteredProducts.length} products
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Getproducts
