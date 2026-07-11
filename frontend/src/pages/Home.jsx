import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import { FiTruck, FiShield, FiPhoneCall, FiPercent, FiArrowRight } from 'react-icons/fi';
import API from '../utils/api.js';
import ProductCard from '../components/ProductCard.jsx';
import Loader from '../components/Loader.jsx';

// Swiper styling imports
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await API.get('/api/products');
        setProducts(data);
      } catch (error) {
        console.error('Error fetching home products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter lists based on tags
  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);
  const newArrivals = products.filter((p) => p.newArrival).slice(0, 4);
  const bestSellers = products.filter((p) => p.bestSeller).slice(0, 4);

  const heroSlides = [
    {
      image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1200&auto=format&fit=crop',
      title: 'Premium Gaming & Business Laptops',
      subtitle: 'Experience ultimate power and seamless productivity with Intel & Ryzen architectures.',
      link: '/products?category=Laptops',
      cta: 'Explore Laptops'
    },
    {
      image: 'https://images.unsplash.com/photo-1563223552-30d01fda3ea6?q=80&w=1200&auto=format&fit=crop',
      title: 'High-Efficiency Printers',
      subtitle: 'Heavy-duty laser and tank ink solutions for professional and workspace printing.',
      link: '/products?category=Printers',
      cta: 'Explore Printers'
    },
    {
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=1200&auto=format&fit=crop',
      title: 'UltraSharp Monitors & Displays',
      subtitle: 'Unlock true color accuracy and ultra-high refresh rates for creators and gamers.',
      link: '/products?category=Monitors',
      cta: 'Explore Monitors'
    }
  ];

  const categories = [
    { name: 'Laptops', count: products.filter(p => p.category === 'Laptops').length, image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=300' },
    { name: 'Printers', count: products.filter(p => p.category === 'Printers').length, image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?q=80&w=300' },
    { name: 'Monitors', count: products.filter(p => p.category === 'Monitors').length, image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=300' },
    { name: 'Accessories', count: products.filter(p => p.category === 'Accessories').length, image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=300' }
  ];

  const brands = [
    { name: 'HP', logo: 'HP' },
    { name: 'Dell', logo: 'DELL' },
    { name: 'Lenovo', logo: 'LENOVO' },
    { name: 'Canon', logo: 'CANON' },
    { name: 'LG', logo: 'LG' },
    { name: 'Logitech', logo: 'LOGITECH' },
    { name: 'Corsair', logo: 'CORSAIR' }
  ];

  return (
    <div className="pb-16 bg-neutralbg">
      
      {/* Hero Carousel */}
      <div className="relative h-[480px] lg:h-[600px] overflow-hidden bg-slate-950">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          loop={true}
          className="h-full w-full"
        >
          {heroSlides.map((slide, index) => (
            <SwiperSlide key={index} className="relative h-full w-full">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                {/* overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-slate-900/80 to-transparent"></div>
              </div>
              <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center z-10">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="max-w-2xl text-white space-y-6"
                >
                  <span className="bg-accent/25 text-accent border border-accent/40 font-bold uppercase text-xs tracking-widest px-3 py-1.5 rounded-full inline-block">
                    DIGITECH SYSTEMS
                  </span>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
                    {slide.title}
                  </h1>
                  <p className="text-slate-300 text-base md:text-lg leading-relaxed">
                    {slide.subtitle}
                  </p>
                  <div className="pt-4">
                    <Link
                      to={slide.link}
                      className="bg-accent hover:bg-secondary text-white font-bold px-8 py-3.5 rounded-full shadow-lg transition duration-300 transform hover:scale-105 inline-flex items-center space-x-2"
                    >
                      <span>{slide.cta}</span>
                      <FiArrowRight />
                    </Link>
                  </div>
                </motion.div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Services Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-white rounded-2xl shadow-card border border-slate-100 p-8">
          <div className="flex items-center space-x-4 border-r border-slate-100 last:border-0 pr-4 md:border-r">
            <div className="bg-accent/10 p-3.5 rounded-xl text-accent">
              <FiTruck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Free Express Shipping</h4>
              <p className="text-slate-400 text-xs mt-0.5">For all orders above $500</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 border-r border-slate-100 last:border-0 pr-4 md:border-r">
            <div className="bg-highlight/10 p-3.5 rounded-xl text-highlight">
              <FiShield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Official Warranty</h4>
              <p className="text-slate-400 text-xs mt-0.5">100% genuine guaranteed items</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 border-r border-slate-100 last:border-0 pr-4 md:border-r">
            <div className="bg-blue-800/10 p-3.5 rounded-xl text-blue-800">
              <FiPhoneCall className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">24/7 Expert Support</h4>
              <p className="text-slate-400 text-xs mt-0.5">Connect with real technicians</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 last:border-0">
            <div className="bg-red-500/10 p-3.5 rounded-xl text-red-500">
              <FiPercent className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Seasonal Offers</h4>
              <p className="text-slate-400 text-xs mt-0.5">Save with promotional pricing</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Browse Product Categories</h2>
          <p className="text-slate-500 text-sm mt-2">Find the perfect electronics tailored to your personal or professional environment.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/products?category=${category.name}`}
              className="group relative h-48 bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-cardHover border border-slate-100 transition-all duration-300"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                style={{ backgroundImage: `url(${category.image})` }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
              <div className="absolute bottom-5 left-5 text-white">
                <h4 className="font-extrabold text-lg leading-tight">{category.name}</h4>
                <p className="text-slate-300 text-xs mt-1.5 flex items-center">
                  View products <FiArrowRight className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Dynamic Products Sections */}
      {loading ? (
        <Loader />
      ) : products.length === 0 ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card py-16 px-6 max-w-md mx-auto">
            <FiShield className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800">No Products Available</h3>
            <p className="text-slate-500 text-sm mt-2">
              Our inventories are currently being updated. Please check back later or visit our store.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Featured Grid */}
          {featuredProducts.length > 0 && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Featured Gear</h3>
                  <p className="text-slate-500 text-xs mt-1">Handpicked technology selected for its extreme performance.</p>
                </div>
                <Link to="/products?featured=true" className="text-accent hover:text-secondary text-sm font-bold flex items-center space-x-1">
                  <span>See All</span> <FiArrowRight />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </div>
          )}

          {/* Promotional Banner */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="bg-primary text-white rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between">
              {/* background graphic */}
              <div className="absolute right-0 top-0 bg-accent/20 w-80 h-80 rounded-full blur-[100px] pointer-events-none"></div>
              <div className="absolute left-0 bottom-0 bg-secondary/15 w-60 h-60 rounded-full blur-[80px] pointer-events-none"></div>

              <div className="max-w-xl space-y-4 text-center md:text-left z-10">
                <span className="text-highlight font-extrabold text-xs uppercase tracking-widest bg-highlight/10 border border-highlight/20 px-3 py-1 rounded-full inline-block">
                  Special Offer
                </span>
                <h3 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                  Save Big on Your Workspace Upgrades
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Discover outstanding bundles on monitors and laptop stations. Configure your system with premium accessories from Logitech, Corsair, and more.
                </p>
              </div>
              <div className="mt-8 md:mt-0 z-10 flex-shrink-0">
                <Link
                  to="/products?discounted=true"
                  className="bg-white hover:bg-slate-100 text-primary font-bold px-8 py-3.5 rounded-full shadow-lg transition duration-300 transform hover:scale-105 inline-block text-center"
                >
                  Shop the Sale
                </Link>
              </div>
            </div>
          </div>

          {/* New Arrivals & Best Sellers split grids */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* New Arrivals */}
            {newArrivals.length > 0 && (
              <div>
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900">New Arrivals</h3>
                    <p className="text-slate-400 text-xs mt-0.5">Stay up to date with the latest computing equipment.</p>
                  </div>
                  <Link to="/products?newArrival=true" className="text-accent hover:text-secondary text-xs font-bold flex items-center space-x-1">
                    <span>See All</span> <FiArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {newArrivals.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </div>
            )}

            {/* Best Sellers */}
            {bestSellers.length > 0 && (
              <div>
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900">Best Sellers</h3>
                    <p className="text-slate-400 text-xs mt-0.5">Our most popular and highly rated product lines.</p>
                  </div>
                  <Link to="/products?bestSeller=true" className="text-accent hover:text-secondary text-xs font-bold flex items-center space-x-1">
                    <span>See All</span> <FiArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {bestSellers.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </div>
            )}

          </div>
        </>
      )}

      {/* Brands Logo Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-100 mt-8">
        <div className="text-center mb-8">
          <p className="text-slate-400 text-xs font-semibold tracking-widest uppercase">Authorized Dealer For Premium Brands</p>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-7 gap-6 items-center">
          {brands.map((b) => (
            <div 
              key={b.name}
              className="bg-white hover:bg-slate-50 border border-slate-100 hover:border-slate-200 py-4 px-6 rounded-xl text-center font-extrabold text-slate-400 hover:text-slate-600 tracking-wider shadow-sm transition duration-300"
            >
              {b.logo}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Home;
