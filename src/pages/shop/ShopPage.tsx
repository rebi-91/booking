// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const SearchIcon = () => (
//   <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//     <circle cx="11" cy="11" r="8"></circle>
//     <path d="m21 21-4.35-4.35"></path>
//   </svg>
// );

// const ShoppingCartIcon = () => (
//   <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//     <circle cx="8" cy="21" r="1"></circle>
//     <circle cx="19" cy="21" r="1"></circle>
//     <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
//   </svg>
// );

// const XIcon = () => (
//   <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//     <path d="M18 6 6 18M6 6l12 12"></path>
//   </svg>
// );

// const ChevronRightIcon = () => (
//   <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//     <path d="m9 18 6-6-6-6"></path>
//   </svg>
// );

// const HeaderShop = ({ onMenuClick }) => {
//   return (
//     <header style={{ backgroundColor: '#fff', borderBottom: '1px solid #e5e7eb' }}>
//       <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '12px 24px' }}>
//         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
//           {/* Logo */}
//           <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', width: '32px', height: '32px' }}>
//               <div style={{ backgroundColor: '#14b8a6', borderRadius: '2px' }}></div>
//               <div style={{ backgroundColor: '#14b8a6', borderRadius: '2px' }}></div>
//               <div style={{ backgroundColor: '#14b8a6', borderRadius: '2px' }}></div>
//               <div style={{ backgroundColor: '#14b8a6', borderRadius: '2px' }}></div>
//             </div>
//             <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
//               <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#14b8a6' }}>Pharmacy</span>
//               <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#14b8a6' }}>2U</span>
//             </div>
//           </div>
          
//           {/* Search Bar */}
//           <div style={{ flex: '1', maxWidth: '600px', margin: '0 32px' }}>
//             <div style={{ position: 'relative' }}>
//               <input
//                 type="text"
//                 placeholder="Search for products..."
//                 style={{
//                   width: '100%',
//                   padding: '8px 40px 8px 16px',
//                   border: '1px solid #d1d5db',
//                   borderRadius: '6px',
//                   fontSize: '14px',
//                   outline: 'none'
//                 }}
//               />
//               <div style={{ position: 'absolute', right: '12px', top: '10px', color: '#9ca3af' }}>
//                 <SearchIcon />
//               </div>
//             </div>
//           </div>
          
//           {/* Cart and Login */}
//           <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
//             <button style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#14b8a6' }}>
//               <ShoppingCartIcon />
//             </button>
//             <button style={{
//               backgroundColor: '#5eead4',
//               color: '#fff',
//               padding: '8px 20px',
//               borderRadius: '6px',
//               border: 'none',
//               fontWeight: '500',
//               fontSize: '14px',
//               cursor: 'pointer'
//             }}>
//               Log In / Register
//             </button>
//           </div>
//         </div>
        
//         {/* Navigation */}
//         <nav style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '14px', fontWeight: '500', paddingTop: '8px' }}>
//           <button
//             onClick={onMenuClick}
//             style={{
//               background: 'none',
//               border: 'none',
//               color: '#14b8a6',
//               cursor: 'pointer',
//               fontSize: '14px',
//               fontWeight: '500'
//             }}
//           >
//             Shop by Category
//           </button>
//           <a href="#" style={{ color: '#374151', textDecoration: 'none' }}>NHS Prescriptions</a>
//           <a href="#" style={{ color: '#374151', textDecoration: 'none' }}>Weight Management</a>
//           <a href="#" style={{ color: '#374151', textDecoration: 'none' }}>Online Doctor</a>
//           <a href="#" style={{ color: '#374151', textDecoration: 'none' }}>NHS Services</a>
//           <a href="#" style={{ color: '#374151', textDecoration: 'none' }}>Pet Health</a>
//           <a href="#" style={{ color: '#374151', textDecoration: 'none' }}>Help & Support</a>
//         </nav>
//       </div>
//     </header>
//   );
// };

// const SideMenu = ({ isOpen, onClose }) => {
//   const [navigationStack, setNavigationStack] = useState(['main']);
//   const navigate = useNavigate(); // Add this line

