// // import React, { useState } from 'react';
// // import './HeaderShop.css';

// // interface HeaderShopProps {
// //   onShopCategoryClick?: () => void;
// // }

// // const HeaderShop: React.FC<HeaderShopProps> = ({ onShopCategoryClick }) => {
// //   const [showCategories, setShowCategories] = useState(false);
// //   const [activeNav, setActiveNav] = useState<string>('');

// //   const navItems = [
// //     { id: 'nhs-prescriptions', label: 'NHS Prescriptions' },
// //     { id: 'weight-management', label: 'Weight Management' },
// //     { id: 'online-doctor', label: 'Online Doctor' },
// //     { id: 'nhs-services', label: 'NHS Services' },
// //     { id: 'pet-health', label: 'Pet Health' },
// //     { id: 'help-support', label: 'Help & Support' },
// //   ];

// //   const categories = [
// //     'Electricals',
// //     'Medicines & Treatments',
// //     'Health & Wellbeing',
// //     'Skincare & Beauty',
// //     'Fragrances & Gift sets',
// //     'Christmas',
// //     'Baby & Child',
// //     'Toiletries',
// //     "Men's Health",
// //     "Women's Health",
// //     'Travel Shop',
// //     'Offers',
// //     'Brands A-Z',
// //   ];

// //   const handleShopCategoryClick = () => {
// //     setShowCategories(!showCategories);
// //     if (onShopCategoryClick) {
// //       onShopCategoryClick();
// //     }
// //   };

// //   return (
// //     <header className="header-shop">
// //       {/* Top Bar - Phone and Cart */}
// //       <div className="top-bar">
// //         <div className="container">
// //           <div className="top-bar-content">
// //             <div className="contact-info">
// //               <span className="phone-icon">📞</span>
// //               <span className="phone-text">0333 103 0909</span>
// //             </div>
            
// //             <div className="cart-info">
// //               <span className="cart-icon">🛒</span>
// //               <span className="cart-text">Cart: £0.00</span>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Main Header */}
// //       <div className="main-header">
// //         <div className="container">
// //           <div className="main-header-content">
// //             {/* Logo */}
// //             <div className="logo-section">
// //               <div className="logo">
// //                 <span className="logo-text">ss Byermeey</span>
// //               </div>
// //             </div>

// //             {/* Search Bar */}
// //             <div className="search-section">
// //               <div className="search-container">
// //                 <input
// //                   type="text"
// //                   placeholder="Search for products..."
// //                   className="search-input"
// //                 />
// //                 <button className="search-button">
// //                   <svg className="search-icon" viewBox="0 0 24 24" width="20" height="20">
// //                     <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
// //                   </svg>
// //                 </button>
// //               </div>
// //             </div>

// //             {/* User Actions */}
// //             <div className="actions-section">
// //               <div className="user-info">
// //                 <span className="user-icon">👤</span>
// //                 <div className="user-details">
// //                   <span className="login-text">Login/Register</span>
// //                   <span className="account-text">My Account</span>
// //                 </div>
// //               </div>
// //               <div className="header-icons">
// //                 <button className="icon-button">
// //                   <span className="icon-text">Q</span>
// //                 </button>
// //                 <button className="icon-button">
// //                   <span className="icon-text">O</span>
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Primary Navigation */}
// //       <nav className="primary-nav">
// //         <div className="container">
// //           <div className="nav-content">
// //             <button 
// //               className={`shop-category-button ${showCategories ? 'active' : ''}`}
// //               onClick={handleShopCategoryClick}
// //             >
// //               <span>Shop by Category</span>
// //               <svg 
// //                 className={`category-arrow ${showCategories ? 'rotated' : ''}`} 
// //                 viewBox="0 0 24 24" 
// //                 width="16" 
// //                 height="16"
// //               >
// //                 <path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
// //               </svg>
// //             </button>

// //             {navItems.map((item) => (
// //               <button
// //                 key={item.id}
// //                 className={`nav-button ${activeNav === item.id ? 'active' : ''}`}
// //                 onClick={() => setActiveNav(item.id)}
// //               >
// //                 {item.label}
// //               </button>
// //             ))}
// //           </div>
// //         </div>
// //       </nav>

// //       {/* Categories Dropdown */}
// //       {showCategories && (
// //         <div className="categories-dropdown">
// //           <div className="container">
// //             <div className="categories-grid">
// //               {categories.map((category, index) => (
// //                 <a key={index} href="#" className="category-link">
// //                   {category}
// //                 </a>
// //               ))}
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Breadcrumb Navigation */}
// //       <div className="breadcrumb-nav">
// //         <div className="container">
// //           <nav className="breadcrumb-links">
// //             <a href="#" className="breadcrumb-link">Home</a>
// //             <span className="breadcrumb-separator">›</span>
// //             <a href="#" className="breadcrumb-link">Medicines & Treatments</a>
// //             <span className="breadcrumb-separator">›</span>
// //             <a href="#" className="breadcrumb-link">Allergy & Hayfever</a>
// //             <span className="breadcrumb-separator">›</span>
// //             <a href="#" className="breadcrumb-link active">Pharmacy Strength</a>
// //           </nav>
// //         </div>
// //       </div>
// //     </header>
// //   );
// // };

// // export default HeaderShop;

// // HeaderShop.tsx
// import React, { useState } from 'react';
// import './HeaderShop.css';

// interface HeaderShopProps {
//   onShopCategoryClick?: () => void;
// }

// const HeaderShop: React.FC<HeaderShopProps> = ({ onShopCategoryClick }) => {
//   const [showCategories, setShowCategories] = useState(false);
//   const [activeNav, setActiveNav] = useState<string>('');

