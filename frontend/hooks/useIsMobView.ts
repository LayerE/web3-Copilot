import React, { useEffect, useState } from "react";

const useIsMobView = () => {
  const [isMobileView, setIsMobileView] = useState(false);
  const resizeListener = () => {
    if (window.innerWidth < 992) {
      setIsMobileView(true);
    } else {
      setIsMobileView(false);
    }
  };

  useEffect(() => {
    //check for windows width
    window.addEventListener("resize", resizeListener);
    resizeListener();
    return () => {
      window.removeEventListener("resize", resizeListener);
    };
  }, []);
  return isMobileView;
};

export default useIsMobView;
