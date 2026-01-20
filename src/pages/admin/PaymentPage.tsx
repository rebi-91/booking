import React, { useState } from 'react';

const PaymentPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 50 })
      });
      
      const data = await response.json();
      
      // Redirect to Stripe Checkout
      window.location.href = data.url;
      
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>Pay School Fees</h1>
      <p>Amount: $50.00</p>
      <button 
        onClick={handlePayment}
        disabled={loading}
        style={{
          padding: '15px 30px',
          fontSize: '18px',
          backgroundColor: loading ? '#ccc' : '#0066ff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Loading...' : 'Pay with Stripe'}
      </button>
      <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        You'll be redirected to Stripe's secure checkout page
      </p>
    </div>
  );
};

export default PaymentPage;

// import React, { useState, useEffect } from 'react';
// import { ShoppingCart, X, Plus, Minus, Trash2, Package, Shield, Truck } from 'lucide-react';

// // Types
// interface Product {
//   id: number;
//   name: string;
//   description: string;
//   price: number;
//   image: string;
//   category: string;
// }

// interface CartItem extends Product {
//   quantity: number;
// }

// const StorePage: React.FC = () => {
//   // State
//   const [products, setProducts] = useState<Product[]>([]);
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [showCart, setShowCart] = useState(false);
//   const [checkoutOpen, setCheckoutOpen] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [customerEmail, setCustomerEmail] = useState('');
//   const [customerName, setCustomerName] = useState('');
//   const [processing, setProcessing] = useState(false);
//   const [checkoutError, setCheckoutError] = useState('');

//   // Fetch products on mount
//   useEffect(() => {
//     fetchProducts();
//     // Load cart from localStorage
//     const savedCart = localStorage.getItem('cart');
//     if (savedCart) {
//       setCart(JSON.parse(savedCart));
//     }
//   }, []);

//   // Save cart to localStorage
//   useEffect(() => {
//     if (cart.length > 0) {
//       localStorage.setItem('cart', JSON.stringify(cart));
//     }
//   }, [cart]);

//   const fetchProducts = async () => {
//     try {
//       const response = await fetch('http://localhost:3000/api/products');
//       const data = await response.json();
//       setProducts(data);
//     } catch (error) {
//       console.error('Error fetching products:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Cart functions
//   const addToCart = (product: Product) => {
//     setCart(prev => {
//       const existing = prev.find(item => item.id === product.id);
//       if (existing) {
//         return prev.map(item =>
//           item.id === product.id
//             ? { ...item, quantity: item.quantity + 1 }
//             : item
//         );
//       }
//       return [...prev, { ...product, quantity: 1 }];
//     });
//   };

//   const updateQuantity = (productId: number, quantity: number) => {
//     if (quantity < 1) {
//       removeFromCart(productId);
//       return;
//     }
//     setCart(prev =>
//       prev.map(item =>
//         item.id === productId ? { ...item, quantity } : item
//       )
//     );
//   };

//   const removeFromCart = (productId: number) => {
//     setCart(prev => prev.filter(item => item.id !== productId));
//   };

//   const getCartTotal = () => {
//     return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
//   };

//   const getCartCount = () => {
//     return cart.reduce((count, item) => count + item.quantity, 0);
//   };

//   // Checkout function
//   const handleCheckout = async () => {
//     if (cart.length === 0) {
//       setCheckoutError('Your cart is empty');
//       return;
//     }
//     if (!customerEmail || !customerName) {
//       setCheckoutError('Please fill in your details');
//       return;
//     }

//     setProcessing(true);
//     setCheckoutError('');

//     try {
//       const response = await fetch('http://localhost:3000/api/create-checkout-session', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           items: cart,
//           customerEmail,
//           customerName
//         }),
//       });

//       const data = await response.json();

//       if (data.error) {
//         throw new Error(data.error);
//       }

//       // Open Stripe Checkout in popup
//       const width = 600;
//       const height = 700;
//       const left = (window.innerWidth - width) / 2;
//       const top = (window.innerHeight - height) / 2;

//       const popup = window.open(
//         data.url,
//         'Stripe Checkout',
//         `width=${width},height=${height},top=${top},left=${left}`
//       );

