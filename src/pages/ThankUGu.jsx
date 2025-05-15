import React, { useEffect, useState } from "react";
import logo from "../../public/janmangal logo.png";

function ThankUGu() {
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

          <img src={logo} alt="Logo" className="w-52 h-52 object-contain" />
      

      {/* Welcome Text with fade-in animation */}
      <div
        className={`transition-all duration-1000 ${
          textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        } mb-12 text-center`}
      >
        <h1 className="text-5xl font-bold text-orange-600 mb-2 font-ghanu">
          ફોર્મ સબમિટ કરવા બદલ આભાર.
        </h1>
        <p className="text-2xl text-black font-ghanu">જય શ્રી સ્વામિનારાયાણ🙏</p>
      </div>
    </div>
  );
}

export default ThankUGu;