//   const navItems = [
//     { id: 'nhs-prescriptions', label: 'NHS Prescriptions' },
//     { id: 'weight-management', label: 'Weight Management' },
//     { id: 'online-doctor', label: 'Online Doctor' },
//     { id: 'nhs-services', label: 'NHS Services' },
//     { id: 'pet-health', label: 'Pet Health' },
//     { id: 'help-support', label: 'Help & Support' },
//   ];

//   const handleShopCategoryClick = () => {
//     setShowCategories(!showCategories);
//     if (onShopCategoryClick) {
//       onShopCategoryClick();
//     }
//   };

//   return (
//     <header className="header-shop">
//       {/* Top Bar - Phone and Cart */}
//       <div className="top-bar">
//         <div className="container">
//           <div className="top-bar-content">
//             <div className="contact-info">
//               <span className="phone-icon">📞</span>
//               <span className="phone-text">0333 103 0909</span>
//             </div>
            
//             <div className="cart-info">
//               <span className="cart-icon">🛒</span>
//               <span className="cart-text">Cart: £0.00</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Header */}
//       <div className="main-header">
//         <div className="container">
//           <div className="main-header-content">
//             {/* Logo */}
//             <div className="logo-section">
//               <div className="logo">
//                 <span className="logo-text">Pharmacy2U</span>
//               </div>
//             </div>

//             {/* Search Bar */}
//             <div className="search-section">
//               <div className="search-container">
//                 <input
//                   type="text"
//                   placeholder="Search for products..."
//                   className="search-input"
//                 />
//                 <button className="search-button">
//                   <svg className="search-icon" viewBox="0 0 24 24" width="20" height="20">
//                     <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
//                   </svg>
//                 </button>
//               </div>
//             </div>

//             {/* User Actions */}
//             <div className="actions-section">
//               <div className="user-info">
//                 <span className="user-icon">👤</span>
//                 <div className="user-details">
//                   <span className="login-text">Login/Register</span>
//                   <span className="account-text">My Account</span>
//                 </div>
//               </div>
//               <div className="header-icons">
//                 <button className="icon-button">
//                   <span className="icon-text">Q</span>
//                 </button>
//                 <button className="icon-button">
//                   <span className="icon-text">O</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Primary Navigation */}
//       <nav className="primary-nav">
//         <div className="container">
//           <div className="nav-content">
//             <button 
//               className={`shop-category-button ${showCategories ? 'active' : ''}`}
//               onClick={handleShopCategoryClick}
//             >
//               <span>Shop by Category</span>
//               <svg 
//                 className={`category-arrow ${showCategories ? 'rotated' : ''}`} 
//                 viewBox="0 0 24 24" 
//                 width="16" 
//                 height="16"
//               >
//                 <path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
//               </svg>
//             </button>

//             {navItems.map((item) => (
//               <button
//                 key={item.id}
//                 className={`nav-button ${activeNav === item.id ? 'active' : ''}`}
//                 onClick={() => setActiveNav(item.id)}
//               >
//                 {item.label}
//               </button>
//             ))}
//           </div>
//         </div>
//       </nav>
//     </header>
//   );
// };

// export default HeaderShop;
import React from 'react';

const SearchIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

const ShoppingCartIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="8" cy="21" r="1"></circle>
    <circle cx="19" cy="21" r="1"></circle>
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
  </svg>
);

interface HeaderShopProps {
  onMenuClick?: () => void;
}

const HeaderShop: React.FC<HeaderShopProps> = ({ onMenuClick }) => {
  return (
    <header style={{ backgroundColor: '#fff', borderBottom: '1px solid #e5e7eb' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '12px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', width: '32px', height: '32px' }}>
              <div style={{ backgroundColor: '#14b8a6', borderRadius: '2px' }}></div>
              <div style={{ backgroundColor: '#14b8a6', borderRadius: '2px' }}></div>
              <div style={{ backgroundColor: '#14b8a6', borderRadius: '2px' }}></div>
              <div style={{ backgroundColor: '#14b8a6', borderRadius: '2px' }}></div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#14b8a6' }}>Pharmacy</span>
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#14b8a6' }}>2U</span>
            </div>
          </div>
          
          {/* Search Bar */}
          <div style={{ flex: '1', maxWidth: '600px', margin: '0 32px' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search for products..."
                style={{
                  width: '100%',
                  padding: '8px 40px 8px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
              <div style={{ position: 'absolute', right: '12px', top: '10px', color: '#9ca3af' }}>
                <SearchIcon />
              </div>
            </div>
          </div>
          
          {/* Cart and Login */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#14b8a6' }}>
              <ShoppingCartIcon />
            </button>
            <button style={{
              backgroundColor: '#5eead4',
              color: '#fff',
              padding: '8px 20px',
              borderRadius: '6px',
              border: 'none',
              fontWeight: '500',
              fontSize: '14px',
              cursor: 'pointer'
            }}>
              Log In / Register
            </button>
          </div>
        </div>
        
        {/* Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '14px', fontWeight: '500', paddingTop: '8px' }}>
          <button
            onClick={onMenuClick}
            style={{
              background: 'none',
              border: 'none',
              color: '#14b8a6',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Shop by Category
          </button>
          <a href="#" style={{ color: '#374151', textDecoration: 'none' }}>NHS Prescriptions</a>
          <a href="#" style={{ color: '#374151', textDecoration: 'none' }}>Weight Management</a>
          <a href="#" style={{ color: '#374151', textDecoration: 'none' }}>Online Doctor</a>
          <a href="#" style={{ color: '#374151', textDecoration: 'none' }}>NHS Services</a>
          <a href="#" style={{ color: '#374151', textDecoration: 'none' }}>Pet Health</a>
          <a href="#" style={{ color: '#374151', textDecoration: 'none' }}>Help & Support</a>
        </nav>
      </div>
    </header>
  );
};

export default HeaderShop;