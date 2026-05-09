import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import './Homepage.css'

const Homepage = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { totalCount } = useCart()

  const carouselSlides = [
    {
      id: 1,
      title: "XP-Bird Gaming Store",
      subtitle: "Ultimate Gaming & Tech Destination",
      description: "Discover premium gaming gear, high-performance PCs, and cutting-edge technology",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop",
      buttonText: "Explore Gaming Gear",
      buttonLink: "/products"
    },
    {
      id: 2,
      title: "High-Performance PCs",
      subtitle: "Built for Gamers, By Gamers",
      description: "Custom-built gaming rigs with the latest processors and graphics cards",
      image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&h=400&fit=crop",
      buttonText: "View PC Builds",
      buttonLink: "/products"
    },
    {
      id: 3,
      title: "Gaming Peripherals",
      subtitle: "Precision & Performance",
      description: "Mechanical keyboards, gaming mice, monitors, and accessories for competitive play",
      image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&h=400&fit=crop",
      buttonText: "Shop Peripherals",
      buttonLink: "/products"
    },
    {
      id: 4,
      title: "VR & Streaming Gear",
      subtitle: "Next-Gen Entertainment",
      description: "Virtual reality headsets, streaming equipment, and future-ready technology",
      image: "https://images.unsplash.com/photo-1592478411213-6153e4ebc696?w=800&h=400&fit=crop",
      buttonText: "Discover VR",
      buttonLink: "/products"
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) =>
        prevSlide === carouselSlides.length - 1 ? 0 : prevSlide + 1
      )
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(timer)
  }, [carouselSlides.length])

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  const nextSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === carouselSlides.length - 1 ? 0 : prevSlide + 1
    )
  }

  const prevSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? carouselSlides.length - 1 : prevSlide - 1
    )
  }

  return (
    <div className="homepage">
      {/* Hero Carousel */}
      <section className="hero-carousel">
        <div className="carousel-container">
          {carouselSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
              style={{
                '--bg-image': `url(${slide.image})`
              }}
            >
              <div className="carousel-content">
                <h1 className="carousel-title">{slide.title}</h1>
                <h2 className="carousel-subtitle">{slide.subtitle}</h2>
                <p className="carousel-description">{slide.description}</p>
                <Link to={slide.buttonLink} className="carousel-btn">
                  {slide.buttonText}
                </Link>
              </div>
            </div>
          ))}

          {/* Navigation Arrows */}
          <button className="carousel-arrow carousel-arrow-left" onClick={prevSlide}>
            ‹
          </button>
          <button className="carousel-arrow carousel-arrow-right" onClick={nextSlide}>
            ›
          </button>

          {/* Indicators */}
          <div className="carousel-indicators">
            {carouselSlides.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-5">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-4 mb-4">
              <div className="feature-card glass-card">
                <div className="feature-icon">🎮</div>
                <h3>Gaming Gear</h3>
                <p>Premium gaming peripherals and accessories for competitive play</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="feature-card glass-card">
                <div className="feature-icon">⚡</div>
                <h3>High Performance</h3>
                <p>Latest generation processors, GPUs, and cutting-edge technology</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="feature-card glass-card">
                <div className="feature-icon">🤖</div>
                <h3>Expert Support</h3>
                <p>24/7 gaming tech support and build consultation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-preview-section py-5">
        <div className="container">
          <div className="about-preview-panel">
            <div className="row align-items-center g-4">
              <div className="col-lg-7">
                <span className="about-preview-eyebrow">About XP-Bird</span>
                <h2>More than a store: a colorful home for better setups.</h2>
                <p>
                  Meet the idea behind XP-Bird, our product promise, and the way we help gamers,
                  creators, and everyday tech lovers shop with confidence.
                </p>
              </div>
              <div className="col-lg-5">
                <div className="about-preview-actions">
                  <Link to="/about" className="about-preview-btn">
                    Read Our Story
                  </Link>
                  <Link to="/products" className="about-preview-shop">
                    Browse Products
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5">
        <div className="container text-center">
          <div className="cta-card glass-card">
            <h2>Level Up Your Setup</h2>
            <p>Discover the latest gaming technology and build your ultimate rig</p>
            <div className="cta-buttons">
              <Link to="/products" className="cta-btn primary">
                Browse Gaming Gear
              </Link>
              <Link to="/cart" className="cta-btn secondary">
                View Cart {totalCount > 0 && `(${totalCount})`}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Homepage
