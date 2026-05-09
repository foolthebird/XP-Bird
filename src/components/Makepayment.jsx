import axios from 'axios'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  formatProductPrice,
  getProductCategory,
  getProductName,
  productImageBaseUrl,
} from '../utils/productCatalog'
import './Makepayment.css'
import mpesaLogo from '../components/images/download.png'


const paymentHighlights = [
  {
    label: 'Instant handoff',
    value: 'STK Push',
    text: 'Approve the payment straight from your phone without leaving the checkout flow.',
  },
  {
    label: 'Cart memory',
    value: 'Always synced',
    text: 'Your selected items stay grouped together so the final amount stays easy to confirm.',
  },
  {
    label: 'Checkout feel',
    value: 'Cyber clean',
    text: 'A richer layout helps you review the order clearly before you authorize the charge.',
  },
]

const paymentSteps = [
  'Confirm the phone number connected to your M-Pesa wallet.',
  'Tap the payment button to trigger the STK push request.',
  'Approve the prompt on your phone to complete the order.',
]

const supportNotes = [
  'Use a Safaricom number written like 2547XXXXXXXX.',
  'Keep your phone nearby because the prompt arrives a few seconds after submission.',
  'If the prompt delays, wait briefly before retrying to avoid duplicate requests.',
]

const formatCurrency = (amount) => `Ksh ${Number(amount || 0).toLocaleString('en-KE')}`

