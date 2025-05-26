// src/components/HomePage/HomePage.tsx
import React from 'react';
import { useMediaQuery } from 'react-responsive';
import HomePageDesktop from './HomePageDesktop';
import HomePageMobile from './HomePageMobile';

const HomePage: React.FC = () => {
  const isDesktop = useMediaQuery({ minWidth: 768 });
  return isDesktop ? <HomePageDesktop /> : <HomePageMobile />;
};

export default HomePage;
