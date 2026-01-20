// import React, { useState, useEffect } from 'react';
// import supabase from '../../supabase'; // Adjust the path based on your structure

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

// const BrandsAZ = () => {
//   const [selectedLetter, setSelectedLetter] = useState('A');
//   const [brands, setBrands] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   const alphabet = '#ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  
//   // Fetch brands from Supabase
//   useEffect(() => {
//     fetchBrands();
//   }, []);

//   const fetchBrands = async () => {
//     try {
//       setLoading(true);
//       const { data, error } = await supabase
//         .from('brand')
//         .select('brandName')
//         .order('brandName', { ascending: true });

//       if (error) throw error;

//       if (data) {
//         // Extract just the brand names from the data
//         const brandNames = data.map(item => item.brandName);
//         setBrands(brandNames);
//       }
//     } catch (err) {
//       console.error('Error fetching brands:', err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Organize brands by their first letter
//   const organizeBrandsByLetter = () => {
//     const organized = {};
    
//     // Initialize all letters
//     alphabet.forEach(letter => {
//       organized[letter] = [];
//     });
    
//     // Sort brands into their respective letter groups
//     brands.forEach(brand => {
//       if (!brand) return;
      
//       // Get the first character
//       const firstChar = brand.charAt(0).toUpperCase();
      
//       // Check if it's a letter
//       if (/[A-Z]/.test(firstChar)) {
//         organized[firstChar].push(brand);
//       } else {
//         // If it's not a letter, put it under '#'
//         organized['#'].push(brand);
//       }
//     });
    
//     // Sort each letter group alphabetically
//     Object.keys(organized).forEach(letter => {
//       organized[letter].sort((a, b) => a.localeCompare(b));
//     });
    
//     return organized;
//   };

//   const brandsByLetter = organizeBrandsByLetter();
//   const currentBrands = brandsByLetter[selectedLetter] || [];

//   return (
//     <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
//       <HeaderShop onMenuClick={() => {}} />
      
//       <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 24px' }}>
//         <h1 style={{ 
//           fontSize: '36px', 
//           fontWeight: 'bold', 
//           color: '#0369a1',
//           textAlign: 'center',
//           marginBottom: '48px'
//         }}>
//           Shop by Brand A-Z
//         </h1>
        
//         {/* Alphabet Navigation */}
//         <div style={{ 
//           display: 'flex', 
//           justifyContent: 'center', 
//           flexWrap: 'wrap',
//           gap: '12px',
//           marginBottom: '48px',
//           padding: '0 20px'
//         }}>
//           {alphabet.map(letter => (
//   <button
//     key={letter}
//     onClick={() => setSelectedLetter(letter)}
//     style={{
//       width: '40px',
//       height: '40px',
//       border: 'none',
//       background: selectedLetter === letter ? '#0369a1' : 'transparent',
//       color: selectedLetter === letter ? '#fff' : '#0369a1',
//       fontSize: '18px',
//       fontWeight: selectedLetter === letter ? 'bold' : '600',
//       cursor: 'pointer',
//       borderRadius: '4px',
//       transition: 'all 0.2s'
//     }}
//     onMouseEnter={(e) => {
//       if (selectedLetter !== letter) {
//         (e.target as HTMLElement).style.backgroundColor = '#e0f2fe';
//       }
//     }}
//     onMouseLeave={(e) => {
//       if (selectedLetter !== letter) {
//         (e.target as HTMLElement).style.backgroundColor = 'transparent';
//       }
//     }}
//   >
//     {letter}
//   </button>
// ))}
//         </div>

//         {/* Selected Letter Heading */}
//         <h2 style={{
//           fontSize: '32px',
//           fontWeight: 'bold',
//           color: '#0369a1',
//           marginBottom: '32px',
//           borderBottom: '3px solid #0369a1',
//           paddingBottom: '8px',
//           display: 'inline-block'
//         }}>
//           {selectedLetter}
//         </h2>

//         {/* Loading/Error States */}
//         {loading ? (
//           <div style={{ textAlign: 'center', padding: '40px' }}>
//             <p style={{ color: '#6b7280', fontSize: '16px' }}>Loading brands...</p>
//           </div>
//         ) : error ? (
//           <div style={{ textAlign: 'center', padding: '40px' }}>
//             <p style={{ color: '#ef4444', fontSize: '16px' }}>Error: {error}</p>
//             <button
//               onClick={fetchBrands}
//               style={{
//                 backgroundColor: '#0369a1',
//                 color: 'white',
//                 border: 'none',
//                 padding: '10px 20px',
//                 borderRadius: '6px',
//                 cursor: 'pointer',
//                 marginTop: '10px'
//               }}
//             >
//               Try Again
//             </button>
//           </div>
//         ) : (
//           /* Brands List */
//           <div style={{ marginTop: '24px' }}>
//             {currentBrands.length > 0 ? (
//               <ul style={{ 
//                 listStyle: 'none', 
//                 padding: 0,
//                 display: 'grid',
//                 gap: '12px'
//               }}>
//                 {currentBrands.map((brand, index) => (
//                  <li key={index}>
//                  <a
//                    href="#"
//                    style={{
//                      display: 'block',
//                      padding: '12px 0',
//                      color: '#374151',
//                      textDecoration: 'none',
//                      fontSize: '16px',
//                      borderBottom: '1px solid #e5e7eb',
//                      transition: 'color 0.2s'
//                    }}
//                    onMouseEnter={(e) => {
//                      (e.target as HTMLElement).style.color = '#0369a1';
//                    }}
//                    onMouseLeave={(e) => {
//                      (e.target as HTMLElement).style.color = '#374151';
//                    }}
//                  >
//                    {brand}
//                  </a>
//                </li>
//                 ))}
//               </ul>
//             ) : (
//               <p style={{ 
//                 color: '#6b7280', 
//                 fontSize: '16px',
//                 fontStyle: 'italic' 
//               }}>
//                 No brands found for "{selectedLetter}".
//               </p>
//             )}
//           </div>
//         )}

