import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { FiSliders, FiRotateCcw, FiSearch } from 'react-icons/fi';
import API from '../utils/api.js';
import ProductCard from '../components/ProductCard.jsx';
import Loader from '../components/Loader.jsx';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // States mirroring URL search parameters
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [brand, setBrand] = useState(searchParams.get('brand') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [featured, setFeatured] = useState(searchParams.get('featured') || '');
  const [bestSeller, setBestSeller] = useState(searchParams.get('bestSeller') || '');
  const [newArrival, setNewArrival] = useState(searchParams.get('newArrival') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || '');

  // Synchronize state values when query parameters change
  useEffect(() => {
    setKeyword(searchParams.get('keyword') || '');
    setCategory(searchParams.get('category') || '');
    setBrand(searchParams.get('brand') || '');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    setFeatured(searchParams.get('featured') || '');
    setBestSeller(searchParams.get('bestSeller') || '');
    setNewArrival(searchParams.get('newArrival') || '');
    setSortBy(searchParams.get('sortBy') || '');
  }, [searchParams]);

  // Fetch filtered products from backend API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (keyword) queryParams.set('keyword', keyword);
        if (category) queryParams.set('category', category);
        if (brand) queryParams.set('brand', brand);
        if (minPrice) queryParams.set('minPrice', minPrice);
        if (maxPrice) queryParams.set('maxPrice', maxPrice);
        if (featured) queryParams.set('featured', featured);
        if (bestSeller) queryParams.set('bestSeller', bestSeller);
        if (newArrival) queryParams.set('newArrival', newArrival);
        if (sortBy) queryParams.set('sortBy', sortBy);

        const { data } = await API.get(`/api/products?${queryParams.toString()}`);
        setProducts(data);
      } catch (error) {
        console.error('Error loading catalog products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword, category, brand, minPrice, maxPrice, featured, bestSeller, newArrival, sortBy]);

  const updateFilters = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchParams({});
    setKeyword('');
    setCategory('');
    setBrand('');
    setMinPrice('');
    setMaxPrice('');
    setFeatured('');
    setBestSeller('');
    setNewArrival('');
    setSortBy('');
    setShowMobileFilters(false);
  };

  const categoriesList = ['Laptops', 'Printers', 'Monitors', 'Accessories'];
  const brandsList = ['HP', 'Dell', 'Lenovo', 'Canon', 'LG', 'Logitech', 'Corsair'];

  const FilterPanelContent = () => (
    <div className="space-y-6">
      
      {/* Category Filter */}
      <div>
        <h4 className="font-bold text-slate-800 text-sm mb-3">Product Category</h4>
        <div className="space-y-2">
          {categoriesList.map((cat) => (
            <label key={cat} className="flex items-center space-x-2 text-sm text-slate-650 cursor-pointer hover:text-accent">
              <input
                type="radio"
                name="categoryGroup"
                checked={category === cat}
                onChange={() => updateFilters('category', cat)}
                className="rounded border-slate-300 text-accent focus:ring-accent"
              />
              <span className={category === cat ? 'font-bold text-accent' : ''}>{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      <div>
        <h4 className="font-bold text-slate-800 text-sm mb-3">Brand</h4>
        <div className="space-y-2">
          {brandsList.map((b) => (
            <label key={b} className="flex items-center space-x-2 text-sm text-slate-650 cursor-pointer hover:text-accent">
              <input
                type="radio"
                name="brandGroup"
                checked={brand === b}
                onChange={() => updateFilters('brand', b)}
                className="rounded border-slate-300 text-accent focus:ring-accent"
              />
              <span className={brand === b ? 'font-bold text-accent' : ''}>{b}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <h4 className="font-bold text-slate-800 text-sm mb-3">Price Range</h4>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => updateFilters('minPrice', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-accent"
          />
          <span className="text-slate-400">-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => updateFilters('maxPrice', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* Flag / Tags Filters */}
      <div>
        <h4 className="font-bold text-slate-800 text-sm mb-3">Tags & Status</h4>
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm text-slate-650 cursor-pointer">
            <input
              type="checkbox"
              checked={featured === 'true'}
              onChange={(e) => updateFilters('featured', e.target.checked ? 'true' : '')}
              className="rounded border-slate-300 text-accent focus:ring-accent"
            />
            <span>Featured Gear</span>
          </label>
          <label className="flex items-center space-x-2 text-sm text-slate-650 cursor-pointer">
            <input
              type="checkbox"
              checked={bestSeller === 'true'}
              onChange={(e) => updateFilters('bestSeller', e.target.checked ? 'true' : '')}
              className="rounded border-slate-300 text-accent focus:ring-accent"
            />
            <span>Best Seller</span>
          </label>
          <label className="flex items-center space-x-2 text-sm text-slate-650 cursor-pointer">
            <input
              type="checkbox"
              checked={newArrival === 'true'}
              onChange={(e) => updateFilters('newArrival', e.target.checked ? 'true' : '')}
              className="rounded border-slate-300 text-accent focus:ring-accent"
            />
            <span>New Arrival</span>
          </label>
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={handleResetFilters}
        className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition duration-200"
      >
        <FiRotateCcw />
        <span>Clear Filters</span>
      </button>

    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Top Banner & Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-6 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Products Catalog</h2>
          <p className="text-slate-400 text-xs mt-1">
            Displaying {products.length} products matching {keyword || category || brand ? 'active search query' : 'all items'}
          </p>
        </div>

        {/* Sort Select */}
        <div className="mt-4 md:mt-0 flex items-center space-x-4 w-full md:w-auto">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden bg-white border border-slate-200 hover:border-slate-300 p-2.5 rounded-xl text-slate-600 shadow-sm flex items-center space-x-1.5 focus:outline-none"
          >
            <FiSliders />
            <span className="text-xs font-bold">Filters</span>
          </button>
          
          <select
            value={sortBy}
            onChange={(e) => updateFilters('sortBy', e.target.value)}
            className="w-full md:w-56 bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-accent shadow-sm"
          >
            <option value="">Sort By: Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block bg-white border border-slate-100 rounded-2xl p-6 shadow-card self-start">
          <h3 className="font-extrabold text-slate-900 text-lg border-b border-slate-55 mb-4 pb-3 flex items-center justify-between">
            <span>Filter By</span>
            <FiSliders className="text-slate-400 w-4 h-4" />
          </h3>
          <FilterPanelContent />
        </div>

        {/* Product Grid View */}
        <div className="lg:col-span-3">
          {loading ? (
            <Loader />
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-card py-20 px-6 text-center max-w-lg mx-auto">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                <FiSearch className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">No Products Found</h3>
              <p className="text-slate-500 text-sm mt-3 leading-relaxed">
                We couldn't find any products matching your specific combinations. Try resetting filters, adjusting prices, or searching for other items.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-6 bg-accent hover:bg-secondary text-white font-bold px-6 py-3 rounded-full shadow-md transition duration-300"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Mobile Filters Drawer Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowMobileFilters(false)}
          ></div>

          <div className="absolute inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl flex flex-col z-50">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-lg">Filters</h3>
              <button 
                onClick={() => setShowMobileFilters(false)}
                className="text-slate-400 hover:text-slate-600 focus:outline-none p-1"
              >
                ✕
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <FilterPanelContent />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Products;
