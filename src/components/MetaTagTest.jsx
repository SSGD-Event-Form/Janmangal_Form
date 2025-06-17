import React from "react";
import { useNavigate } from "react-router-dom";

const MetaTagTest = () => {
  const navigate = useNavigate();

  const testRoutes = [
    { path: "/", label: "Home Page", expectedTitle: "જનમંગલ મહોત્સવ - 2026" },
    {
      path: "/gu",
      label: "Gujarati Form (Utara)",
      expectedTitle:
        "જનમંગલ મહોત્સવ - તા. ૦૨-૦૧-૨૦૨૬ થી ૦૮-૦૧-૨૦૨૬ (ઉતારા વ્યવસ્થા ફોર્મ)",
    },
    {
      path: "/en",
      label: "English Form (Utara)",
      expectedTitle:
        "જનમંગલ મહોત્સવ - તા. ૦૨-૦૧-૨૦૨૬ થી ૦૮-૦૧-૨૦૨૬ (ઉતારા વ્યવસ્થા ફોર્મ)",
    },
    {
      path: "/swayamsevak-form",
      label: "Swayam Sevak Form",
      expectedTitle: "જનમંગલ મહોત્સવ - સ્વયં સેવક ફોર્મ",
    },
  ];

  const getCurrentMetaTitle = () => {
    const ogTitleMeta = document.querySelector('meta[property="og:title"]');
    return ogTitleMeta ? ogTitleMeta.getAttribute("content") : "Not found";
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Meta Tag Test - Dynamic OG Title
      </h1>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Current Meta Tags:</h2>
        <p>
          <strong>Page Title:</strong> {document.title}
        </p>
        <p>
          <strong>OG Title:</strong> {getCurrentMetaTitle()}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testRoutes.map((route) => (
          <div key={route.path} className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">{route.label}</h3>
            <p className="text-sm text-gray-600 mb-2">
              Expected: {route.expectedTitle}
            </p>
            <button
              onClick={() => navigate(route.path)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Navigate to {route.label}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-green-50 rounded-lg">
        <h3 className="font-semibold mb-2">How it works:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>
            When you navigate to different routes, the meta tags update
            automatically
          </li>
          <li>Utara forms (/gu, /en) show accommodation-related title</li>
          <li>
            Swayam Sevak form (/swayamsevak-form) shows seva-related title
          </li>
          <li>Home page shows general title</li>
        </ul>
      </div>
    </div>
  );
};

export default MetaTagTest;
