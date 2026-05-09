import { Link } from 'react-router-dom'
import './AboutUs.css'

const stats = [
  { value: '24/7', label: 'Helpful tech guidance' },
  { value: '100%', label: 'Gaming and PC focused' },
  { value: 'Fast', label: 'Smooth shopping flow' },
  { value: 'Ksh', label: 'Local checkout ready' },
]

const productFocus = [
  {
    title: 'Gaming builds',
    text: 'Balanced parts for smooth frames, cooler temps, and setups that can grow with you.',
    tone: 'teal',
  },
  {
    title: 'Creative workstations',
    text: 'Reliable storage, memory, displays, and accessories for creators who need steady performance.',
    tone: 'orange',
  },
  {
    title: 'Everyday upgrades',
    text: 'Simple, practical hardware picks for students, home offices, and first-time PC owners.',
    tone: 'blue',
  },
]

const values = [
  {
    title: 'Clear advice',
    text: 'We explain what matters before you buy, from compatibility to performance value.',
  },
  {
    title: 'Quality picks',
    text: 'The store is built around useful computer parts, accessories, and gaming gear.',
  },
  {
    title: 'Friendly support',
    text: 'We want every customer to feel confident, whether they are buying one cable or a full rig.',
  },
  {
    title: 'Community first',
    text: 'XP-Bird grows through every visit, recommendation, checkout, and shared setup idea.',
  },
]

const steps = [
  'Choose the product or setup goal.',
  'Compare details, price, and category.',
  'Add to cart or checkout directly.',
  'Complete payment and get support when needed.',
]

const AboutUs = () => {
  return (
    <div className='about-us-page'>
      <section className='about-hero'>
        <div className='about-hero-shade'>
          <div className='about-shell about-hero-content'>
            <span className='about-page-kicker'>About XP-Bird</span>
            <h1>Tech that feels exciting, useful, and within reach.</h1>
            <p>
              XP-Bird helps gamers, creators, students, and everyday computer users find quality
              components, accessories, and setup upgrades without the confusion.
            </p>
            <div className='about-hero-actions'>
              <Link to='/products' className='about-primary-link'>
                Shop Products
              </Link>
              <a
                href='https://wa.me/254745390073'
                target='_blank'
                rel='noreferrer'
                className='about-secondary-link'
              >
                Talk to Us
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className='about-stats-section'>
        <div className='about-shell about-stats-grid'>
          {stats.map((item) => (
            <div className='about-stat-card' key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className='about-story-section'>
        <div className='about-shell about-story-layout'>
          <div className='about-story-copy'>
            <span className='about-section-label'>Our Story</span>
            <h2>Built for people who love better setups.</h2>
            <p>
              XP-Bird began with a simple idea: shopping for computer parts and gaming accessories
              should feel clear, colorful, and exciting. The store brings together products for
              performance, play, learning, work, and creative projects.
            </p>
            <p>
              We appreciate every customer and every supporter. Your participation helps XP-Bird
              grow, improve the shopping experience, and keep bringing better products to the tech
              community.
            </p>
          </div>

          <div className='about-story-photo' aria-label='Gaming computer setup'>
            <img
              src='https://images.unsplash.com/photo-1591488320449-011701bb6704?w=900&h=700&fit=crop'
              alt='High-performance gaming computer setup'
            />
          </div>
        </div>
      </section>

      <section className='about-focus-section'>
        <div className='about-shell'>
          <div className='about-section-heading'>
            <span className='about-section-label'>What We Focus On</span>
            <h2>Gear for the way you actually use tech.</h2>
          </div>

          <div className='about-focus-grid'>
            {productFocus.map((item) => (
              <article className={`about-focus-card about-focus-${item.tone}`} key={item.title}>
                <span className='about-focus-marker'>{item.title.slice(0, 2).toUpperCase()}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className='about-values-section'>
        <div className='about-shell about-values-layout'>
          <div className='about-values-intro'>
            <span className='about-section-label'>Why Customers Choose Us</span>
            <h2>Helpful, practical, and serious about quality.</h2>
            <p>
              We want XP-Bird to feel like a place where product discovery is simple and every
              purchase moves your setup forward.
            </p>
          </div>

          <div className='about-values-grid'>
            {values.map((value) => (
              <article className='about-value-card' key={value.title}>
                <h3>{value.title}</h3>
                <p>{value.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className='about-process-section'>
        <div className='about-shell about-process-layout'>
          <div>
            <span className='about-section-label'>Shopping Flow</span>
            <h2>From idea to checkout in a few confident steps.</h2>
          </div>

          <div className='about-steps'>
            {steps.map((step, index) => (
              <div className='about-step' key={step}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='about-cta-section'>
        <div className='about-shell about-cta-content'>
          <h2>Ready to build, upgrade, or refresh your setup?</h2>
          <p>
            Explore XP-Bird products and choose the gear that matches your performance, budget, and
            style.
          </p>
          <Link to='/products' className='about-primary-link about-cta-link'>
            Browse the Store
          </Link>
        </div>
      </section>
    </div>
  )
}

export default AboutUs