//         {/* Total Brands Count */}
//         {!loading && !error && (
//           <div style={{
//             marginTop: '40px',
//             paddingTop: '20px',
//             borderTop: '1px solid #e5e7eb',
//             color: '#6b7280',
//             fontSize: '14px'
//           }}>
//             <p>Total brands: {brands.length}</p>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default BrandsAZ;
import React, { useState, useEffect } from 'react';
import supabase from '../../supabase';
import HeaderShop from './HeaderShop';
import SideMenu from './SideMenu';

const BrandsAZ = () => {
  const [selectedLetter, setSelectedLetter] = useState('A');
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const alphabet = '#ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  
  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('brand')
        .select('brandName')
        .order('brandName', { ascending: true });

      if (error) throw error;

      if (data) {
        const brandNames = data.map(item => item.brandName);
        setBrands(brandNames);
      }
    } catch (err) {
      console.error('Error fetching brands:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const organizeBrandsByLetter = () => {
    const organized = {};
    
    alphabet.forEach(letter => {
      organized[letter] = [];
    });
    
    brands.forEach(brand => {
      if (!brand) return;
      
      const firstChar = brand.charAt(0).toUpperCase();
      
      if (/[A-Z]/.test(firstChar)) {
        organized[firstChar].push(brand);
      } else {
        organized['#'].push(brand);
      }
    });
    
    Object.keys(organized).forEach(letter => {
      organized[letter].sort((a, b) => a.localeCompare(b));
    });
    
    return organized;
  };

  const brandsByLetter = organizeBrandsByLetter();
  const currentBrands = brandsByLetter[selectedLetter] || [];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
<HeaderShop onMenuClick={() => setMenuOpen(true)} />
<SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ 
          fontSize: '36px', 
          fontWeight: 'bold', 
          color: '#0369a1',
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          Shop by Brand A-Z
        </h1>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          flexWrap: 'wrap',
          gap: '6px',
          marginBottom: '40px',
          padding: '0'
        }}>
          {alphabet.map(letter => (
            <button
              key={letter}
              onClick={() => setSelectedLetter(letter)}
              style={{
                width: selectedLetter === letter ? '42px' : '36px', // Bigger width for selected
                height: selectedLetter === letter ? '42px' : '36px', // Bigger height for selected
                border: 'none',
                background: selectedLetter === letter ? '#0369a1' : 'transparent',
                color: selectedLetter === letter ? '#fff' : '#0369a1',
                fontSize: selectedLetter === letter ? '28 px' : '16px', // Bigger font for selected
                fontWeight: selectedLetter === letter ? 'bold' : '600',
                cursor: 'pointer',
                borderRadius: '4px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (selectedLetter !== letter) {
                  (e.target as HTMLElement).style.backgroundColor = '#e0f2fe';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedLetter !== letter) {
                  (e.target as HTMLElement).style.backgroundColor = 'transparent';
                }
              }}
            >
              {letter}
            </button>
          ))}
        </div>

        <div style={{ 
          width: '80%', 
          margin: '0 auto',
          marginBottom: '40px'
        }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#0369a1',
            marginBottom: '24px',
            paddingBottom: '8px',
            textAlign: 'left'
          }}>
            {selectedLetter}
          </h2>

          {loading ? (
            <div style={{ textAlign: 'left', padding: '20px 0' }}>
              <p style={{ color: '#6b7280', fontSize: '16px' }}>Loading brands...</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'left', padding: '20px 0' }}>
              <p style={{ color: '#ef4444', fontSize: '16px' }}>Error: {error}</p>
              <button
                onClick={fetchBrands}
                style={{
                  backgroundColor: '#0369a1',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  marginTop: '10px'
                }}
              >
                Try Again
              </button>
            </div>
          ) : (
            <div style={{ marginTop: '16px' }}>
              {currentBrands.length > 0 ? (
                <ul style={{ 
                  listStyle: 'none', 
                  padding: 0,
                  marginLeft: -40
                }}>
                  {currentBrands.map((brand, index) => (
                    <li key={index}>
                      <a
                        href="#"
                        style={{
                          display: 'block',
                          padding: '10px 0',
                          color: '#374151',
                          textDecoration: 'none',
                          fontSize: '16px',
                          borderBottom: '1px solid #e5e7eb',
                          transition: 'color 0.2s',
                          width: '100%'
                        }}
                        onMouseEnter={(e) => {
                          (e.target as HTMLElement).style.color = '#0369a1';
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLElement).style.color = '#374151';
                        }}
                      >
                        {brand}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ 
                  color: '#6b7280', 
                  fontSize: '16px',
                  fontStyle: 'italic',
                  textAlign: 'left',
                  padding: '20px 0'
                }}>
                  No brands found for "{selectedLetter}".
                </p>
              )}
            </div>
          )}
        </div>

        {!loading && !error && (
          <div style={{
            width: '80%',
            margin: '0 auto',
            marginTop: '40px',
            paddingTop: '20px',
            borderTop: '1px solid #e5e7eb',
            color: '#6b7280',
            fontSize: '14px',
            textAlign: 'left'
          }}>
            <p>Total brands: {brands.length}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default BrandsAZ;