//       if (popup) {
//         // Poll for popup closure
//         const checkPopup = setInterval(() => {
//           if (popup.closed) {
//             clearInterval(checkPopup);
//             // Check if payment was successful
//             checkPaymentStatus();
//             setCheckoutOpen(false);
//             // Clear cart after successful checkout
//             setCart([]);
//             localStorage.removeItem('cart');
//           }
//         }, 500);
//       } else {
//         // If popup blocked, redirect in same window
//         window.location.href = data.url;
//       }

//     } catch (error) {
//       console.error('Checkout error:', error);
//       setCheckoutError(error instanceof Error ? error.message : 'Checkout failed');
//     } finally {
//       setProcessing(false);
//     }
//   };

//   const checkPaymentStatus = async () => {
//     // You would typically check payment status via webhook or polling
//     alert('Thank you for your purchase! Check your email for confirmation.');
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading store...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow-sm sticky top-0 z-50">
//         <div className="container mx-auto px-4 py-4">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">🛍️ TechStore</h1>
//               <p className="text-sm text-gray-600">Premium Electronics & Gadgets</p>
//             </div>
            
//             <button
//               onClick={() => setShowCart(true)}
//               className="relative p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition"
//             >
//               <ShoppingCart className="w-6 h-6 text-gray-700" />
//               {cart.length > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
//                   {getCartCount()}
//                 </span>
//               )}
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="container mx-auto px-4 py-8">
//         {/* Store Features */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
//           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//             <div className="flex items-center mb-4">
//               <Truck className="w-8 h-8 text-blue-600 mr-3" />
//               <div>
//                 <h3 className="font-semibold">Free UK Shipping</h3>
//                 <p className="text-sm text-gray-600">On orders over £50</p>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//             <div className="flex items-center mb-4">
//               <Shield className="w-8 h-8 text-green-600 mr-3" />
//               <div>
//                 <h3 className="font-semibold">2-Year Warranty</h3>
//                 <p className="text-sm text-gray-600">On all products</p>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//             <div className="flex items-center mb-4">
//               <Package className="w-8 h-8 text-purple-600 mr-3" />
//               <div>
//                 <h3 className="font-semibold">Easy Returns</h3>
//                 <p className="text-sm text-gray-600">30-day return policy</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Products Grid */}
//         <div className="mb-8">
//           <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Products</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {products.map(product => (
//               <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
//                 <div className="h-48 overflow-hidden">
//                   <img 
//                     src={product.image} 
//                     alt={product.name}
//                     className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
//                   />
//                 </div>
//                 <div className="p-6">
//                   <div className="flex justify-between items-start mb-2">
//                     <div>
//                       <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
//                         {product.category}
//                       </span>
//                       <h3 className="font-bold text-lg mt-2">{product.name}</h3>
//                     </div>
//                     <span className="text-xl font-bold text-gray-900">£{product.price.toFixed(2)}</span>
//                   </div>
//                   <p className="text-gray-600 text-sm mb-4">{product.description}</p>
//                   <button
//                     onClick={() => addToCart(product)}
//                     className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center"
//                   >
//                     <Plus className="w-4 h-4 mr-2" />
//                     Add to Cart
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </main>

//       {/* Cart Sidebar */}
//       {showCart && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
//           <div className="bg-white w-full max-w-md h-full overflow-y-auto">
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold">Your Cart</h2>
//                 <button
//                   onClick={() => setShowCart(false)}
//                   className="p-2 hover:bg-gray-100 rounded-full"
//                 >
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>

//               {cart.length === 0 ? (
//                 <div className="text-center py-12">
//                   <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                   <p className="text-gray-500">Your cart is empty</p>
//                 </div>
//               ) : (
//                 <>
//                   <div className="space-y-4 mb-6">
//                     {cart.map(item => (
//                       <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
//                         <img 
//                           src={item.image} 
//                           alt={item.name}
//                           className="w-16 h-16 object-cover rounded"
//                         />
//                         <div className="flex-1">
//                           <h4 className="font-semibold">{item.name}</h4>
//                           <p className="text-gray-600 text-sm">£{item.price.toFixed(2)} each</p>
//                           <div className="flex items-center space-x-3 mt-2">
//                             <button
//                               onClick={() => updateQuantity(item.id, item.quantity - 1)}
//                               className="p-1 hover:bg-gray-200 rounded"
//                             >
//                               <Minus className="w-4 h-4" />
//                             </button>
//                             <span className="font-medium">{item.quantity}</span>
//                             <button
//                               onClick={() => updateQuantity(item.id, item.quantity + 1)}
//                               className="p-1 hover:bg-gray-200 rounded"
//                             >
//                               <Plus className="w-4 h-4" />
//                             </button>
//                             <button
//                               onClick={() => removeFromCart(item.id)}
//                               className="ml-auto text-red-600 hover:text-red-700"
//                             >
//                               <Trash2 className="w-4 h-4" />
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   <div className="border-t pt-6">
//                     <div className="flex justify-between mb-2">
//                       <span className="text-gray-600">Subtotal</span>
//                       <span className="font-semibold">£{getCartTotal().toFixed(2)}</span>
//                     </div>
//                     <div className="flex justify-between mb-2">
//                       <span className="text-gray-600">Shipping</span>
//                       <span className="font-semibold">Free</span>
//                     </div>
//                     <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t">
//                       <span>Total</span>
//                       <span>£{getCartTotal().toFixed(2)}</span>
//                     </div>

