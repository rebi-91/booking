import React, { useEffect } from 'react';

const Animation: React.FC = () => {
  useEffect(() => {
    // Dynamically load the Spline viewer script
    const loadSplineScript = () => {
      const existingScript = document.querySelector('script[src*="spline-viewer"]');
      
      if (!existingScript) {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://unpkg.com/@splinetool/viewer@1.12.28/build/spline-viewer.js';
        script.async = true;
        document.head.appendChild(script);
        
        return script;
      }
      return existingScript;
    };

    loadSplineScript();
    
    // No need to cleanup script in most cases as it can be reused
  }, []);

  return (
    <div style={styles.container}>
      {/* Cast to any to bypass TypeScript error temporarily */}
      <spline-viewer
        url="https://prod.spline.design/Jsp89VACBIuG2rOm/scene.splinecode"
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
  },
  viewer: {
    width: '100%',
    height: '100%',
    display: 'block' as const,
  },
};

export default Animation;