import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import API from '../utils/api.js';
import Loader from '../components/Loader.jsx';
import { toast } from 'react-toastify';
import { 
  FiBox, 
  FiUsers, 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiEyeOff, 
  FiEye, 
  FiUploadCloud, 
  FiCheckCircle, 
  FiList,
  FiMail 
} from 'react-icons/fi';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { userInfo } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'products';

  // State collections
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  
  // Loading indicators
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Form modal states
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  // Product Form states
  const [prodName, setProdName] = useState('');
  const [prodDescription, setProdDescription] = useState('');
  const [prodBrand, setProdBrand] = useState('HP');
  const [prodCategory, setProdCategory] = useState('Laptops');
  const [prodPrice, setProdPrice] = useState(0);
  const [prodDiscountPrice, setProdDiscountPrice] = useState(0);
  const [prodStock, setProdStock] = useState(0);
  const [prodImages, setProdImages] = useState([]);
  const [prodSpecs, setProdSpecs] = useState([{ key: '', value: '' }]);
  const [prodFeatured, setProdFeatured] = useState(false);
  const [prodBestSeller, setProdBestSeller] = useState(false);
  const [prodNewArrival, setProdNewArrival] = useState(false);
  const [prodIsHidden, setProdIsHidden] = useState(false);

  // Categories & Brands collections
  const categoriesList = ['Laptops', 'Printers', 'Monitors', 'Accessories'];
  const brandsList = ['HP', 'Dell', 'Lenovo', 'Canon', 'LG', 'Logitech', 'Corsair'];

  // Default suggested specification keys based on category
  const suggestedSpecs = {
    'Laptops': ['Processor', 'RAM', 'Storage', 'Graphics', 'Display', 'Operating System', 'Warranty', 'Color'],
    'Printers': ['Print Speed', 'Connectivity', 'Duplex Printing', 'Functions', 'Paper Capacity', 'Warranty'],
    'Monitors': ['Resolution', 'Refresh Rate', 'Panel Type', 'Response Time', 'Ports', 'Adaptive Sync', 'Warranty'],
    'Accessories': ['Connectivity', 'Battery Life', 'Switches', 'Backlighting', 'Sensor DPI', 'Warranty']
  };

  // Guard routing
  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/');
    }
  }, [userInfo, navigate]);

  // Load active tab data
  useEffect(() => {
    const loadTabData = async () => {
      setLoading(true);
      try {
        if (activeTab === 'products') {
          // Send query parameters stating admin view (returns hidden items too)
          const { data } = await API.get('/api/products?isAdminView=true');
          setProducts(data);
        } else if (activeTab === 'users') {
          const { data } = await API.get('/api/users');
          setUsers(data);
        } else if (activeTab === 'messages') {
          const { data } = await API.get('/api/contact');
          setMessages(data);
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
        toast.error('Error loading tab information');
      } finally {
        setLoading(false);
      }
    };

    if (userInfo && userInfo.isAdmin) {
      loadTabData();
    }
  }, [activeTab, userInfo]);

  const switchTab = (tab) => {
    setSearchParams({ tab });
    setShowProductForm(false);
  };

  // Image Upload Hook using backend multer route
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    setUploading(true);
    try {
      const { data } = await API.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProdImages((prev) => [...prev, ...data.urls]);
      toast.success('Images uploaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeUploadImage = (indexToRemove) => {
    setProdImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Spec list management
  const addSpecRow = (keyName = '', valName = '') => {
    setProdSpecs((prev) => [...prev, { key: keyName, value: valName }]);
  };

  const removeSpecRow = (index) => {
    setProdSpecs((prev) => prev.filter((_, idx) => idx !== index));
  };

  const updateSpecRow = (index, field, val) => {
    setProdSpecs((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, [field]: val } : item))
    );
  };

  const loadPredefinedSpecsForCategory = (cat) => {
    const keys = suggestedSpecs[cat] || [];
    const newSpecs = keys.map((key) => ({ key, value: '' }));
    setProdSpecs(newSpecs);
  };

  // Product crud
  const handleOpenCreateForm = () => {
    setEditingProductId(null);
    setProdName('');
    setProdDescription('');
    setProdBrand(brandsList[0]);
    setProdCategory(categoriesList[0]);
    setProdPrice(0);
    setProdDiscountPrice(0);
    setProdStock(0);
    setProdImages([]);
    // Pre-populate with suggested specs for default category
    loadPredefinedSpecsForCategory(categoriesList[0]);
    setProdFeatured(false);
    setProdBestSeller(false);
    setProdNewArrival(false);
    setProdIsHidden(false);
    setShowProductForm(true);
  };

  const handleOpenEditForm = (prod) => {
    setEditingProductId(prod._id);
    setProdName(prod.name);
    setProdDescription(prod.description);
    setProdBrand(prod.brand);
    setProdCategory(prod.category);
    setProdPrice(prod.price);
    setProdDiscountPrice(prod.discountPrice);
    setProdStock(prod.stock);
    setProdImages(prod.images || []);
    
    // Map specifications Map into Array list
    const specsMap = prod.specifications || {};
    const specsArr = Object.entries(specsMap).map(([key, value]) => ({ key, value }));
    setProdSpecs(specsArr.length > 0 ? specsArr : [{ key: '', value: '' }]);

    setProdFeatured(prod.featured || false);
    setProdBestSeller(prod.bestSeller || false);
    setProdNewArrival(prod.newArrival || false);
    setProdIsHidden(prod.isHidden || false);
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product permanently?')) {
      try {
        await API.delete(`/api/products/${id}`);
        toast.success('Product deleted successfully');
        setProducts((prev) => prev.filter((p) => p._id !== id));
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleProductFormSubmit = async (e) => {
    e.preventDefault();
    if (!prodName || !prodDescription || prodPrice <= 0) {
      toast.error('Please input a valid title, description, and price');
      return;
    }
    if (prodImages.length === 0) {
      toast.error('Please upload at least one product image');
      return;
    }

    // Convert specs back into Object key-value map
    const specifications = {};
    prodSpecs.forEach((spec) => {
      if (spec.key.trim() && spec.value.trim()) {
        specifications[spec.key.trim()] = spec.value.trim();
      }
    });

    const payload = {
      name: prodName,
      description: prodDescription,
      brand: prodBrand,
      category: prodCategory,
      price: Number(prodPrice),
      discountPrice: Number(prodDiscountPrice) || 0,
      stock: Number(prodStock) || 0,
      images: prodImages,
      specifications,
      featured: prodFeatured,
      bestSeller: prodBestSeller,
      newArrival: prodNewArrival,
      isHidden: prodIsHidden
    };

    try {
      if (editingProductId) {
        // Edit flow
        const { data } = await API.put(`/api/products/${editingProductId}`, payload);
        setProducts((prev) => prev.map((p) => (p._id === editingProductId ? data : p)));
        toast.success('Product updated successfully!');
      } else {
        // Create flow
        const { data } = await API.post('/api/products', payload);
        setProducts((prev) => [data, ...prev]);
        toast.success('New product created successfully!');
      }
      setShowProductForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving product details');
    }
  };

  const toggleProductHideStatus = async (prod) => {
    try {
      const updatedValue = !prod.isHidden;
      const { data } = await API.put(`/api/products/${prod._id}`, { isHidden: updatedValue });
      setProducts((prev) => prev.map((p) => (p._id === prod._id ? data : p)));
      toast.success(updatedValue ? 'Product hidden from customers' : 'Product visible to customers');
    } catch (error) {
      toast.error('Failed to change visibility settings');
    }
  };

  const tabs = [
    { id: 'products', label: 'Products Inventory', icon: <FiBox /> },
    { id: 'users', label: 'System Users', icon: <FiUsers /> },
    { id: 'messages', label: 'Customer Messages', icon: <FiMail /> }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-6 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center">
            <span className="bg-red-500 text-white text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded mr-3 shadow-sm">
              Admin Area
            </span>
            <span>DIGITECH CONTROL CENTER</span>
          </h2>
          <p className="text-slate-450 text-xs mt-1">Hello, {userInfo?.name}. System authorization: Level-1 Administrator.</p>
        </div>

        {/* Tab selector */}
        <div className="mt-4 md:mt-0 flex space-x-1.5 bg-slate-100 p-1.5 rounded-2xl">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => switchTab(t.id)}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition duration-200 focus:outline-none ${
                activeTab === t.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {loading && !showProductForm ? (
        <Loader />
      ) : (
        <>
          
          {/* Metrics overview tab removed */}

          {/* TAB 2: PRODUCTS INVENTORY */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-card space-y-6">
              
              <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                <h3 className="text-lg font-extrabold text-slate-900">Manage Catalog Products</h3>
                <button
                  onClick={handleOpenCreateForm}
                  className="bg-accent hover:bg-secondary text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition"
                >
                  <FiPlus />
                  <span>Create Product</span>
                </button>
              </div>

              {/* Products Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-left text-slate-450 uppercase font-bold text-xs">
                      <th className="py-3 px-4">Image</th>
                      <th className="py-3 px-4">Brand</th>
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Stock</th>
                      <th className="py-3 px-4">Visibility</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                        <td className="py-3 px-4">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-10 h-10 object-contain p-1 border rounded bg-slate-50"
                          />
                        </td>
                        <td className="py-3 px-4 text-slate-500 font-semibold">{p.brand}</td>
                        <td className="py-3 px-4 font-bold text-slate-900 max-w-xs truncate">{p.name}</td>
                        <td className="py-3 px-4 text-slate-600">{p.category}</td>
                        <td className="py-3 px-4 font-bold text-slate-800">
                          {p.discountPrice > 0 ? (
                            <span className="text-red-500">₹{p.discountPrice} <span className="text-[10px] text-slate-400 line-through">₹{p.price}</span></span>
                          ) : (
                            `₹${p.price}`
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`font-semibold ${p.stock <= 2 ? 'text-red-500' : 'text-slate-700'}`}>
                            {p.stock} units
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => toggleProductHideStatus(p)}
                            className="focus:outline-none"
                            title={p.isHidden ? 'Hidden (Click to show)' : 'Visible (Click to hide)'}
                          >
                            {p.isHidden ? (
                              <span className="text-red-500 flex items-center text-xs">
                                <FiEyeOff className="mr-1" /> Hidden
                              </span>
                            ) : (
                              <span className="text-green-600 flex items-center text-xs">
                                <FiEye className="mr-1" /> Public
                              </span>
                            )}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEditForm(p)}
                            className="p-2 text-slate-500 hover:text-accent hover:bg-accent/5 rounded-lg transition"
                            title="Edit Product"
                          >
                            <FiEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p._id)}
                            className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                            title="Delete Product"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* Orders Hub tab removed */}

          {/* TAB 4: SYSTEM USERS */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-card space-y-6">
              <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-50 pb-3">Registered Customers</h3>
              
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-left text-slate-455 uppercase font-bold text-xs">
                      <th className="py-3 px-4">User ID</th>
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Phone</th>
                      <th className="py-3 px-4">Authorization</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((usr) => (
                      <tr key={usr._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                        <td className="py-4 px-4 font-mono text-xs text-slate-500">#{usr._id}</td>
                        <td className="py-4 px-4 font-bold text-slate-800">{usr.name}</td>
                        <td className="py-4 px-4 text-slate-600">{usr.email}</td>
                        <td className="py-4 px-4 text-slate-600">{usr.phone || 'N/A'}</td>
                        <td className="py-4 px-4">
                          {usr.isAdmin ? (
                            <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2.5 py-1 rounded-full w-max">
                              Administrator
                            </span>
                          ) : (
                            <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-1 rounded-full w-max">
                              Customer Account
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: CUSTOMER MESSAGES */}
          {activeTab === 'messages' && (
            <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-card space-y-6">
              <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-50 pb-3">Received Messages</h3>
              
              {messages.length === 0 ? (
                <div className="py-12 text-center text-slate-500 border border-dashed rounded-2xl">
                  No contact messages received yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg._id} className="border border-slate-100 rounded-2xl p-5 hover:bg-slate-50/40 transition">
                      <div className="flex justify-between items-start flex-wrap gap-2 mb-2">
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900">{msg.name}</h4>
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <a href={`mailto:${msg.email}`} className="text-accent hover:underline font-semibold">{msg.email}</a>
                            {msg.phone && (
                              <span className="text-slate-400 font-semibold">| Phone: {msg.phone}</span>
                            )}
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold">
                          {new Date(msg.createdAt).toLocaleDateString()} at {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                      {msg.subject && (
                        <p className="text-xs font-bold text-slate-700 mb-1">Subject: {msg.subject}</p>
                      )}
                      <p className="text-xs text-slate-655 text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg mt-2 whitespace-pre-wrap">
                        {msg.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </>
      )}

      {/* DYNAMIC PRODUCT FORM OVERLAY MODAL */}
      {showProductForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowProductForm(false)}
          ></div>

          {/* Modal Content */}
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-4xl p-6 md:p-8 z-10 relative max-h-[90vh] overflow-y-auto">
            
            <button 
              onClick={() => setShowProductForm(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 focus:outline-none p-1.5 text-lg font-bold"
            >
              ✕
            </button>

            <h3 className="text-xl font-extrabold text-slate-900 border-b border-slate-100 pb-3 mb-6">
              {editingProductId ? 'Edit Product Details' : 'Create New Product'}
            </h3>

            <form onSubmit={handleProductFormSubmit} className="space-y-6">
              
              {/* Row 1: Name & Brand & Category */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Product Name</label>
                  <input
                    type="text"
                    placeholder="e.g. ThinkPad E14 Gen 5"
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Brand</label>
                  <select
                    value={prodBrand}
                    onChange={(e) => setProdBrand(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
                  >
                    {brandsList.map((brand) => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Description */}
              <div>
                <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Description</label>
                <textarea
                  rows="3"
                  placeholder="Detail specification features, package highlights, etc."
                  value={prodDescription}
                  onChange={(e) => setProdDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
                  required
                ></textarea>
              </div>

              {/* Row 3: Pricing & Inventory */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div>
                  <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Category</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => {
                      setProdCategory(e.target.value);
                      // load default suggested spec templates for this category
                      loadPredefinedSpecsForCategory(e.target.value);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
                  >
                    {categoriesList.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Price (₹)</label>
                  <input
                    type="number"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Discount Price (₹)</label>
                  <input
                    type="number"
                    placeholder="0 if none"
                    value={prodDiscountPrice}
                    onChange={(e) => setProdDiscountPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Stock Quantity</label>
                  <input
                    type="number"
                    value={prodStock}
                    onChange={(e) => setProdStock(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
                    required
                  />
                </div>
              </div>

              {/* Row 4: Upload System */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-3">Product Images</label>
                
                <div className="flex items-center space-x-6">
                  {/* File Pick Container */}
                  <label className="bg-white border-2 border-dashed border-slate-300 hover:border-accent p-6 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition w-44">
                    <FiUploadCloud className="text-slate-400 w-8 h-8 mb-2 group-hover:text-accent" />
                    <span className="text-[10px] text-slate-500 font-bold text-center">Click to upload files</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="sr-only"
                    />
                  </label>

                  {/* Thumbnail Row Preview */}
                  <div className="flex-1 flex flex-wrap gap-4">
                    {uploading && (
                      <div className="w-20 h-20 border rounded-xl flex items-center justify-center bg-white shadow-sm">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-accent"></div>
                      </div>
                    )}
                    {prodImages.map((url, idx) => (
                      <div key={idx} className="relative w-20 h-20 border rounded-xl bg-white p-1 group shadow-sm flex items-center justify-center">
                        <img src={url} alt={`upload-${idx}`} className="w-full h-full object-contain" />
                        <button
                          type="button"
                          onClick={() => removeUploadImage(idx)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 text-[9px]"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 5: Dynamic Specifications Builder */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-150 pb-2">
                  <h4 className="font-extrabold text-slate-900 text-sm flex items-center">
                    <FiList className="mr-2 text-accent" /> Specifications Builder
                  </h4>
                  <button
                    type="button"
                    onClick={() => addSpecRow('', '')}
                    className="text-xs bg-accent text-white font-bold px-3 py-1.5 rounded-lg hover:bg-secondary transition flex items-center space-x-1"
                  >
                    <FiPlus /> <span>Add custom spec row</span>
                  </button>
                </div>

                {prodSpecs.length === 0 ? (
                  <p className="text-xs text-slate-400">No specifications defined. Click add or category presets to configure.</p>
                ) : (
                  <div className="space-y-2">
                    {prodSpecs.map((spec, index) => (
                      <div key={index} className="flex items-center space-x-3.5">
                        <input
                          type="text"
                          placeholder="e.g. Processor"
                          value={spec.key}
                          onChange={(e) => updateSpecRow(index, 'key', e.target.value)}
                          className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none w-1/3"
                          required
                        />
                        <input
                          type="text"
                          placeholder="e.g. AMD Ryzen 5 5600H"
                          value={spec.value}
                          onChange={(e) => updateSpecRow(index, 'value', e.target.value)}
                          className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none flex-1"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => removeSpecRow(index)}
                          className="text-slate-400 hover:text-red-500 p-2 focus:outline-none"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Row 6: Flag Tags & Hiding Switches */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-2 bg-slate-50 rounded-2xl border border-slate-100">
                <label className="flex items-center space-x-2 text-sm text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodFeatured}
                    onChange={(e) => setProdFeatured(e.target.checked)}
                    className="rounded border-slate-350 text-accent focus:ring-accent"
                  />
                  <span>Featured Product</span>
                </label>
                <label className="flex items-center space-x-2 text-sm text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodBestSeller}
                    onChange={(e) => setProdBestSeller(e.target.checked)}
                    className="rounded border-slate-350 text-accent focus:ring-accent"
                  />
                  <span>Best Seller</span>
                </label>
                <label className="flex items-center space-x-2 text-sm text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodNewArrival}
                    onChange={(e) => setProdNewArrival(e.target.checked)}
                    className="rounded border-slate-350 text-accent focus:ring-accent"
                  />
                  <span>New Arrival</span>
                </label>
                <label className="flex items-center space-x-2 text-sm text-red-600 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodIsHidden}
                    onChange={(e) => setProdIsHidden(e.target.checked)}
                    className="rounded border-slate-350 text-red-500 focus:ring-red-500"
                  />
                  <span>Hide Product from Customers</span>
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowProductForm(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-3 rounded-xl text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-accent hover:bg-secondary text-white font-bold px-8 py-3 rounded-xl text-xs shadow-md transition"
                >
                  {editingProductId ? 'Update Product' : 'Create Product'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