//   const menuData = {
//     main: {
//       title: null,
//       items: [
//         { name: 'Home', hasSubmenu: false },
//         { name: 'Electricals', hasSubmenu: true, submenu: 'electricals' },
//         { name: 'Medicines & Treatments', hasSubmenu: true, submenu: 'medicines' },
//         { name: 'Health & Wellbeing', hasSubmenu: true, submenu: 'health' },
//         { name: 'Skincare & Beauty', hasSubmenu: true, submenu: 'skincare' },
//         { name: 'Fragrances & Gift sets', hasSubmenu: true, submenu: 'fragrances' },
//         { name: 'Christmas', hasSubmenu: false },
//         { name: 'Baby & Child', hasSubmenu: true, submenu: 'baby' },
//         { name: 'Toiletries', hasSubmenu: true, submenu: 'toiletries' },
//         { name: "Men's Health", hasSubmenu: true, submenu: 'mens' },
//         { name: "Women's Health", hasSubmenu: true, submenu: 'womens' },
//         { name: 'Travel Shop', hasSubmenu: true, submenu: 'travel' },
//         { name: 'Offers', hasSubmenu: true, submenu: 'offers' },
//         { name: 'Pet Health', hasSubmenu: false },
//         { name: 'Dog', hasSubmenu: true, submenu: 'dog' },
//         { name: 'Cat', hasSubmenu: true, submenu: 'cat' },
//         { name: 'Small animal', hasSubmenu: true, submenu: 'smallanimal' },
//         { name: 'Horse', hasSubmenu: true, submenu: 'horse' },
//         { name: 'Brands A-Z', hasSubmenu: false }
//       ]
//     },
//     medicines: {
//       title: 'Medicines & Treatments',
//       items: [
//         { name: 'Pain relief', hasSubmenu: true, submenu: 'painrelief' },
//         { name: 'Allergy & hayfever', hasSubmenu: true, submenu: 'allergy' },
//         { name: 'Stomach & bowel', hasSubmenu: true, submenu: 'stomach' },
//         { name: 'Cold & flu', hasSubmenu: true, submenu: 'coldflu' },
//         { name: 'Eyecare & earcare', hasSubmenu: true, submenu: 'eyecare' },
//         { name: 'Footcare', hasSubmenu: true, submenu: 'footcare' },
//         { name: 'Mouth & oral care', hasSubmenu: true, submenu: 'mouthcare' },
//         { name: 'Hair & scalp', hasSubmenu: true, submenu: 'haircare' }
//       ]
//     },
//     allergy: {
//       title: 'Allergy & hayfever',
//       items: [
//         { name: 'Pharmacy Strength', hasSubmenu: false },
//         { name: 'Tablets & Capsules', hasSubmenu: false },
//         { name: 'Nasal Sprays', hasSubmenu: false },
//         { name: 'Eye Drops', hasSubmenu: false },
//         { name: 'Liquid Medicines', hasSubmenu: false }
//       ]
//     },
//     painrelief: {
//       title: 'Pain relief',
//       items: [
//         { name: 'Paracetamol', hasSubmenu: false },
//         { name: 'Ibuprofen', hasSubmenu: false },
//         { name: 'Aspirin', hasSubmenu: false },
//         { name: 'Co-codamol', hasSubmenu: false }
//       ]
//     }
//   };

//   const currentView = navigationStack[navigationStack.length - 1];
//   const currentMenu = menuData[currentView] || menuData.main;

//   const handleItemClick = (item) => {
//     if (item.name === 'Brands A-Z') {
//       navigate('/shop/brands'); // Navigate to brands page
//       handleClose(); // Close the side menu
//     } else if (item.hasSubmenu && item.submenu) {
//       setNavigationStack([...navigationStack, item.submenu]);
//     }
//   };

//   const handleBack = () => {
//     if (navigationStack.length > 1) {
//       setNavigationStack(navigationStack.slice(0, -1));
//     }
//   };

//   const handleClose = () => {
//     setNavigationStack(['main']);
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <>
//       <div
//         style={{
//           position: 'fixed',
//           inset: 0,
//           backgroundColor: 'rgba(0, 0, 0, 0.5)',
//           zIndex: 40
//         }}
//         onClick={handleClose}
//       />
//       <div style={{
//         position: 'fixed',
//         left: 0,
//         top: 0,
//         bottom: 0,
//         width: '320px',
//         backgroundColor: '#fff',
//         zIndex: 50,
//         overflowY: 'auto'
//       }}>
//         <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           {currentMenu.title ? (
//             <button
//               onClick={handleBack}
//               style={{
//                 background: 'none',
//                 border: 'none',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '8px',
//                 cursor: 'pointer',
//                 fontSize: '16px',
//                 color: '#374151',
//                 fontWeight: '600'
//               }}
//             >
//               <span style={{ transform: 'rotate(180deg)', display: 'inline-block' }}><ChevronRightIcon /></span>
//               <span>{currentMenu.title}</span>
//             </button>
//           ) : (
//             <div></div>
//           )}
//           <button onClick={handleClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
//             <XIcon />
//           </button>
//         </div>
        
