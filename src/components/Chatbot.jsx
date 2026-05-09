import axios from 'axios'
import { useEffect, useState } from 'react'

const productsEndpoint = 'http://johnson.alwaysdata.net/api/get_product_details'

const responses = {
  hello: 'Hello! Welcome to XP-Bird. What are you looking for?',
  hi: 'Hi there! How can I assist you today?',
  hey: 'Hey! Ready to help you shop!',
  cart: 'You can add items to your cart and checkout from there. Your cart is saved automatically!',
  basket: 'Your shopping basket is ready! Add items and proceed to checkout.',
  payment: 'We accept M-Pesa payments for easy and secure checkout.',
  pay: 'Payment is simple with M-Pesa. Just enter your details at checkout.',
  checkout: 'Ready to checkout? Review your cart and complete your purchase with M-Pesa.',
  help: 'I can help you with products, cart, payments, shipping, returns, or general questions!',
  support: 'I am here to support you! Ask me about shopping, orders, or anything else.',
  shipping: 'We offer fast shipping within Kenya. Orders are typically delivered within 2-5 business days.',
  delivery: 'Delivery usually takes 2-5 business days. We will send you tracking information once your order ships.',
  returns: 'We accept returns within 30 days of purchase. Items must be in original condition.',
  refund: 'Refunds are processed within 5-7 business days after we receive your return.',
  exchange: 'Need a different size? We offer exchanges for items in new condition.',
  account: 'Create an account to track orders and save your preferences!',
  signin: 'Sign in to access your account, order history, and saved items.',
  signup: 'Join us! Sign up for exclusive deals and faster checkout.',
  login: 'Log in to your account to manage your orders and preferences.',
  register: 'Register now to get personalized recommendations and order tracking.',
  contact: 'You can reach us at support@xp-bird.com or call +254 XXX XXX XXX.',
  phone: 'Call us at +254 XXX XXX XXX for immediate assistance.',
  email: 'Email us at support@xp-bird.com - we respond within 24 hours.',
  hours: 'We are open Monday to Saturday, 9 AM to 6 PM EAT.',
  open: 'Store hours: Monday-Saturday 9 AM - 6 PM EAT.',
  size: 'Check our size guide in the product details. We recommend measuring yourself for the best fit.',
  fit: 'Our products run true to size. Check the product description for specific fit information.',
  track: 'Track your order using the link in your confirmation email.',
  order: 'Check your order status in your account or contact us for updates.',
  status: 'Order status updates are sent via email. You can also check in your account.',
  discount: 'Look for our seasonal promotions and use code WELCOME10 for 10% off your first order!',
  promo: 'Check our homepage for current promotions and special offers.',
  coupon: 'Use code WELCOME10 for 10% off your first purchase!',
  about: 'XP-Bird is your go-to online store for quality products at great prices.',
  company: 'Learn more about XP-Bird on our About page - quality products since 2020.',
  privacy: 'Your privacy is important to us. Read our full privacy policy on our website.',
  terms: 'Please review our terms of service for complete purchasing information.',
  policy: 'Check our policies section for shipping, returns, and privacy information.',
  faq: 'Visit our FAQ page for answers to common questions.',
  questions: 'I can answer questions about shopping, orders, shipping, and more!',
  problem: 'Having an issue? Let me help you resolve it.',
  issue: 'Tell me about your problem and I will guide you to a solution.',
  thanks: 'You are welcome! Happy shopping!',
  thank: 'My pleasure! Let me know if you need anything else.',
  bye: 'Goodbye! Thanks for visiting XP-Bird.',
  goodbye: 'See you later! Come back soon.',
  default: 'I am here to help! Ask me about available products, prices, cart, payments, shipping, or returns.',
}

const productStopWords = new Set([
  'about',
  'all',
  'amount',
  'and',
  'any',
  'are',
  'available',
  'buy',
  'can',
  'catalog',
  'category',
  'categories',
  'cost',
  'does',
  'find',
  'for',
  'from',
  'have',
  'how',
  'inventory',
  'item',
  'items',
  'ksh',
  'list',
  'looking',
  'much',
  'need',
  'please',
  'price',
  'product',
  'products',
  'search',
  'sell',
  'selling',
  'shop',
  'show',
  'stock',
  'tell',
  'that',
  'the',
  'this',
  'what',
  'which',
  'with',
  'you',
  'your',
])

const normalizeText = (value) => String(value || '').toLowerCase().trim()

const hasAnyPhrase = (text, phrases) => phrases.some((phrase) => text.includes(phrase))

const getProductName = (product) => product.product_name || 'Untitled product'

const getProductCost = (product) => {
  const cost = Number(product.product_cost ?? product.cost)
  return Number.isFinite(cost) ? cost : null
}

