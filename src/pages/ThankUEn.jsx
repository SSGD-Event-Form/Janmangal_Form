import React, { useEffect, useState } from "react";
import logo from "../../public/logo.png";

function ThankUEn() {
  
  const [textVisible, setTextVisible] = useState(false);
  

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

 

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 p-4">
      {/* Logo with fade-in and bounce animation */}

      <div
        className="transform mb-8"
        style={{
          animation: "flipY 3s linear infinite",
          transformStyle: "preserve-3d",
        }}
      >
        <div
          className="rounded-full p-6 shadow-lg w-44 h-44 bg-white flex items-center justify-center"
          style={{
            backfaceVisibility: "visible",
          }}
        >
          <img src={logo} alt="Logo" className="w-full h-full object-contain" />
        </div>
      </div>

      {/* Welcome Text with fade-in animation */}
      <div
        className={`transition-all duration-1000 ${
          textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        } mb-12 text-center`}
      >
        <h1 className="text-4xl font-bold text-orange-600 mb-2">
          Thank you for submitting the form.
        </h1>
        <p className="text-xl text-black">Jay Shree Swaminarayan🙏</p>
      </div>
    </div>
  );
}

export default ThankUEn;