const Makepayment = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const product = location.state?.product
  const cart = location.state?.cart

  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isCartCheckout = Array.isArray(cart) && cart.length > 0
  const checkoutItems = isCartCheckout ? cart : product ? [{ ...product, quantity: 1 }] : []
  const totalUnits = checkoutItems.reduce((sum, item) => sum + Number(item.quantity || 1), 0)
  const amount = checkoutItems.reduce(
    (sum, item) => sum + Number(item.quantity || 1) * Number(item.product_cost || 0),
    0,
  )
  const checkoutType = isCartCheckout ? 'Cart Checkout' : 'Single Product Checkout'
  const submitButtonText = isSubmitting ? 'Sending STK Push...' : 'Proceed to Pay'

  const submit = async (event) => {
    event.preventDefault()

    if (checkoutItems.length === 0) {
      setError('Choose a product or cart before starting payment.')
      return
    }

    setIsSubmitting(true)
    setError('')
    setMessage('Please wait while we prepare your payment request...')

    try {
      const data = new FormData()
      data.append('phone', phone.trim())
      data.append('amount', amount)
      await axios.post('http://johnson.alwaysdata.net/api/mpesa_payment', data)
      setMessage('Please complete the payment from the M-Pesa prompt on your phone.')
    } catch (requestError) {
      setMessage('')
      setError(requestError.message || 'Unable to start the payment right now.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (checkoutItems.length === 0) {
    return (
      <div className='auth-page-bg payment-page py-5'>
        <div className='container'>
          <section className='glass-payment-card payment-empty-state mx-auto shadow'>
            <span className='payment-kicker'>Checkout idle</span>
            <h1 className='payment-title'>There is nothing queued for payment yet.</h1>
            <p>
              Browse the live catalog, pick your product, then come back here when you are ready to
              complete checkout.
            </p>
            <div className='payment-empty-actions'>
              <button
                type='button'
                className='payment-ghost-btn'
                onClick={() => navigate('/products')}
              >
                Open Catalog
              </button>
            </div>
          </section>
        </div>
      </div>
    )
  }

  return (
    <div className='auth-page-bg payment-page py-5'>
      <div className='container'>
        <div className='payment-shell'>
          <section className='glass-payment-card payment-showcase shadow'>
            <div className='payment-showcase-copy'>
              <span className='payment-kicker'>{checkoutType}</span>
              <h1 className='payment-title'>Complete your XP-Bird order with a cleaner, richer M-Pesa checkout.</h1>
              <p className='payment-lead'>
                Review every selected item, check the total, and send the payment request with a
                single move. The flow stays familiar, but the experience is now more polished and
                easier to trust at a glance.
              </p>
            </div>

            <div className='payment-highlight-grid'>
              {paymentHighlights.map((highlight) => (
                <article key={highlight.label} className='payment-highlight-card'>
                  <span>{highlight.label}</span>
                  <strong>{highlight.value}</strong>
                  <p>{highlight.text}</p>
                </article>
              ))}
            </div>

            <div className='payment-receipt-box payment-order-panel'>
              <div className='payment-order-header'>
                <div>
                  <span className='payment-section-label'>Order review</span>
                  <h2>{checkoutItems.length} line item(s) ready</h2>
                </div>
                <div className='price-badge'>{formatCurrency(amount)}</div>
              </div>

              <div className='payment-order-list'>
                {checkoutItems.map((item, index) => {
                  const quantity = Number(item.quantity || 1)
                  const lineTotal = quantity * Number(item.product_cost || 0)

                  return (
                    <article className='payment-order-item' key={item.id || `${item.product_name}-${index}`}>
                      <img
                        src={`${productImageBaseUrl}${item.product_photo}`}
                        alt={getProductName(item)}
                        className='payment-thumb'
                      />
                      <div className='payment-order-copy'>
                        <h3>{getProductName(item)}</h3>
                        <p>{getProductCategory(item)}</p>
                      </div>
                      <div className='payment-order-meta'>
                        <span>{quantity} x {formatProductPrice(item)}</span>
                        <strong>{formatCurrency(lineTotal)}</strong>
                      </div>
                    </article>
                  )
                })}
              </div>

              <div className='payment-summary-grid'>
                <div className='payment-summary-chip'>
                  <span>Checkout mode</span>
                  <strong>{checkoutType}</strong>
                </div>
                <div className='payment-summary-chip'>
                  <span>Total units</span>
                  <strong>{totalUnits}</strong>
                </div>
                <div className='payment-summary-chip'>
                  <span>Amount due</span>
                  <strong>{formatCurrency(amount)}</strong>
                </div>
              </div>
            </div>

            <div className='payment-support-strip'>
              <div className='payment-support-card'>
                <span>Payment channel</span>
                <strong>M-Pesa mobile money</strong>
              </div>
              <div className='payment-support-card'>
                <span>Best practice</span>
                <strong>Keep your phone unlocked</strong>
              </div>
              <div className='payment-support-card'>
                <span>Cancel path</span>
                <strong>Return to cart or catalog anytime</strong>
              </div>
            </div>
          </section>

          <aside className='glass-payment-card payment-form-card shadow'>
            <div className='payment-brand-row'>
              <div className='mpesa-logo-container payment-brand-logo'>
                <img src={mpesaLogo} alt='M-Pesa' className='payment-mpesa-logo' />
              </div>
              <div>
                <span className='payment-section-label'>Checkout command</span>
                <h2 className='payment-form-title'>Authorize payment</h2>
              </div>
            </div>

            <div className='payment-total-band'>
              <div>
                <span>Total to authorize</span>
                <strong>{formatCurrency(amount)}</strong>
              </div>
              <div>
                <span>Items</span>
                <strong>{totalUnits}</strong>
              </div>
            </div>

            {error && <div className='payment-status payment-status-error'>{error}</div>}
            {message && <div className='payment-status payment-status-success'>{message}</div>}

            <form onSubmit={submit} className='payment-form-layout'>
              <div>
                <label className='glass-label'>M-Pesa Phone Number</label>
                <input
                  type='tel'
                  inputMode='numeric'
                  placeholder='2547XXXXXXXX'
                  className='glass-input payment-phone-input'
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  required
                />
                <p className='payment-field-note'>
                  Enter the phone number that should receive the STK push prompt.
                </p>
              </div>

              <div className='payment-steps-panel'>
                <span className='payment-section-label'>How it works</span>
                <ol className='payment-step-list'>
                  {paymentSteps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </div>

              <button type='submit' className='neon-pay-btn w-100' disabled={isSubmitting}>
                {submitButtonText}
              </button>
            </form>

            <div className='payment-secondary-actions'>
              <button
                type='button'
                className='payment-ghost-btn'
                onClick={() => navigate(isCartCheckout ? '/cart' : '/products')}
              >
                Cancel
              </button>
              <button
                type='button'
                className='payment-ghost-btn'
                onClick={() => navigate('/products')}
              >
                Shop More
              </button>
            </div>

            <div className='payment-help-panel'>
              <span className='payment-section-label'>Before you tap pay</span>
              <ul className='payment-help-list'>
                {supportNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default Makepayment
