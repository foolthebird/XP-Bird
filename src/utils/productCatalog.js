export const productsEndpoint = 'https://johnson.alwaysdata.net/api/get_product_details'
export const productImageBaseUrl = 'https://johnson.alwaysdata.net/static/images/'

const normalizeText = (value) => String(value ?? '').toLowerCase().trim()

export const getProductName = (product) => product?.product_name || 'Untitled product'

export const getProductCategory = (product) => product?.product_category || 'Tech Drop'

export const getProductDescription = (product) =>
  product?.product_description || 'No description available for this item yet.'

export const formatProductPrice = (product) => {
  const amount = Number(product?.product_cost ?? product?.cost)

  if (Number.isFinite(amount)) {
    return `Ksh ${amount.toLocaleString('en-KE')}`
  }

  return `Ksh ${product?.product_cost ?? product?.cost ?? 0}`
}

export const slugifyProductName = (value) =>
  normalizeText(value)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'product'

export const getProductRouteId = (product, fallback = 'product') => {
  const rawId = product?.id

  if (rawId !== undefined && rawId !== null && String(rawId).trim() !== '') {
    return String(rawId)
  }

  const slug = slugifyProductName(product?.product_name)
  return slug === 'product' ? fallback : slug
}

export const findProductByRouteId = (products, routeId) =>
  products.find((product) => {
    const matchesId = String(product?.id ?? '') === String(routeId)
    const matchesSlug = slugifyProductName(product?.product_name) === String(routeId)
    return matchesId || matchesSlug
  })
