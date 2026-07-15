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
  FiMail,
  FiDownload,
  FiFileText,
  FiAlertTriangle,
  FiFolder,
  FiArchive,
  FiSettings,
  FiRefreshCw
} from 'react-icons/fi';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { userInfo } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'products';

  // State collections
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  
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
  
  // Bulk Import state declarations
  const [importFile, setImportFile] = useState(null);
  const [importZip, setImportZip] = useState(null);
  const [importFolderFiles, setImportFolderFiles] = useState([]);
  const [importMode, setImportMode] = useState('create_only'); // 'create_only' or 'update_existing'
  const [imageMode, setImageMode] = useState('replace'); // 'replace' or 'append'
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importPhase, setImportPhase] = useState('');
  const [importPhaseDetails, setImportPhaseDetails] = useState('');
  const [importSummary, setImportSummary] = useState(null);
  const [importErrors, setImportErrors] = useState([]);
  const [importSuccess, setImportSuccess] = useState(false);
  const [imageUploadType, setImageUploadType] = useState('zip'); // 'zip' or 'folder'

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

  const handleDownloadSample = async (type) => {
    try {
      const baseUrl = import.meta.env.DEV ? '' : 'https://digitech-backend-btn8.onrender.com';
      const token = userInfo?.token;
      const response = await fetch(`${baseUrl}/api/products/sample/${type}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Download failed');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `sample-products.${type}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Failed to download template:', error);
      toast.error('Failed to download template file');
    }
  };

  const handleImportSubmit = async (e) => {
    e.preventDefault();
    if (!importFile) {
      toast.error('Please upload an Excel or CSV file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', importFile);
    
    if (imageUploadType === 'zip') {
      if (importZip) {
        formData.append('zip', importZip);
      }
    } else {
      if (importFolderFiles && importFolderFiles.length > 0) {
        for (let i = 0; i < importFolderFiles.length; i++) {
          formData.append('images', importFolderFiles[i]);
        }
      }
    }

    formData.append('importMode', importMode);
    formData.append('imageMode', imageMode);

    setImporting(true);
    setImportProgress(0);
    setImportPhase('Reading Excel');
    setImportPhaseDetails('Preparing connection...');
    setImportSummary(null);
    setImportErrors([]);
    setImportSuccess(false);

    try {
      const baseUrl = import.meta.env.DEV ? '' : 'https://digitech-backend-btn8.onrender.com';
      const token = userInfo?.token;
      const response = await fetch(`${baseUrl}/api/products/bulk-import`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Server error occurred');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        buffer = lines.pop();

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const data = JSON.parse(line);
            
            if (data.status === 'reading_excel') {
              setImportPhase('Reading Excel');
              setImportProgress(15);
              setImportPhaseDetails(data.message || '');
            } else if (data.status === 'uploading_images') {
              setImportPhase('Uploading Images');
              const pct = Math.round((data.current / (data.total || 1)) * 60) + 15;
              setImportProgress(pct);
              setImportPhaseDetails(data.message || `Uploading image ${data.current}/${data.total}...`);
            } else if (data.status === 'creating_products') {
              setImportPhase('Creating Products');
              setImportProgress(85);
              setImportPhaseDetails(data.message || '');
            } else if (data.status === 'completed') {
              setImportProgress(100);
              setImportPhase('Completed');
              setImportPhaseDetails('');
              
              if (data.success) {
                setImportSuccess(true);
                setImportSummary(data.summary);
                setImportErrors(data.errors || []);
                toast.success('Bulk import completed!');
                
                // Reset file selections on success
                setImportFile(null);
                setImportZip(null);
                setImportFolderFiles([]);
              } else {
                toast.error(data.error || 'Import failed');
              }
            }
          } catch (err) {
            console.error('Error parsing progress stream line:', err);
          }
        }
      }
    } catch (err) {
      console.error('Import connection failed:', err);
      toast.error(err.message || 'Network error connecting to backend.');
    } finally {
      setImporting(false);
    }
  };

  const tabs = [
    { id: 'products', label: 'Products Inventory', icon: <FiBox /> },
    { id: 'bulk-import', label: 'Bulk Import Products', icon: <FiUploadCloud /> },
    { id: 'users', label: 'System Users', icon: <FiUsers /> }
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

          {/* TAB 3: BULK IMPORT PRODUCTS */}
          {activeTab === 'bulk-import' && (
            <div className="space-y-8">
              
              {/* Style animations */}
              <style>{`
                @keyframes barProgress {
                  from { background-position: 0 0; }
                  to { background-position: 1rem 0; }
                }
                .animate-barProgress {
                  background-size: 1rem 1rem;
                  animation: barProgress 1s linear infinite;
                }
              `}</style>

              {/* Info & Sample Download Header */}
              <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-card flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-extrabold text-slate-900 flex items-center">
                    <FiUploadCloud className="mr-2 text-accent" /> Bulk Import Products
                  </h3>
                  <p className="text-xs text-slate-500">
                    Upload an Excel or CSV sheet with product details and a matching ZIP archive or image folder.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => handleDownloadSample('csv')}
                    className="bg-slate-50 hover:bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 border border-slate-200 transition"
                  >
                    <FiDownload />
                    <span>Download Sample CSV</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownloadSample('excel')}
                    className="bg-slate-50 hover:bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 border border-slate-200 transition"
                  >
                    <FiDownload />
                    <span>Download Sample Excel</span>
                  </button>
                </div>
              </div>

              {/* Import Options & File Upload Grid */}
              <form onSubmit={handleImportSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* 1. Import Settings */}
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-card space-y-6 lg:col-span-1">
                  <h4 className="text-sm font-extrabold text-slate-900 flex items-center border-b border-slate-50 pb-3">
                    <FiSettings className="mr-2 text-accent" /> Import Settings
                  </h4>

                  {/* Import Mode */}
                  <div className="space-y-2">
                    <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider">
                      Import Strategy
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      <label className={`flex items-start p-3 rounded-xl border cursor-pointer transition ${
                        importMode === 'create_only' 
                          ? 'border-accent bg-accent/5' 
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}>
                        <input
                          type="radio"
                          name="importMode"
                          value="create_only"
                          checked={importMode === 'create_only'}
                          onChange={() => setImportMode('create_only')}
                          className="mt-1 mr-3 text-accent focus:ring-accent"
                        />
                        <div>
                          <span className="block text-xs font-bold text-slate-900">Create New Only</span>
                          <span className="block text-[10px] text-slate-400 mt-0.5">Skip rows that already exist in database</span>
                        </div>
                      </label>

                      <label className={`flex items-start p-3 rounded-xl border cursor-pointer transition ${
                        importMode === 'update_existing' 
                          ? 'border-accent bg-accent/5' 
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}>
                        <input
                          type="radio"
                          name="importMode"
                          value="update_existing"
                          checked={importMode === 'update_existing'}
                          onChange={() => setImportMode('update_existing')}
                          className="mt-1 mr-3 text-accent focus:ring-accent"
                        />
                        <div>
                          <span className="block text-xs font-bold text-slate-900">Update Existing Products</span>
                          <span className="block text-[10px] text-slate-450 mt-0.5">Overwrite details of products with matching names/brands</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Image Options (only relevant if updating existing) */}
                  {importMode === 'update_existing' && (
                    <div className="space-y-2 border-t border-slate-50 pt-4 animate-fadeIn">
                      <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider">
                        Image Update Strategy
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <label className={`flex items-center justify-center p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition ${
                          imageMode === 'replace' 
                            ? 'border-accent bg-accent/5 text-accent font-extrabold' 
                            : 'border-slate-200 text-slate-650 hover:bg-slate-50'
                        }`}>
                          <input
                            type="radio"
                            name="imageMode"
                            value="replace"
                            checked={imageMode === 'replace'}
                            onChange={() => setImageMode('replace')}
                            className="sr-only"
                          />
                          <span>Replace Gallery</span>
                        </label>
                        <label className={`flex items-center justify-center p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition ${
                          imageMode === 'append' 
                            ? 'border-accent bg-accent/5 text-accent font-extrabold' 
                            : 'border-slate-200 text-slate-655 hover:bg-slate-50'
                        }`}>
                          <input
                            type="radio"
                            name="imageMode"
                            value="append"
                            checked={imageMode === 'append'}
                            onChange={() => setImageMode('append')}
                            className="sr-only"
                          />
                          <span>Append Gallery</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. File Upload Cards */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Excel/CSV Card */}
                    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-card space-y-4 flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900 flex items-center border-b border-slate-50 pb-3">
                          <FiFileText className="mr-2 text-accent" /> Product Information File
                        </h4>
                        <p className="text-[11px] text-slate-450 mt-2">
                          Select a single spreadsheet (.xlsx or .csv) file matching the template columns structure.
                        </p>
                      </div>

                      <div className="mt-4 flex-1 flex flex-col justify-center">
                        <label className="border-2 border-dashed border-slate-200 hover:border-accent p-6 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition text-center min-h-[160px] bg-slate-50/50 hover:bg-slate-50">
                          <FiUploadCloud className="text-slate-450 w-8 h-8 mb-2" />
                          {importFile ? (
                            <div className="space-y-1">
                              <span className="block text-xs font-bold text-slate-800 truncate max-w-[200px]">
                                {importFile.name}
                              </span>
                              <span className="block text-[9px] text-slate-450">
                                {Math.round(importFile.size / 1024)} KB
                              </span>
                            </div>
                          ) : (
                            <div>
                              <span className="block text-xs font-bold text-slate-700">Choose CSV or Excel</span>
                              <span className="block text-[9px] text-slate-450 mt-1">.csv, .xlsx formats</span>
                            </div>
                          )}
                          <input
                            type="file"
                            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            onChange={(e) => setImportFile(e.target.files[0])}
                            className="sr-only"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Image uploads (ZIP or Folder Card) */}
                    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-card space-y-4 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                          <h4 className="text-sm font-extrabold text-slate-900 flex items-center">
                            {imageUploadType === 'zip' ? <FiArchive className="mr-2 text-accent" /> : <FiFolder className="mr-2 text-accent" />}
                            <span>Product Images</span>
                          </h4>
                          
                          {/* Sub-tab chooser */}
                          <div className="flex bg-slate-100 p-0.5 rounded-lg text-[9px] font-bold">
                            <button
                              type="button"
                              onClick={() => {
                                setImageUploadType('zip');
                                setImportFolderFiles([]);
                              }}
                              className={`px-2.5 py-1 rounded-md transition ${imageUploadType === 'zip' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-550'}`}
                            >
                              ZIP File
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setImageUploadType('folder');
                                setImportZip(null);
                              }}
                              className={`px-2.5 py-1 rounded-md transition ${imageUploadType === 'folder' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-550'}`}
                            >
                              Folder
                            </button>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-450 mt-2">
                          {imageUploadType === 'zip' 
                            ? 'Upload a single compressed ZIP archive containing all product images.'
                            : 'Select the local image folder containing all product images.'}
                        </p>
                      </div>

                      <div className="mt-4 flex-1 flex flex-col justify-center">
                        {imageUploadType === 'zip' ? (
                          <label className="border-2 border-dashed border-slate-200 hover:border-accent p-6 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition text-center min-h-[160px] bg-slate-50/50 hover:bg-slate-50">
                            <FiArchive className="text-slate-450 w-8 h-8 mb-2" />
                            {importZip ? (
                              <div className="space-y-1">
                                <span className="block text-xs font-bold text-slate-800 truncate max-w-[200px]">
                                  {importZip.name}
                                </span>
                                <span className="block text-[9px] text-slate-450">
                                  {Math.round(importZip.size / (1024 * 1024))} MB
                                </span>
                              </div>
                            ) : (
                              <div>
                                <span className="block text-xs font-bold text-slate-700">Choose ZIP File</span>
                                <span className="block text-[9px] text-slate-450 mt-1">.zip archives</span>
                              </div>
                            )}
                            <input
                              type="file"
                              accept=".zip,application/zip,application/x-zip-compressed"
                              onChange={(e) => setImportZip(e.target.files[0])}
                              className="sr-only"
                            />
                          </label>
                        ) : (
                          <label className="border-2 border-dashed border-slate-200 hover:border-accent p-6 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition text-center min-h-[160px] bg-slate-50/50 hover:bg-slate-50">
                            <FiFolder className="text-slate-450 w-8 h-8 mb-2" />
                            {importFolderFiles.length > 0 ? (
                              <div className="space-y-1">
                                <span className="block text-xs font-bold text-slate-800">
                                  {importFolderFiles.length} images selected
                                </span>
                                <span className="block text-[9px] text-slate-450">
                                  Ready to upload
                                </span>
                              </div>
                            ) : (
                              <div>
                                <span className="block text-xs font-bold text-slate-700">Choose Images Folder</span>
                                <span className="block text-[9px] text-slate-450 mt-1">Click to select folder directory</span>
                              </div>
                            )}
                            <input
                              type="file"
                              webkitdirectory=""
                              directory=""
                              multiple
                              onChange={(e) => setImportFolderFiles(Array.from(e.target.files))}
                              className="sr-only"
                            />
                          </label>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Submission Action */}
                  <div className="flex justify-end pt-4 border-t border-slate-50">
                    <button
                      type="submit"
                      disabled={importing || !importFile}
                      className="bg-accent hover:bg-secondary disabled:bg-slate-350 text-white px-8 py-3.5 rounded-2xl text-xs font-extrabold flex items-center justify-center space-x-2 transition shadow-md w-full md:w-max focus:outline-none"
                    >
                      {importing ? (
                        <>
                          <FiRefreshCw className="animate-spin text-sm" />
                          <span>Importing Catalog Data...</span>
                        </>
                      ) : (
                        <>
                          <FiUploadCloud className="text-sm" />
                          <span>Start Import Job</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </form>

              {/* Progress Indicator Card */}
              {(importing || importPhase) && (
                <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-card space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center">
                      <FiRefreshCw className={`mr-2 ${importing ? 'animate-spin' : ''}`} />
                      <span>{importPhase}</span>
                    </span>
                    <span className="text-sm font-extrabold text-slate-900">{importProgress}%</span>
                  </div>

                  {/* Progress bar container */}
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner border border-slate-50">
                    <div
                      className="bg-accent h-full transition-all duration-300 ease-out rounded-full shadow-inner relative"
                      style={{ width: `${importProgress}%` }}
                    >
                      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-barProgress"></div>
                    </div>
                  </div>

                  {/* Details subtext */}
                  {importPhaseDetails && (
                    <p className="text-[11px] font-semibold text-slate-500 italic animate-pulse">
                      {importPhaseDetails}
                    </p>
                  )}
                </div>
              )}

              {/* Import Summary Results */}
              {importSuccess && importSummary && (
                <div className="space-y-6">
                  
                  {/* Summary title */}
                  <h4 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider border-b border-slate-50 pb-2">
                    Import Job Report
                  </h4>

                  {/* Grid layout */}
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    
                    <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col justify-between">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Total Rows</span>
                      <span className="text-xl font-extrabold text-slate-800 mt-2">{importSummary.total}</span>
                    </div>

                    <div className="bg-green-50/20 rounded-2xl border border-green-100 p-4 shadow-sm flex flex-col justify-between">
                      <span className="text-[10px] text-green-600/80 uppercase font-bold">Successful</span>
                      <span className="text-xl font-extrabold text-green-600 mt-2">{importSummary.success}</span>
                    </div>

                    <div className="bg-red-50/20 rounded-2xl border border-red-100 p-4 shadow-sm flex flex-col justify-between">
                      <span className="text-[10px] text-red-500 uppercase font-bold">Failed</span>
                      <span className="text-xl font-extrabold text-red-500 mt-2">{importSummary.failed}</span>
                    </div>

                    <div className="bg-yellow-50/20 rounded-2xl border border-yellow-100 p-4 shadow-sm flex flex-col justify-between">
                      <span className="text-[10px] text-yellow-600 uppercase font-bold">Missing Images</span>
                      <span className="text-xl font-extrabold text-yellow-600 mt-2">{importSummary.missingImages}</span>
                    </div>

                    <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col justify-between">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Duplicates</span>
                      <span className="text-xl font-extrabold text-slate-500 mt-2">{importSummary.duplicates}</span>
                    </div>

                    <div className="bg-blue-50/20 rounded-2xl border border-blue-100 p-4 shadow-sm flex flex-col justify-between">
                      <span className="text-[10px] text-blue-600 uppercase font-bold">Updated</span>
                      <span className="text-xl font-extrabold text-blue-600 mt-2">{importSummary.updated}</span>
                    </div>

                  </div>

                </div>
              )}

              {/* Error and Warnings Logs */}
              {importErrors.length > 0 && (
                <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-card space-y-4">
                  <div className="flex items-center space-x-2 border-b border-slate-50 pb-3">
                    <FiAlertTriangle className="text-red-500 text-lg" />
                    <h4 className="text-sm font-extrabold text-slate-900">
                      Import Error Log ({importErrors.length} notices)
                    </h4>
                  </div>

                  <div className="overflow-x-auto max-h-[400px]">
                    <table className="min-w-full text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 text-left text-slate-450 uppercase font-bold">
                          <th className="py-2.5 px-4 w-20">Row</th>
                          <th className="py-2.5 px-4 w-1/3">Product Name</th>
                          <th className="py-2.5 px-4 text-red-500">Error Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {importErrors.map((err, idx) => (
                          <tr key={idx} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                            <td className="py-2.5 px-4 font-mono font-bold text-slate-500">#{err.row}</td>
                            <td className="py-2.5 px-4 font-bold text-slate-800 truncate max-w-[200px]">{err.name || 'N/A'}</td>
                            <td className="py-2.5 px-4 text-slate-600 font-semibold">{err.error}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

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