//         {currentMenu.items.map((item, index) => (
//           <button
//             key={index}
//             onClick={() => handleItemClick(item)}
//             style={{
//               width: '100%',
//               padding: '16px 20px',
//               textAlign: 'left',
//               borderBottom: '1px solid #e5e7eb',
//               background: 'none',
//               border: 'none',
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               cursor: 'pointer', // Always show pointer for all items now
//               fontSize: '16px',
//               color: '#1f2937'
//             }}
//           >
//             <span>{item.name}</span>
//             {item.hasSubmenu && (
//               <span style={{ color: '#9ca3af' }}><ChevronRightIcon /></span>
//             )}
//           </button>
//         ))}
//       </div>
//     </>
//   );
// };

// const ShopPage = () => {
//   const [menuOpen, setMenuOpen] = useState(false);

//   const products = [
//     { id: 1, name: 'Phenergan Tablets 25mg 56 x 25mg', price: '£15.49' },
//     { id: 2, name: 'Allergy & Hayfever Relief Cetirizine 30 Tablets', price: '£0.79' },
//     { id: 3, name: 'Phenergan Elixir 100ml', price: '£15.49' },
//     { id: 4, name: 'Promethazine 25mg 56 Tablets', price: '£12.49' }
//   ];

//   return (
//     <div style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
//       <HeaderShop onMenuClick={() => setMenuOpen(true)} />
//       <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      
//       <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px' }}>
//         <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
//           Home &gt; Medicines & Treatments &gt; Allergy & Hayfever &gt; <span style={{ fontWeight: '500' }}>Pharmacy Strength</span>
//         </div>
        
//         <h1 style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '16px' }}>Pharmacy Strength</h1>
        
//         <p style={{ color: '#374151', marginBottom: '24px', lineHeight: '1.6' }}>
//           Allergies can be hard work, but we're here to make it a little easier. At Pharmacy2U, we stock a wide range of pharmacy-strength antihistamines, eye drops and nasal sprays, helping you to relieve your symptoms, quickly and effectively.
//         </p>
        
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
//           <span style={{ fontSize: '15px' }}>4 Products</span>
//           <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//             <span style={{ fontSize: '14px' }}>Sort by:</span>
//             <select style={{ border: '1px solid #d1d5db', borderRadius: '4px', padding: '6px 12px', fontSize: '14px' }}>
//               <option>Most Popular</option>
//               <option>Price: Low to High</option>
//               <option>Price: High to Low</option>
//             </select>
//           </div>
//         </div>
        
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
//           {products.map(product => (
//             <div key={product.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px' }}>
//               <div style={{ aspectRatio: '1', backgroundColor: '#f3f4f6', marginBottom: '16px', borderRadius: '4px' }}></div>
//               <h3 style={{ fontSize: '14px', marginBottom: '8px', color: '#111827' }}>{product.name}</h3>
//               <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827' }}>{product.price}</p>
//             </div>
//           ))}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default ShopPage;

import React, { useState } from 'react';
import HeaderShop from './HeaderShop';
import SideMenu from './SideMenu';

const ShopPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const products = [
    { id: 1, name: 'Phenergan Tablets 25mg 56 x 25mg', price: '£15.49' },
    { id: 2, name: 'Allergy & Hayfever Relief Cetirizine 30 Tablets', price: '£0.79' },
    { id: 3, name: 'Phenergan Elixir 100ml', price: '£15.49' },
    { id: 4, name: 'Promethazine 25mg 56 Tablets', price: '£12.49' }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      <HeaderShop onMenuClick={() => setMenuOpen(true)} />
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px' }}>
        <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
          Home &gt; Medicines & Treatments &gt; Allergy & Hayfever &gt; <span style={{ fontWeight: '500' }}>Pharmacy Strength</span>
        </div>
        
        <h1 style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '16px' }}>Pharmacy Strength</h1>
        
        <p style={{ color: '#374151', marginBottom: '24px', lineHeight: '1.6' }}>
          Allergies can be hard work, but we're here to make it a little easier. At Pharmacy2U, we stock a wide range of pharmacy-strength antihistamines, eye drops and nasal sprays, helping you to relieve your symptoms, quickly and effectively.
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <span style={{ fontSize: '15px' }}>4 Products</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px' }}>Sort by:</span>
            <select style={{ border: '1px solid #d1d5db', borderRadius: '4px', padding: '6px 12px', fontSize: '14px' }}>
              <option>Most Popular</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
          {products.map(product => (
            <div key={product.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px' }}>
              <div style={{ aspectRatio: '1', backgroundColor: '#f3f4f6', marginBottom: '16px', borderRadius: '4px' }}></div>
              <h3 style={{ fontSize: '14px', marginBottom: '8px', color: '#111827' }}>{product.name}</h3>
              <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827' }}>{product.price}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ShopPage;