const formatPrice = (product) => {
  const cost = getProductCost(product)

  if (cost === null) {
    return product.product_cost ? `Ksh ${product.product_cost}` : 'Price not listed'
  }

  return `Ksh ${cost.toLocaleString('en-KE')}`
}

const formatProductLine = (product, index) => {
  const category = product.product_category ? ` - ${product.product_category}` : ''
  return `${index + 1}. ${getProductName(product)} - ${formatPrice(product)}${category}`
}

const formatProductDetail = (product, index) => {
  const description = product.product_description
    ? `\nDescription: ${product.product_description}`
    : ''

  return `${formatProductLine(product, index)}${description}`
}

const getCategories = (products) =>
  Array.from(new Set(products.map((product) => product.product_category).filter(Boolean))).sort(
    (firstCategory, secondCategory) => firstCategory.localeCompare(secondCategory),
  )

const buildCatalogSummary = (products) => {
  if (products.length === 0) {
    return 'I do not see any products in the XP-Bird catalog right now.'
  }

  const categories = getCategories(products)
  const productLines = products.map(formatProductLine).join('\n')
  const categoryLine =
    categories.length > 0 ? `\n\nAvailable categories: ${categories.join(', ')}.` : ''

  return `XP-Bird currently has ${products.length} available product${products.length === 1 ? '' : 's'}:\n${productLines}${categoryLine}`
}

const buildCategorySummary = (products) => {
  const categoryCounts = products.reduce((counts, product) => {
    const category = product.product_category || 'Uncategorized'
    counts[category] = (counts[category] || 0) + 1
    return counts
  }, {})

  const categoryLines = Object.entries(categoryCounts)
    .sort(([firstCategory], [secondCategory]) => firstCategory.localeCompare(secondCategory))
    .map(([category, count], index) => `${index + 1}. ${category} - ${count} product${count === 1 ? '' : 's'}`)
    .join('\n')

  return `Available XP-Bird categories:\n${categoryLines}`
}

const tokenize = (text) =>
  normalizeText(text)
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 1 && !productStopWords.has(token))

const getProductMatches = (message, products) => {
  const normalizedMessage = normalizeText(message)
  const tokens = tokenize(message)

  if (tokens.length === 0 && normalizedMessage.length < 3) {
    return []
  }

  return products
    .map((product) => {
      const name = normalizeText(product.product_name)
      const category = normalizeText(product.product_category)
      const description = normalizeText(product.product_description)
      let score = 0

      if (name && normalizedMessage.includes(name)) {
        score += 80
      }

      if (category && normalizedMessage.includes(category)) {
        score += 20
      }

      tokens.forEach((token) => {
        if (name.includes(token)) {
          score += 12
        } else if (category.includes(token)) {
          score += 7
        } else if (description.includes(token)) {
          score += 3
        }
      })

      return { product, score }
    })
    .filter((match) => match.score > 0)
    .sort((firstMatch, secondMatch) => secondMatch.score - firstMatch.score)
}

const buildPriceSortedResponse = (products, direction) => {
  const pricedProducts = products
    .map((product) => ({ product, cost: getProductCost(product) }))
    .filter((item) => item.cost !== null)
    .sort((firstItem, secondItem) =>
      direction === 'low' ? firstItem.cost - secondItem.cost : secondItem.cost - firstItem.cost,
    )

  if (pricedProducts.length === 0) {
    return 'I know the product names, but I do not see listed prices in the catalog yet.'
  }

  const label = direction === 'low' ? 'Most affordable options' : 'Highest priced options'
  const productLines = pricedProducts
    .slice(0, 5)
    .map((item, index) => formatProductLine(item.product, index))
    .join('\n')

  return `${label}:\n${productLines}`
}

const buildMatchResponse = (matches, wantsPriceInfo) => {
  const visibleMatches = matches.slice(0, 5)
  const productLines = visibleMatches
    .map((match, index) => formatProductDetail(match.product, index))
    .join('\n\n')
  const moreMatches =
    matches.length > visibleMatches.length
      ? `\n\nI found ${matches.length - visibleMatches.length} more matching product${matches.length - visibleMatches.length === 1 ? '' : 's'} in the catalog.`
      : ''
  const intro =
    matches.length === 1
      ? `${getProductName(matches[0].product)} is available.`
      : `I found ${matches.length} matching products.`
  const priceHint = wantsPriceInfo ? ' Here are the prices I know:' : ''

  return `${intro}${priceHint}\n${productLines}${moreMatches}`
}