//                     <button
//                       onClick={() => {
//                         setShowCart(false);
//                         setCheckoutOpen(true);
//                       }}
//                       className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg mt-6 hover:bg-green-700 transition"
//                     >
//                       Proceed to Checkout
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Checkout Popup */}
//       {checkoutOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-8">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold">Checkout</h2>
//                 <button
//                   onClick={() => setCheckoutOpen(false)}
//                   className="p-2 hover:bg-gray-100 rounded-full"
//                   disabled={processing}
//                 >
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>

//               <div className="space-y-6">
//                 {/* Order Summary */}
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <h3 className="font-semibold mb-3">Order Summary</h3>
//                   {cart.map(item => (
//                     <div key={item.id} className="flex justify-between items-center py-2">
//                       <div>
//                         <span className="font-medium">{item.name}</span>
//                         <span className="text-gray-600 text-sm ml-2">×{item.quantity}</span>
//                       </div>
//                       <span>£{(item.price * item.quantity).toFixed(2)}</span>
//                     </div>
//                   ))}
//                   <div className="border-t pt-3 mt-3">
//                     <div className="flex justify-between font-bold">
//                       <span>Total</span>
//                       <span>£{getCartTotal().toFixed(2)}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Customer Details */}
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Full Name *
//                     </label>
//                     <input
//                       type="text"
//                       value={customerName}
//                       onChange={(e) => setCustomerName(e.target.value)}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       placeholder="John Smith"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Email Address *
//                     </label>
//                     <input
//                       type="email"
//                       value={customerEmail}
//                       onChange={(e) => setCustomerEmail(e.target.value)}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       placeholder="john@example.com"
//                       required
//                     />
//                   </div>
//                 </div>

//                 {/* Error Message */}
//                 {checkoutError && (
//                   <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
//                     {checkoutError}
//                   </div>
//                 )}

//                 {/* Payment Info */}
//                 <div className="bg-blue-50 p-4 rounded-lg">
//                   <h4 className="font-semibold text-blue-900 mb-2">💳 Secure Payment</h4>
//                   <p className="text-sm text-blue-800">
//                     You'll be redirected to Stripe's secure checkout page. 
//                     Test card: <code className="bg-white px-2 py-1 rounded">4242 4242 4242 4242</code>
//                   </p>
//                 </div>

//                 {/* Checkout Button */}
//                 <button
//                   onClick={handleCheckout}
//                   disabled={processing || cart.length === 0}
//                   className={`w-full py-4 rounded-lg font-bold text-lg transition ${
//                     processing || cart.length === 0
//                       ? 'bg-gray-400 cursor-not-allowed'
//                       : 'bg-blue-600 hover:bg-blue-700 text-white'
//                   }`}
//                 >
//                   {processing ? (
//                     <span className="flex items-center justify-center">
//                       <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
//                       Processing...
//                     </span>
//                   ) : (
//                     `Pay £${getCartTotal().toFixed(2)}`
//                   )}
//                 </button>

//                 <p className="text-center text-sm text-gray-500">
//                   Powered by Stripe • Your payment is secure
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Cart Notification */}
//       {!showCart && cart.length > 0 && (
//         <div className="fixed bottom-6 right-6 z-40">
//           <div className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-3">
//             <ShoppingCart className="w-5 h-5" />
//             <span>{getCartCount()} items • £{getCartTotal().toFixed(2)}</span>
//             <button
//               onClick={() => setShowCart(true)}
//               className="bg-white text-blue-600 px-4 py-1 rounded-full text-sm font-semibold hover:bg-gray-100"
//             >
//               View Cart
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default StorePage;