import React, { useEffect } from 'react';

const SplineAnimation: React.FC = () => {
  useEffect(() => {
    // Load the Spline viewer script dynamically
    const loadSplineScript = () => {
      const existingScript = document.querySelector('script[src*="spline-viewer"]');
      
      if (!existingScript) {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://unpkg.com/@splinetool/viewer@1.12.28/build/spline-viewer.js';
        script.async = true;
        document.head.appendChild(script);
        console.log('Spline script loaded');
      }
    };

    loadSplineScript();
  }, []);

  return (
    <div style={styles.container}>
      <spline-viewer
        url="https://prod.spline.design/hSfVY79588JdN7be/scene.splinecode"
        style={styles.viewer}
      />
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#000000',
    width: '100vw',
    height: '100vh',
    margin: 0,
    padding: 0,
    overflow: 'hidden',
    position: 'fixed' as const,
    top: 0,
    left: 0,
    zIndex: 1,
  },
  viewer: {
    width: '100%',
    height: '100%',
    display: 'block' as const,
  },
};

export default SplineAnimation;