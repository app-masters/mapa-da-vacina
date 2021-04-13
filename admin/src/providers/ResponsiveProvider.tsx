import React, { useContext, useEffect, useState } from 'react';
import debounce from 'lodash/debounce';
import { breakpoints } from '../styles/theme';

const ResponsiveContext = React.createContext({
  isMobile: false,
  isTablet: false,
  isLaptop: false
});

/**
 * Responsive provider
 */
const ResponsiveProvider: React.FC = (props) => {
  // Local state
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isLaptop, setIsLaptop] = useState(false);

  /** Set isMobile */
  const handleResize = () => {
    setIsMobile(window.innerWidth < breakpoints.tablet);
    setIsTablet(window.innerWidth < breakpoints.medium);
    setIsLaptop(window.innerWidth < breakpoints.laptop);
  };

  // Resize on page load
  useEffect(() => {
    handleResize();
    // On resize
    window.addEventListener('resize', debounce(handleResize, 150));
  }, []);

  return (
    <ResponsiveContext.Provider
      value={{
        isMobile,
        isTablet,
        isLaptop
      }}
    >
      {props.children}
    </ResponsiveContext.Provider>
  );
};

/**
 * Create custom hook
 */
export const useResponsiveContext = () => {
  return useContext(ResponsiveContext);
};

export default ResponsiveProvider;
