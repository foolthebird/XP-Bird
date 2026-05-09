import axios from 'axios'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import {
  findProductByRouteId,
  formatProductPrice,
  getProductCategory,
  getProductDescription,
  getProductName,
  getProductRouteId,
  productImageBaseUrl,
  productsEndpoint,
} from '../utils/productCatalog'
import './ProductDetails.css'

const detailSignals = ['Neon calibrated', 'Pulse ready', 'Fast lane active']

const ProductDetails = () => {
  const { productId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { addToCart, totalCount } = useCart()

  const seededProduct =
    location.state?.product &&
    String(getProductRouteId(location.state.product)) === String(productId)
      ? location.state.product
      : null

  const [catalog, setCatalog] = useState(seededProduct ? [seededProduct] : [])
  const [loading, setLoading] = useState(!seededProduct)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [catalogNote, setCatalogNote] = useState('')

  useEffect(() => {
    let ignore = false

    window.scrollTo({ top: 0, behavior: 'smooth' })

    const loadCatalog = async () => {
      if (!seededProduct) {
        setLoading(true)
      }

      try {
        const response = await axios.get(productsEndpoint)
        const liveCatalog = Array.isArray(response.data) ? response.data : []
        const matchedProduct = findProductByRouteId(liveCatalog, productId)

        if (!ignore) {
          setCatalog(liveCatalog)
          setError(matchedProduct || seededProduct ? '' : 'This product is no longer available.')
          setCatalogNote(
            seededProduct && !matchedProduct
              ? 'Live sync is delayed, so you are viewing the product snapshot you opened.'
              : '',
          )
        }
      } catch (requestError) {
        if (!ignore) {
          if (!seededProduct) {
            setError(requestError.message || 'Unable to load product details right now.')
          } else {
            setCatalogNote(
              'Live catalog sync is unavailable right now. You can still add this product to cart or purchase it.',
            )
          }
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadCatalog()

    return () => {
      ignore = true
    }
  }, [productId, seededProduct])

  const product = findProductByRouteId(catalog, productId) || seededProduct

  const showMessage = (nextMessage) => {
    setMessage(nextMessage)
    window.setTimeout(() => setMessage(''), 2200)
  }

  const handleAddToCart = () => {
    if (!product) return
    addToCart(product)
    showMessage(`${getProductName(product)} added to cart`)
  }

  const handlePurchase = () => {
    if (!product) return
    navigate('/makepayment', { state: { product } })
  }

  const relatedProducts = product
    ? catalog
        .filter(
          (item) =>
            getProductRouteId(item) !== getProductRouteId(product) &&
            getProductCategory(item) === getProductCategory(product),
        )
        .slice(0, 3)
    : []

  if (loading && !product) {
    return (
      <div className='product-detail-page'>
        <div className='container py-5'>
          <section className='product-detail-feedback'>
            <h2>Syncing product briefing</h2>
            <p>XP-Bird is loading the latest product details for you.</p>
          </section>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className='product-detail-page'>
        <div className='container py-5'>
          <section className='product-detail-feedback product-detail-feedback-error'>
            <h2>Product signal lost</h2>
            <p>{error || 'We could not find this product in the live catalog.'}</p>
            <button
              type='button'
              className='product-detail-action product-detail-action-primary'
              onClick={() => navigate('/products')}
            >
              Return to Catalog
            </button>
          </section>
        </div>
      </div>
    )
  }

  const productName = getProductName(product)
  const productCategory = getProductCategory(product)
  const productDescription = getProductDescription(product)
  const productPrice = formatProductPrice(product)
  const productSignal = detailSignals[Number(product.id || 0) % detailSignals.length]

  return (
    <div className='product-detail-page'>
      <div className='container py-4 py-lg-5'>
        <div className={`toast-notification ${message ? 'show' : ''}`}>{message}</div>

        <section className='product-detail-topbar'>
          <button
            type='button'
            className='product-detail-back'
            onClick={() => navigate('/products')}
          >
            Back to Catalog
          </button>
          <div className='product-detail-topbar-copy'>
            <span>XP-Bird Product Briefing</span>
            <strong>{totalCount} item(s) live in cart</strong>
          </div>
        </section>

        {catalogNote && (
          <section className='product-detail-note'>
            <p>{catalogNote}</p>
          </section>
        )}

        <section className='product-detail-shell'>
          <div className='product-detail-visual'>
            <div className='product-detail-visual-glow' />
            <div className='product-detail-visual-frame'>
              <div className='product-detail-visual-hud'>
                <span>{productCategory}</span>
                <strong>{productSignal}</strong>
              </div>
              <img
                src={`${productImageBaseUrl}${product.product_photo}`}
                alt={productName}
                className='product-detail-image'
              />
            </div>
          </div>

          <div className='product-detail-copy'>
            <span className='product-detail-badge'>Cyberpunk detail view</span>
            <h1>{productName}</h1>
            <p className='product-detail-description'>{productDescription}</p>

            <div className='product-detail-priceband'>
              <div>
                <span>Live price</span>
                <strong>{productPrice}</strong>
              </div>
              <div>
                <span>Category</span>
                <strong>{productCategory}</strong>
              </div>
            </div>

            <div className='product-detail-specs'>
              <div className='product-detail-spec'>
                <span>Checkout mode</span>
                <strong>M-Pesa Ready</strong>
              </div>
              <div className='product-detail-spec'>
                <span>Cart signal</span>
                <strong>Persistent Save</strong>
              </div>
              <div className='product-detail-spec'>
                <span>Product ID</span>
                <strong>{product.id || 'Live item'}</strong>
              </div>
              <div className='product-detail-spec'>
                <span>Route status</span>
                <strong>Detail page armed</strong>
              </div>
            </div>

            <div className='product-detail-actions'>
              <button
                type='button'
                className='product-detail-action product-detail-action-secondary'
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
              <button
                type='button'
                className='product-detail-action product-detail-action-primary'
                onClick={handlePurchase}
              >
                Purchase Now
              </button>
              <button
                type='button'
                className='product-detail-action product-detail-action-ghost'
                onClick={() => navigate('/products')}
              >
                Cancel
              </button>
            </div>
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className='product-detail-related'>
            <div className='product-detail-related-header'>
              <span>More in this channel</span>
              <h2>Stay inside the same loadout lane.</h2>
            </div>

            <div className='product-detail-related-grid'>
              {relatedProducts.map((item) => (
                <article
                  key={getProductRouteId(item)}
                  className='product-detail-related-card'
                  onClick={() =>
                    navigate(`/products/${getProductRouteId(item)}`, { state: { product: item } })
                  }
                >
                  <img
                    src={`${productImageBaseUrl}${item.product_photo}`}
                    alt={getProductName(item)}
                    className='product-detail-related-image'
                  />
                  <div className='product-detail-related-copy'>
                    <span>{getProductCategory(item)}</span>
                    <h3>{getProductName(item)}</h3>
                    <strong>{formatProductPrice(item)}</strong>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default ProductDetails
