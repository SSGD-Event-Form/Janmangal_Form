import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../public/janmangal logo.png";

function HomePage() {
  const navigate = useNavigate();
  // const [logoVisible, setLogoVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");

  // Animation effects on component mount
  useEffect(() => {
    // Logo animation
    setTimeout(() => {
      // setLogoVisible(true);
    }, 500);

    // Text animation
    setTimeout(() => {
      setTextVisible(true);
    }, 1500);
  }, []);

  // Handle language selection
  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
  };

  // Handle continue button click
  const handleContinue = () => {
    if (selectedLanguage === "english") {
      navigate("/en");
    } else if (selectedLanguage === "gujarati") {
      navigate("/gu");
    }
    // If no language is selected, do nothing
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 px-3">
      {/* Logo with fade-in and bounce animation */}

      <div className="xs:w-96 sm:w-96 md:w-[500px] xs:h-56 sm:h-56 md:h-72">
        <img
          src={logo}
          alt="Logo Front"
          className={`xs:w-96 xs:h-56 sm:w-96 md:w-[500px] sm:h-56 md:h-72 object-contain transition-all duration-1000 ease-out ${
            textVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        />
      </div>

      {/* Welcome Text with fade-in animation */}
      <div
        className={`transition-all duration-1000 ease-out delay-300 ${
          textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        } text-center mt-0`}
      >
        <h1 className="text-4xl font-bold text-orange-600 mb-2 flex justify-center mt-8">Welcome</h1>
        <p className="text-xl text-black font-medium">
          🙏 Jay Shree Swaminarayan 🙏
        </p>
      </div>

      {/* Language Selection */}
      <div
        className={`bg-white rounded-lg shadow-lg p-6 w-full max-w-md mt-8 ${
          textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        } `}
      >
        <h2 className="text-lg font-medium text-gray-700 mb-4">
          Select Language
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleLanguageSelect("english")}
            className={`px-4 py-3 rounded-lg border transition-all duration-300 ${
              selectedLanguage === "english"
                ? "bg-orange-600 hover:bg-orange-700 text-white"
                : "hover:bg-orange-100"
            }`}
          >
            English
          </button>
          <button
            onClick={() => handleLanguageSelect("gujarati")}
            className={`px-4 py-3 rounded-lg border transition-all duration-300 ${
              selectedLanguage === "gujarati"
                ? "bg-orange-600 hover:bg-orange-700 text-white"
                : "hover:bg-orange-100"
            }`}
          >
            ગુજરાતી
          </button>
        </div>

        <button
          onClick={handleContinue}
          disabled={!selectedLanguage}
          className={`mt-6 w-full font-medium py-3 px-4 rounded-lg transition-colors duration-300 ${
            selectedLanguage
              ? "bg-orange-600 hover:bg-orange-700 text-white"
              : "bg-orange-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default HomePage;