const getProductKnowledgeResponse = (message, products, catalogLoading, catalogError) => {
  const lowerMessage = normalizeText(message)
  const wantsProductInfo = hasAnyPhrase(lowerMessage, [
    'available',
    'catalog',
    'inventory',
    'item',
    'items',
    'product',
    'products',
    'shop',
    'stock',
    'what can i buy',
    'what do you sell',
    'what are you selling',
  ])
  const wantsCategoryInfo = hasAnyPhrase(lowerMessage, ['category', 'categories'])
  const wantsPriceInfo = hasAnyPhrase(lowerMessage, ['price', 'cost', 'how much'])
  const wantsAvailabilityInfo = hasAnyPhrase(lowerMessage, [
    'do you have',
    'in stock',
    'is there',
    'available',
  ])
  const wantsBudgetInfo = hasAnyPhrase(lowerMessage, [
    'affordable',
    'budget',
    'cheap',
    'cheapest',
    'lowest',
  ])
  const wantsPremiumInfo = hasAnyPhrase(lowerMessage, [
    'costliest',
    'expensive',
    'highest',
    'premium',
  ])
  const shouldUseCatalog =
    wantsProductInfo ||
    wantsCategoryInfo ||
    wantsPriceInfo ||
    wantsAvailabilityInfo ||
    wantsBudgetInfo ||
    wantsPremiumInfo

  if (catalogLoading && shouldUseCatalog) {
    return 'I am syncing XP-Bird\'s live product catalog now. Please ask again in a moment.'
  }

  if (catalogError && shouldUseCatalog && products.length === 0) {
    return `I could not load the live product catalog right now: ${catalogError}. Please try again shortly or open the Shop page.`
  }

  if (products.length === 0) {
    return shouldUseCatalog ? 'I do not see any products in the XP-Bird catalog right now.' : null
  }

  const matches = getProductMatches(message, products)

  if (wantsCategoryInfo) {
    return buildCategorySummary(products)
  }

  if (wantsBudgetInfo) {
    return buildPriceSortedResponse(products, 'low')
  }

  if (wantsPremiumInfo) {
    return buildPriceSortedResponse(products, 'high')
  }

  if (matches.length > 0) {
    return buildMatchResponse(matches, wantsPriceInfo)
  }

  if (wantsPriceInfo || wantsAvailabilityInfo) {
    return `I could not find a matching product in the live catalog. Here is everything currently available:\n${products.map(formatProductLine).join('\n')}`
  }

  if (wantsProductInfo) {
    return buildCatalogSummary(products)
  }

  return null
}

const getStaticResponse = (message) => {
  const lowerMessage = normalizeText(message)

  for (const [key, response] of Object.entries(responses)) {
    if (key !== 'default' && lowerMessage.includes(key)) {
      return response
    }
  }

  return responses.default
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { text: 'Hi! How can I help you with your shopping today?', sender: 'bot' },
  ])
  const [input, setInput] = useState('')
  const [products, setProducts] = useState([])
  const [catalogLoading, setCatalogLoading] = useState(true)
  const [catalogError, setCatalogError] = useState('')

  useEffect(() => {
    let ignore = false

    const loadProducts = async () => {
      try {
        const response = await axios.get(productsEndpoint)
        if (!ignore) {
          setProducts(Array.isArray(response.data) ? response.data : [])
          setCatalogError('')
        }
      } catch (requestError) {
        if (!ignore) {
          setCatalogError(requestError.message || 'Unable to load products right now.')
        }
      } finally {
        if (!ignore) {
          setCatalogLoading(false)
        }
      }
    }

    loadProducts()

    return () => {
      ignore = true
    }
  }, [])

  const handleSend = () => {
    const trimmedInput = input.trim()

    if (!trimmedInput) return

    const userMessage = { text: trimmedInput, sender: 'user' }
    const botResponse =
      getProductKnowledgeResponse(trimmedInput, products, catalogLoading, catalogError) ||
      getStaticResponse(trimmedInput)

    setMessages((previousMessages) => [...previousMessages, userMessage])

    window.setTimeout(() => {
      setMessages((previousMessages) => [
        ...previousMessages,
        { text: botResponse, sender: 'bot' },
      ])
    }, 500)

    setInput('')
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSend()
    }
  }

  return (
    <>
      <button
        className='chatbot-toggle'
        onClick={() => setIsOpen(!isOpen)}
        title='Chat with us'
        type='button'
      >
        💬
      </button>

      {isOpen && (
        <div className='chatbot-window'>
          <div className='chatbot-header'>
            <span>XP-Bird Assistant</span>
            <button type='button' onClick={() => setIsOpen(false)}>
              x
            </button>
          </div>

          <div className='chatbot-messages'>
            {messages.map((message, index) => (
              <div key={`${message.sender}-${index}`} className={`message ${message.sender}`}>
                {message.text}
              </div>
            ))}
          </div>

          <div className='chatbot-input'>
            <input
              type='text'
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder='Ask about products, prices, or orders...'
            />
            <button type='button' onClick={handleSend}>
              Send
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default Chatbot
