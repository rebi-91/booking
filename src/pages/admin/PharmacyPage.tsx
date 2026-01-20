import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../supabase';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PharmacyPage.css';

import locationIcon from '../../assets/location.png';
import boxIcon from '../../assets/box.png';
import viewIcon from '../../assets/view.png';
import basketIcon from '../../assets/basket.png';
import closeIcon from '../../assets/close.png';
import checkIcon from '../../assets/check.png';

interface Category {
  category: string;
  categoryImage: string;
}

interface Product {
  id: number;
  cat: string;
  productName: string;
  productImage: string;
  information: string;
  price: string | null;
  strength: string;
  formulation: string;
  size: string;
  brand: string;
  sales?: string | null;
}

interface CartItem extends Product {
  quantity: number;
}

interface PharmacyDB {
  name: string;
  lat: number;
  long: number;
  storeLogo?: string;
}

interface Profile {
  id: string;
  customerID: string;
  activeAddress: string | null;
  location1?: string | null;
  lat1?: number | null;
  long1?: number | null;
  location2?: string | null;
  lat2?: number | null;
  long2?: number | null;
  location3?: string | null;
  lat3?: number | null;
  long3?: number | null;
}

const DEFAULT_CATEGORY_IMAGE = "https://cdn-icons-png.flaticon.com/512/4139/4139981.png";
const DEFAULT_PRODUCT_IMAGE  = "https://cdn-icons-png.flaticon.com/512/7936/7936338.png";

const PharmacyPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  
  // Use a default pharmacy name
  const [pagePharmacyName, setPagePharmacyName] = useState<string>("My Pharmacy");
  const [userID, setUserID] = useState<string>("");
  const [profile, setProfile] = useState<Profile | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [pharmacies, setPharmacies] = useState<PharmacyDB[]>([]);

  const [selectedProducts, setSelectedProducts] = useState<CartItem[]>([]);
  const [checkoutVisible, setCheckoutVisible] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state

  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState<boolean>(false);
  const [searchSuggestions, setSearchSuggestions] = useState<Product[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [showMap, setShowMap] = useState(false);
  const [pharmacyPosition, setPharmacyPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [pharmacyNameInput, setPharmacyNameInput] = useState('');

  const [activeCategory, setActiveCategory] = useState('');
  const [hoveredProductId, setHoveredProductId] = useState<number | null>(null);
  const [clickedProductId, setClickedProductId] = useState<number | null>(null);
  const [isHorizontalView, setIsHorizontalView] = useState(false);

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [pendingOrdersCount, setPendingOrdersCount] = useState<number>(0);
  const [storeLogo, setStoreLogo] = useState<string>('');

  // On mount: fetch profile, categories, products, pharmacies
  useEffect(() => {
    fetchCurrentUserProfile();
    fetchCategories();
    fetchProducts();
    fetchPharmacies();
  }, []);

  // Fetch storeLogo from first pharmacy
  useEffect(() => {
    const fetchPharmacyLogo = async () => {
      const { data, error } = await supabase
        .from('pharmacy')
        .select('storeLogo, name')
        .limit(1)
        .single();
      
      if (!error && data) {
        if (data.storeLogo) {
          setStoreLogo(data.storeLogo);
        }
        if (data.name) {
          setPagePharmacyName(data.name);
        }
      }
    };
    fetchPharmacyLogo();
  }, []);

  // Re-run pending orders count whenever profile changes
  useEffect(() => {
    if (profile?.customerID) {
      fetchPendingOrdersCount(profile.customerID);
    }
  }, [profile]);

  // Fetch current user profile
  async function fetchCurrentUserProfile() {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        console.error("No authenticated user found.");
        return;
      }
      const user_id = userData.user.id;
      setUserID(user_id);

      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user_id)
        .single();
      if (error) {
        console.error("Error fetching profile:", error.message);
        return;
      }
      if (profileData) {
        setProfile(profileData);
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Fetch categories
  async function fetchCategories() {
    const { data, error } = await supabase
      .from('category')
      .select('category, categoryImage');
    if (error) console.error(error);
    if (data) setCategories(data);
  }

  // Fetch products
  async function fetchProducts() {
    const { data, error } = await supabase
      .from('products')  // Make sure this matches your table name
      .select('id, cat, productName, productImage, information, price, strength, formulation, size, brand, sales');
    if (error) console.error(error);
    if (data) {
      console.log('Products loaded:', data.length);
      setProducts(data);
    }
  }

  // Fetch pharmacies
  async function fetchPharmacies() {
    const { data, error } = await supabase
      .from('pharmacy')
      .select('name, lat, long, storeLogo');
    if (error) console.error(error);
    if (data) setPharmacies(data);
  }

  // Fetch pending orders count
  async function fetchPendingOrdersCount(customerID: string) {
    try {
      const { data: rows, error } = await supabase
        .from('sales')
        .select('orderID')
        .eq('status', 'Pending')
        .eq('customerID', customerID);
      if (error) {
        console.error("Error fetching pending orders:", error.message);
        return;
      }
      if (!rows) {
        setPendingOrdersCount(0);
        return;
      }
      const uniqueOrderIDs = new Set<string>();
      rows.forEach(row => {
        if (row.orderID) uniqueOrderIDs.add(row.orderID.trim());
      });
      setPendingOrdersCount(uniqueOrderIDs.size);
    } catch (err: any) {
      console.error("Error fetching pending orders count:", err.message);
    }
  }

  // Filtered products based on category and search
  const filteredProducts = products.filter((product) => {
    if (activeCategory && product.cat !== activeCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        product.productName.toLowerCase().includes(q) ||
        product.id.toString().includes(q)
      );
    }
    return true;
  });

  // Search suggestions effect
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchSuggestions([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    const suggestions = products.filter((p) =>
      p.productName.toLowerCase().includes(q)
    );
    setSearchSuggestions(suggestions);
  }, [searchQuery, products]);

  // Clear search input
  const clearSearch = () => {
    setSearchQuery('');
    setSearchSuggestions([]);
    if (searchInputRef.current) searchInputRef.current.focus();
  };

  // Add to checkout
  const addToCheckout = (product: Product) => {
    setClickedProductId(product.id);
    setSelectedProducts((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  // Remove from checkout
  const removeFromCheckout = (index: number) => {
    setSelectedProducts((prev) => {
      const newArr = [...prev];
      newArr.splice(index, 1);
      return newArr;
    });
  };

  // Change quantity (increment/decrement)
  const changeQuantity = (index: number, delta: number) => {
    setSelectedProducts((prev) => {
      const newArr = [...prev];
      const item = newArr[index];
      const newQty = Math.max(1, item.quantity + delta);
      newArr[index] = { ...item, quantity: newQty };
      return newArr;
    });
  };

  // Manual update of quantity
  const updateQuantity = (index: number, value: string) => {
    let newValue = parseInt(value, 10);
    if (isNaN(newValue) || newValue < 1) newValue = 1;
    setSelectedProducts((prev) => {
      const newArr = [...prev];
      newArr[index].quantity = newValue;
      return newArr;
    });
  };

  // Parse price - Updated for GBP
  const parsePrice = (text: string | null) => {
    if (!text) return 0;
    
    // Handle different formats
    let priceText = text.trim();
    
    // Remove currency symbols and commas
    priceText = priceText.replace(/[£,]/g, '');
    
    // Parse as float
    const asNumber = parseFloat(priceText);
    return isNaN(asNumber) ? 0 : asNumber;
  };

  // Calculate total
  const totalAmount = selectedProducts.reduce((sum, p) => {
    return sum + parsePrice(p.price) * p.quantity;
  }, 0);

  // Create checkout function - Go DIRECTLY to Stripe like your example
  const handleCreateCheckout = async () => {
    setLoading(true); // Start loading
    
    try {
      if (!profile?.customerID) {
        alert("No customer ID found!");
        setLoading(false);
        return;
      }
      if (selectedProducts.length === 0) {
        alert("No items in checkout.");
        setLoading(false);
        return;
      }

      // Generate a unique order ID
      const newOrderID = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Calculate total in pence for Stripe (GBP)
      const totalAmountPence = Math.round(totalAmount * 100);

      // Save order to database first
      try {
        let defaultPharmacyID = "default-pharmacy";
        if (pharmacies.length > 0) {
          defaultPharmacyID = pharmacies[0].name || defaultPharmacyID;
        }
        
        const insertData = selectedProducts.map((item) => ({
          pharmacyID: defaultPharmacyID,
          customerID: profile.customerID,
          productID: item.id.toString(),
          brand: item.brand,
          price: parsePrice(item.price).toString(),
          unitSold: item.quantity.toString(),
          orderID: newOrderID,
          status: 'Pending_Payment',
          total_amount: totalAmount.toString(),
        }));

        // Save to sales table
        const { error: insertError } = await supabase.from('sales').insert(insertData);
        if (insertError) {
          console.error("Error saving order:", insertError.message);
        }

        // Update product sales
        await Promise.all(selectedProducts.map(async (item) => {
          const { data: productData } = await supabase
            .from('products')
            .select('sales')
            .eq('id', item.id)
            .single();

          let currentSales = 0;
          if (productData?.sales) {
            currentSales = parseInt(productData.sales) || 0;
          }

          const newSales = (currentSales + item.quantity).toString();
          await supabase
            .from('products')
            .update({ sales: newSales })
            .eq('id', item.id);
        }));

      } catch (dbError) {
        console.error("Database error:", dbError);
        // Continue anyway
      }

      // Option 1: Call backend to create Stripe session (like your example)
      try {
        const response = await fetch('http://localhost:3000/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            amount: totalAmount,
            currency: 'gbp',
            orderId: newOrderID,
            items: selectedProducts.map(item => ({
              name: item.productName,
              description: `${item.strength} • ${item.formulation} • ${item.size}`,
              price: parsePrice(item.price),
              quantity: item.quantity
            }))
          })
        });
        
        const data = await response.json();
        
        // Redirect to Stripe Checkout - EXACTLY LIKE YOUR EXAMPLE
        window.location.href = data.url;
        
      } catch (error) {
        console.error('Backend call failed:', error);
        
        // Option 2: Direct Stripe payment link (fallback)
        const stripePaymentLink = `https://buy.stripe.com/test_00g3eHdUx8dC09y28a?prefilled_amount=${totalAmountPence}&currency=gbp`;
        
        // Show message
        alert(`Order #${newOrderID} created! Opening Stripe payment page...\n\nTest Card: 4242 4242 4242 4242\nExp: Any future date\nCVC: Any 3 digits`);
        
        // Go directly to Stripe - LIKE YOUR EXAMPLE
        window.location.href = stripePaymentLink;
      }

      // Clear cart and close modal
      setSelectedProducts([]);
      setCheckoutVisible(false);

      // Update pending orders
      if (profile?.customerID) {
        fetchPendingOrdersCount(profile.customerID);
      }

    } catch (err: any) {
      console.error("Error creating checkout:", err.message);
      alert(err.message || "Error creating checkout. Please try again.");
      setLoading(false);
    }
  };

  // Confirm pharmacy location (simplified since we removed map)
  const confirmPharmacyLocation = async () => {
    let chosenName = pagePharmacyName;
    if (pharmacyNameInput.trim()) {
      chosenName = pharmacyNameInput.trim();
      setPagePharmacyName(chosenName);
    }
    if (!chosenName) {
      alert('Please choose or enter a pharmacy name.');
      return;
    }
    if (pharmacyPosition) {
      await supabase.from('pharmacy').insert([
        {
          name: chosenName,
          lat: pharmacyPosition.lat,
          long: pharmacyPosition.lng,
        },
      ]);
    }
    setShowMap(false);
  };

  // Extract user locations from profile
  const getUserLocations = (): Array<{ label: string; index: string }> => {
    if (!profile) return [];
    const arr: Array<{ label: string; index: string }> = [];
    for (let i = 1; i <= 3; i++) {
      const latVal  = (profile as any)[`lat${i}`];
      const longVal = (profile as any)[`long${i}`];
      const locName = (profile as any)[`location${i}`];
      if (latVal && longVal) {
        const labelText = locName || `Location ${i}`;
        arr.push({ label: labelText, index: i.toString() });
      }
    }
    return arr;
  };

  const userLocations = getUserLocations();
  const activeLocationIndex = profile?.activeAddress || null;

  // Switch location in DB
  const handleSelectLocation = async (locationIndex: string) => {
    if (!userID) return;
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ activeAddress: locationIndex })
        .eq('id', userID);
      if (error) {
        console.error("Error updating activeAddress:", error.message);
        alert("Could not set active address");
        return;
      }
      setProfile((prev) => (prev ? { ...prev, activeAddress: locationIndex } : prev));
    } catch (err: any) {
      console.error(err);
    }
  };

  // +Add New Address
  const handleAddNewAddress = () => {
    navigate(`/new-address`);
  };

  // Handle icon click
  const handleIconClick = (iconId: string) => {
    setSelectedIcon((prev) => (prev === iconId ? null : iconId));
  };

  return (
    <div style={{
      backgroundColor: '#000',  // Dark background
      position: 'fixed',           // Covers entire viewport
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'auto', 
    }}>
    <div className="body-background">
      {/* Header with Pharmacy Logo */}
      <div className="pharmacy-header">
        <div className="marquee-container">
          <div className="marquee-content">
            <div className="marquee-text">
              {[1, 2, 3].map((item) => (
                <span key={item} className="marquee-item">
                  {storeLogo && (
                    <img
                      src={storeLogo}
                      alt={`${pagePharmacyName} logo`}
                      className="pharmacy-logo"
                    />
                  )}
                  <span className="header-text">{pagePharmacyName || "Pharmacy"}</span>
                </span>
              ))}
            </div>
            {/** Duplicate the content for seamless effect */}
            <div className="marquee-text">
              {[1, 2, 3].map((item) => (
                <span key={item + '-dup'} className="marquee-item">
                  {storeLogo && (
                    <img
                      src={storeLogo}
                      alt={`${pagePharmacyName} logo`}
                      className="pharmacy-logo"
                    />
                  )}
                  <span className="header-text">{pagePharmacyName || "Pharmacy"}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Search + Location Button */}
      <div className="container mt-0 d-flex align-items-center position-relative">
        <div className="search-container">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search by product name or ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="search-input"
          />
          {searchQuery && (
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                clearSearch();
              }}
              className="clear-button"
            >
              ×
            </button>
          )}
          {searchQuery.length >= 2 && searchSuggestions.length > 0 && (
            <div className="search-suggestions">
              {searchSuggestions.map((item) => (
                <div
                  key={item.id}
                  className="suggestion-item"
                  onMouseDown={() => {
                    setSearchQuery(item.productName);
                    setSearchSuggestions([]);
                  }}
                >
                  {item.productName}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="ms-2" style={{ flex: '0 0 auto', width: '35px', height: '35px', cursor: 'pointer' }}
          onClick={() => setShowLocationModal(true)}
        >
          <img src={locationIcon} alt="Location" className="w-100 h-100" />
        </div>
      </div>

      {/* Category Container */}
      <div className="d-flex px-2 mt-2 categories-container">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.category;
          return (
            <div
              key={cat.category}
              className={`category-card ${isActive ? 'active' : ''}`}
              onClick={() => setActiveCategory(activeCategory === cat.category ? '' : cat.category)}
            >
              <img
                src={cat.categoryImage || DEFAULT_CATEGORY_IMAGE}
                alt={cat.category}
                className={`category-img ${cat.categoryImage ? '' : 'no-image'}`}
              />
              <div className="category-title">
                <h6>{cat.category}</h6>
              </div>
            </div>
          );
        })}
      </div>

      {/* Row with icons: Box, View Toggle, Basket */}
      <div className="d-flex orders-view-basket-row">
        {/* Orders Icon */}
        <div
          className={`icon-container small ${selectedIcon === "orders" ? "selected" : ""}`}
          onClick={() => {
            setSelectedIcon("orders");
          }}
        >
          <img src={boxIcon} alt="Orders" className="w-100 h-100" />
          {pendingOrdersCount > 0 && (
            <div className="badge">{pendingOrdersCount}</div>
          )}
        </div>

        {/* View Toggle Icon */}
        <div
          className={`icon-container medium ${selectedIcon === "viewToggle" ? "selected" : ""}`}
          onClick={() => {
            handleIconClick("viewToggle");
            setIsHorizontalView((prev) => !prev);
          }}
        >
          <img src={viewIcon} alt="Toggle View" className="w-100 h-100" />
        </div>

        {/* Basket Icon */}
        <div
          className={`icon-container small ${selectedIcon === "basket" ? "selected" : ""}`}
          onClick={() => {
            handleIconClick("basket");
            setCheckoutVisible(true);

            setTimeout(() => {
              setSelectedIcon(null);
            }, 1000);
          }}
        >
          <img src={basketIcon} alt="Checkout" className="w-100 h-100" />
          {selectedProducts.length > 0 && (
            <div className="badge">{selectedProducts.length}</div>
          )}
        </div>
      </div>

      {/* Products Section */}
      {isHorizontalView ? (
        <div className="d-flex flex-column px-3 mb-5">
          {/* First Horizontal Row */}
          <div className="d-flex horizontal-products mb-3">
            {filteredProducts.slice(0, Math.ceil(filteredProducts.length / 2)).map((product) => (
              <div
                key={product.id}
                className={`product-card ${clickedProductId === product.id ? 'selected' : ''}`}
                onClick={() => addToCheckout(product)}
                onMouseEnter={() => setHoveredProductId(product.id)}
                onMouseLeave={() => setHoveredProductId(null)}
                style={{ transform: hoveredProductId === product.id ? 'scale(1.05)' : 'scale(1)' }}
              >
                <img
                  src={product.productImage || DEFAULT_PRODUCT_IMAGE}
                  alt={product.productName}
                  className="product-img"
                />
                <div className="product-info text-center">
                  <h6 className="product-title">{product.productName}</h6>
                  <p className="product-subtitle">
                    <strong>{product.strength}</strong> • {product.formulation} • {product.size}
                  </p>
                  <p className="product-price">
                    £{parsePrice(product.price).toLocaleString('en-GB', { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Second Horizontal Row */}
          <div className="d-flex horizontal-products">
            {filteredProducts.slice(Math.ceil(filteredProducts.length / 2)).map((product) => (
              <div
                key={product.id}
                className={`product-card ${clickedProductId === product.id ? 'selected' : ''}`}
                onClick={() => addToCheckout(product)}
                onMouseEnter={() => setHoveredProductId(product.id)}
                onMouseLeave={() => setHoveredProductId(null)}
                style={{ transform: hoveredProductId === product.id ? 'scale(1.05)' : 'scale(1)' }}
              >
                <img
                  src={product.productImage || DEFAULT_PRODUCT_IMAGE}
                  alt={product.productName}
                  className="product-img"
                />
                <div className="product-info text-center">
                  <h6 className="product-title">{product.productName}</h6>
                  <p className="product-subtitle">
                    <strong>{product.strength}</strong> • {product.formulation} • {product.size}
                  </p>
                  <p className="product-price">
                    £{parsePrice(product.price).toLocaleString('en-GB', { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="container mb-5 mt-0 vertical-products">
          <div className="row row-cols-2 row-cols-md-2 row-cols-lg-3 g-3 justify-content-center">
            {filteredProducts.map((product) => (
              <div key={product.id} className="col d-flex justify-content-center" style={{ cursor: 'pointer' }}>
                <div
                  className={`product-card ${clickedProductId === product.id ? 'selected' : ''}`}
                  onClick={() => addToCheckout(product)}
                  onMouseEnter={() => setHoveredProductId(product.id)}
                  onMouseLeave={() => setHoveredProductId(null)}
                  style={{ transform: hoveredProductId === product.id ? 'scale(1.05)' : 'scale(1)' }}
                >
                  <img
                    src={product.productImage || DEFAULT_PRODUCT_IMAGE}
                    alt={product.productName}
                    className="product-img"
                  />
                  <div className="product-info text-center">
                    <h6 className="product-title">{product.productName}</h6>
                    <p className="product-subtitle">
                      <strong>{product.strength}</strong> • {product.formulation} • {product.size}
                    </p>
                    <p className="product-price">
                      £{parsePrice(product.price).toLocaleString('en-GB', { 
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 2 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Checkout Overlay (Modal) */}
      {checkoutVisible && (
        <div className="checkout-modal">
          <div className="checkout-content">
            <button
              onClick={() => setCheckoutVisible(false)}
              className="btn btn-close btn-close-white checkout-close-btn"
            />
            {pagePharmacyName && (
              <div className="pharmacy-label">
                {storeLogo && (
                  <img src={storeLogo} alt={`${pagePharmacyName} logo`} className="checkout-logo" />
                )}
                <span>{pagePharmacyName}</span>
              </div>
            )}
            <div>
              {selectedProducts.map((p, index) => (
                <div key={p.id} className="d-flex align-items-center justify-content-between checkout-item">
                  <img
                    src={p.productImage || DEFAULT_PRODUCT_IMAGE}
                    alt={p.productName}
                    className="checkout-product-img"
                  />
                  <div className="flex-grow-1" style={{ color: '#fff' }}>
                    <strong>{p.productName}</strong>
                    <div className="item-subtitle">
                      {p.strength} • {p.formulation} • {p.size}
                    </div>
                    <div className="item-price">
                      £{parsePrice(p.price).toLocaleString('en-GB', { 
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 2 
                      })}
                    </div>
                    <div className="d-flex align-items-center gap-2 mt-1 quantity-controls">
                      <button onClick={() => changeQuantity(index, -1)} className="btn-quantity">-</button>
                      <input
                        type="number"
                        value={p.quantity}
                        min="1"
                        onChange={(e) => updateQuantity(index, e.target.value)}
                        className="quantity-input"
                      />
                      <button onClick={() => changeQuantity(index, 1)} className="btn-quantity">+</button>
                    </div>
                  </div>
                  <div className="checkout-subtotal">
                    £{(parsePrice(p.price) * p.quantity).toLocaleString('en-GB', { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    })}
                    <button onClick={() => removeFromCheckout(index)} className="btn btn-link text-danger ms-2">
                      X
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-end fs-5 mt-3 mb-3" style={{ color: '#fff' }}>
              Total: £{totalAmount.toLocaleString('en-GB', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
              })}
            </div>
            <button
              className="w-100 fs-5 py-3 mb-2 d-flex align-items-center justify-content-center btn-location"
              onClick={() => setShowLocationModal(true)}
            >
              Set Location
            </button>
            <button
              className="fs-5 py-3 d-flex align-items-center justify-content-center btn-checkout"
              style={{
                background: 'linear-gradient(135deg, #635bff 0%, #8a56ff 100%)',
                border: 'none',
                color: 'white',
                fontWeight: 'bold',
                borderRadius: '10px',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
              onClick={handleCreateCheckout}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner-border spinner-border-sm text-white me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  Processing...
                </>
              ) : (
                <>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="white" 
                    className="me-2"
                  >
                    <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 1.227 0 1.991.495 2.31 1.052l1.713-1.125c-.777-1.216-1.902-1.7-3.487-1.7-1.658 0-3.1.713-3.1 2.529 0 1.523 1.111 2.277 3.502 3.147 2.465.89 3.413 1.863 3.413 3.273 0 1.235-1.064 2.11-2.659 2.11-1.72 0-2.756-.726-3.245-1.841L8.495 15.7c.725 1.63 2.153 2.467 4.032 2.467 2.117 0 3.633-.991 3.633-2.993 0-1.732-1.195-2.562-3.644-3.424z"/>
                  </svg>
                  Pay with Stripe
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Map Modal - Removed since Leaflet is removed */}
      {showMap && (
        <div className="map-modal">
          <div className="alert alert-info">
            Map functionality has been removed. Please update this modal with your preferred mapping solution.
          </div>
          <button onClick={() => setShowMap(false)} className="btn btn-danger mt-3">
            Close
          </button>
        </div>
      )}

      {/* Bottom Sheet Modal for Locations */}
      {showLocationModal && profile && (
        <div className="location-modal">
          <div className="location-modal-close" onClick={() => setShowLocationModal(false)}>
            <img src={closeIcon} alt="Close" style={{ width: '20px', height: '20px' }} />
          </div>
          <button className="btn btn-sm btn-success mb-3 add-location-btn" onClick={handleAddNewAddress}>
            + Add New Location
          </button>
          {userLocations.length === 0 ? (
            <div>No saved locations yet.</div>
          ) : (
            <div className="list-group">
              {userLocations.map((locObj) => {
                const isActive = locObj.index === activeLocationIndex;
                return (
                  <div
                    key={locObj.index}
                    className="list-group-item"
                    onClick={() => handleSelectLocation(locObj.index)}
                  >
                    <div>{locObj.label}</div>
                    {isActive && (
                      <div style={{ display: 'flex', alignItems: 'center', borderRadius: '50%', width: '24px', height: '24px', justifyContent: 'center' }}>
                        <img src={checkIcon} alt="Active" style={{ width: '18px', height: '18px' }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
    </div>
  );
};

export default PharmacyPage;