// SideMenu.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const XIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M18 6 6 18M6 6l12 12"></path>
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="m9 18 6-6-6-6"></path>
  </svg>
);

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [navigationStack, setNavigationStack] = useState(['main']);

  const menuData = {
    main: {
      title: null,
      items: [
        { name: 'Home', hasSubmenu: false },
        { name: 'Electricals', hasSubmenu: true, submenu: 'electricals' },
        { name: 'Medicines & Treatments', hasSubmenu: true, submenu: 'medicines' },
        { name: 'Health & Wellbeing', hasSubmenu: true, submenu: 'health' },
        { name: 'Skincare & Beauty', hasSubmenu: true, submenu: 'skincare' },
        { name: 'Fragrances & Gift sets', hasSubmenu: true, submenu: 'fragrances' },
        { name: 'Christmas', hasSubmenu: false },
        { name: 'Baby & Child', hasSubmenu: true, submenu: 'baby' },
        { name: 'Toiletries', hasSubmenu: true, submenu: 'toiletries' },
        { name: "Men's Health", hasSubmenu: true, submenu: 'mens' },
        { name: "Women's Health", hasSubmenu: true, submenu: 'womens' },
        { name: 'Travel Shop', hasSubmenu: true, submenu: 'travel' },
        { name: 'Offers', hasSubmenu: true, submenu: 'offers' },
        { name: 'Pet Health', hasSubmenu: false },
        { name: 'Dog', hasSubmenu: true, submenu: 'dog' },
        { name: 'Cat', hasSubmenu: true, submenu: 'cat' },
        { name: 'Small animal', hasSubmenu: true, submenu: 'smallanimal' },
        { name: 'Horse', hasSubmenu: true, submenu: 'horse' },
        { name: 'Brands A-Z', hasSubmenu: false }
      ]
    },
    medicines: {
      title: 'Medicines & Treatments',
      items: [
        { name: 'Pain relief', hasSubmenu: true, submenu: 'painrelief' },
        { name: 'Allergy & hayfever', hasSubmenu: true, submenu: 'allergy' },
        { name: 'Stomach & bowel', hasSubmenu: true, submenu: 'stomach' },
        { name: 'Cold & flu', hasSubmenu: true, submenu: 'coldflu' },
        { name: 'Eyecare & earcare', hasSubmenu: true, submenu: 'eyecare' },
        { name: 'Footcare', hasSubmenu: true, submenu: 'footcare' },
        { name: 'Mouth & oral care', hasSubmenu: true, submenu: 'mouthcare' },
        { name: 'Hair & scalp', hasSubmenu: true, submenu: 'haircare' }
      ]
    },
    allergy: {
      title: 'Allergy & hayfever',
      items: [
        { name: 'Pharmacy Strength', hasSubmenu: false },
        { name: 'Tablets & Capsules', hasSubmenu: false },
        { name: 'Nasal Sprays', hasSubmenu: false },
        { name: 'Eye Drops', hasSubmenu: false },
        { name: 'Liquid Medicines', hasSubmenu: false }
      ]
    },
    painrelief: {
      title: 'Pain relief',
      items: [
        { name: 'Paracetamol', hasSubmenu: false },
        { name: 'Ibuprofen', hasSubmenu: false },
        { name: 'Aspirin', hasSubmenu: false },
        { name: 'Co-codamol', hasSubmenu: false }
      ]
    }
  };

  const currentView = navigationStack[navigationStack.length - 1];
  const currentMenu = menuData[currentView] || menuData.main;

  const handleItemClick = (item: any) => {
    if (item.name === 'Brands A-Z') {
      navigate('/shop/brands');
      handleClose();
    } else if (item.hasSubmenu && item.submenu) {
      setNavigationStack([...navigationStack, item.submenu]);
    }
  };

  const handleBack = () => {
    if (navigationStack.length > 1) {
      setNavigationStack(navigationStack.slice(0, -1));
    }
  };

  const handleClose = () => {
    setNavigationStack(['main']);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 40
        }}
        onClick={handleClose}
      />
      <div style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: '320px',
        backgroundColor: '#fff',
        zIndex: 50,
        overflowY: 'auto'
      }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {currentMenu.title ? (
            <button
              onClick={handleBack}
              style={{
                background: 'none',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                color: '#374151',
                fontWeight: '600'
              }}
            >
              <span style={{ transform: 'rotate(180deg)', display: 'inline-block' }}><ChevronRightIcon /></span>
              <span>{currentMenu.title}</span>
            </button>
          ) : (
            <div></div>
          )}
          <button onClick={handleClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <XIcon />
          </button>
        </div>
        
        {currentMenu.items.map((item, index) => (
          <button
            key={index}
            onClick={() => handleItemClick(item)}
            style={{
              width: '100%',
              padding: '16px 20px',
              textAlign: 'left',
              borderBottom: '1px solid #e5e7eb',
              background: 'none',
              border: 'none',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              fontSize: '16px',
              color: '#1f2937'
            }}
          >
            <span>{item.name}</span>
            {item.hasSubmenu && (
              <span style={{ color: '#9ca3af' }}><ChevronRightIcon /></span>
            )}
          </button>
        ))}
      </div>
    </>
  );
};

export default SideMenu;