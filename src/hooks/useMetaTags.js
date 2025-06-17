import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const useMetaTags = () => {
  const location = useLocation();

  useEffect(() => {
    const updateMetaTags = () => {
      const path = location.pathname;

      let title = "";
      let description = "";

      if (path === "/swayamsevak-form") {
        title = "જનમંગલ મહોત્સવ - સ્વયં સેવક ફોર્મ";
        description =
          "શ્રી સ્વામિનારાયણ સંસ્કારધામ ગુરૂકુલ - ધ્રાંગધ્રા - સ્વયં સેવક નોંધણી";
      } else if (path === "/gu" || path === "/en") {
        title =
          "જનમંગલ મહોત્સવ - તા. ૦૨-૦૧-૨૦૨૬ થી ૦૮-૦૧-૨૦૨૬ (ઉતારા વ્યવસ્થા ફોર્મ)";
        description = "શ્રી સ્વામિનારાયણ સંસ્કારધામ ગુરૂકુલ - ધ્રાંગધ્રા";
      } else {
        // Default/home page
        title = "જનમંગલ મહોત્સવ - 2026";
        description = "શ્રી સ્વામિનારાયણ સંસ્કારધામ ગુરૂકુલ - ધ્રાંગધ્રા";
      }

      // Update og:title
      let ogTitleMeta = document.querySelector('meta[property="og:title"]');
      if (!ogTitleMeta) {
        ogTitleMeta = document.createElement("meta");
        ogTitleMeta.setAttribute("property", "og:title");
        document.head.appendChild(ogTitleMeta);
      }
      ogTitleMeta.setAttribute("content", title);

      // Update og:description
      let ogDescriptionMeta = document.querySelector(
        'meta[property="og:description"]'
      );
      if (!ogDescriptionMeta) {
        ogDescriptionMeta = document.createElement("meta");
        ogDescriptionMeta.setAttribute("property", "og:description");
        document.head.appendChild(ogDescriptionMeta);
      }
      ogDescriptionMeta.setAttribute("content", description);

      // Update page title
      document.title = title;
    };

    updateMetaTags();
  }, [location.pathname]);
};
