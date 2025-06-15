import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  MdCancel,
  MdCamera,
  MdPhotoLibrary,
  MdCrop,
  MdPhotoCamera,
  MdCameraEnhance,
} from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { getYear, getMonth } from "date-fns";

export default function SevakForm() {
  const departments = {
    AssemblyHall: "સભામંડપ",
    YagShala: "યજ્ઞશાળા",
    Residence: "ઉતારા વિભાગ",
    Kitchen: "રસોડા વિભાગ",
    "Computer / Office ": "કમ્પ્યુટર વિભાગ",
    "Video / Graphics ": "વિડિઓ / ગ્રાફિક્સ વિભાગ",
    Medical: "મેડિકલ વિભાગ",
    Transportation: "પરિવહન વિભાગ",
    Inquiry: "પૂછપરછ વિભાગ",
    Cleaning: "સ્વચ્છતા વિભાગ",
    "je sope te": "જે સોંપે તે...",
  };
  const [formData, setFormData] = useState({
    name: "",
    father_name: "",
    surname: "",
    address: "",
    village: "",
    taluka: "",
    district: "",
    education: "",
    business: "",
    saint_or_devotee_name: "",
    birth_date: "",
    mobile_no: "",
    alt_mobile_no: "",
    seva_days: "",
    is_seva_vehicle: "0",
    seva_vehicle_days: "",
    seva_vehicle_types: [],
    other_vehicle_detail: "",
    is_driving_license: "0",
    types_of_license: [],
    skill: "",
    department: "",
    photo: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countryCode, setCountryCode] = useState("in");
  const [device, setDevice] = useState("mobile");
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const videoRef = React.useRef(null);
  const [cameraError, setCameraError] = useState("");
  const [cropper, setCropper] = useState(null);
  const imageRef = useRef(null);

  const formatDateToLocalYMD = (date) => {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().split("T")[0];
  };

  // Generate years array manually
  const currentYear = getYear(new Date());
  const years = Array.from(
    { length: currentYear - 1947 + 1 },
    (_, i) => 1947 + i
  );

  const months = [
    "જાન્યુઆરી",
    "ફેબ્રુઆરી",
    "માર્ચ",
    "એપ્રિલ",
    "મે",
    "જૂન",
    "જુલાઈ",
    "ઓગસ્ટ",
    "સપ્ટેમ્બર",
    "ઓક્ટોબર",
    "નવેમ્બર",
    "ડિસેમ્બર",
  ];

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value instanceof Date ? formatDateToLocalYMD(value) : value,
    });
  };

  // Set form seva status
  const setFormSevaStatus = (value) => {
    setFormData({ ...formData, is_seva_vehicle: value ? "1" : "0" });
  };

  // Set vehicle service status
  const setVehicleServiceStatus = (value) => {
    setFormData({ ...formData, is_seva_vehicle: value ? "1" : "0" });
  };

  // Set license status
  const setLicenseStatus = (value) => {
    setFormData({ ...formData, is_driving_license: value ? "1" : "0" });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      father_name: "",
      surname: "",
      address: "",
      village: "",
      taluka: "",
      district: "",
      education: "",
      business: "",
      saint_or_devotee_name: "",
      birth_date: "",
      mobile_no: "",
      alt_mobile_no: "",
      seva_days: "",
      is_seva_vehicle: "0",
      seva_vehicle_days: "",
      seva_vehicle_types: [],
      other_vehicle_detail: "",
      is_driving_license: "0",
      types_of_license: [],
      skill: "",
      department: "",
      photo: null,
    });
  };

  // Submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate all required fields
    const requiredFields = {
      name: "નામ",
      father_name: "પિતાનું નામ",
      surname: "અટક",
      address: "સરનામું",
      village: "ગામ",
      taluka: "તાલુકો",
      district: "જીલ્લો",
      education: "અભ્યાસ",
      business: "વ્યવસાય",
      saint_or_devotee_name: "પરિચિત સંત કે હરિભક્તનું નામ",
      birth_date: "જન્મ તારીખ",
      mobile_no: "મોબાઇલ નંબર",
      seva_days: "સેવા દિવસો",
      department: "વિભાગ",
      photo: "ફોટો",
    };

    // Check for empty required fields
    const emptyFields = Object.entries(requiredFields).filter(
      ([key]) => !formData[key]
    );

    if (emptyFields.length > 0) {
      const missingFields = emptyFields.map(([_, label]) => label).join(", ");
      toast.error(`કૃપા કરીને આ ફીલ્ડ ભરો: ${missingFields}`);
      setIsSubmitting(false);
      return;
    }

    // Validate mobile number format
    if (formData.mobile_no && formData.mobile_no.length < 10) {
      toast.error("મોબાઇલ નંબર ખોટો છે");
      setIsSubmitting(false);
      return;
    }

    // Validate vehicle service fields if is_seva_vehicle is "1"
    if (formData.is_seva_vehicle === "1") {
      if (!formData.seva_vehicle_days) {
        toast.error("કૃપા કરીને વાહન સેવા દિવસો ભરો");
        setIsSubmitting(false);
        return;
      }
      if (
        !formData.seva_vehicle_types ||
        formData.seva_vehicle_types.length === 0
      ) {
        toast.error("કૃપા કરીને વાહનનો પ્રકાર પસંદ કરો");
        setIsSubmitting(false);
        return;
      }
    }

    // Validate license fields if is_driving_license is "1"
    if (formData.is_driving_license === "1") {
      if (
        !formData.types_of_license ||
        formData.types_of_license.length === 0
      ) {
        toast.error("કૃપા કરીને લાઈસન્સનો પ્રકાર પસંદ કરો");
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const formDataObj = new FormData();

      // Add all required fields
      formDataObj.append("name", formData.name);
      formDataObj.append("father_name", formData.father_name);
      formDataObj.append("age", formData.age);
      formDataObj.append("surname", formData.surname);
      formDataObj.append("address", formData.address);
      formDataObj.append("village", formData.village);
      formDataObj.append("taluka", formData.taluka);
      formDataObj.append("district", formData.district);
      formDataObj.append("education", formData.education);
      formDataObj.append("business", formData.business);
      formDataObj.append(
        "saint_or_devotee_name",
        formData.saint_or_devotee_name
      );
      formDataObj.append("birth_date", formData.birth_date);
      formDataObj.append("mobile_no", formData.mobile_no);
      formDataObj.append("alt_mobile_no", formData.alt_mobile_no || "");
      formDataObj.append("seva_days", formData.seva_days);
      formDataObj.append("is_seva_vehicle", formData.is_seva_vehicle);
      formDataObj.append("seva_vehicle_days", formData.seva_vehicle_days || "");

      // Handle seva_vehicle_types array
      let vehicleTypes = [...formData.seva_vehicle_types];
      if (formData.other_vehicle_detail) {
        vehicleTypes.push(formData.other_vehicle_detail);
      }
      formDataObj.append("seva_vehicle_types", vehicleTypes.join(", ") || "");

      formDataObj.append("is_driving_license", formData.is_driving_license);
      formDataObj.append(
        "types_of_license",
        formData.types_of_license?.join(", ") || ""
      );
      formDataObj.append("skill", formData.skill || "");
      formDataObj.append("department", formData.department);

      // Add photo
      if (formData.photo) {
        formDataObj.append("photo", formData.photo);
      }

     

      const response = await axios.post(
        "https://api.janmangal.ssgd.org/api/volunteer",
        formDataObj,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      
        toast.success("‍ફોર્મ સફળતાપૂર્વક સબમિટ થઇ ગયું છે");
       
    } catch (error) {
      console.error("Error submitting form:", error);
      
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get country code for phone input
  useEffect(() => {
    fetch("https://ipapi.co/json")
      .then((res) => res.json())
      .then((data) => {
        setCountryCode(data.country_code.toLowerCase());
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setDevice("desktop");
      } else if (width >= 640) {
        setDevice("tablet");
      } else {
        setDevice("mobile");
      }
    };

    handleResize(); // initial
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getImage = () => {
    switch (device) {
      case "desktop":
        return "/computer-size-swayam-sevak2.jpg";
      case "tablet":
        return "/ipad-size-swayam-sevak.jpg";
      default:
        return "/mobile-size-swayamsevak.jpg";
    }
  };

  // Function to handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target.result);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to start camera
  const startCamera = async () => {
    setCameraError("");
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError("તમારું બ્રાઉઝર કેમેરા સપોર્ટ કરતું નથી.");
        return;
      }
      const constraints = {
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 640 },
        },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setCameraStream(stream);
      setShowCameraModal(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {
            setCameraError("કેમેરા શરૂ કરવામાં સમસ્યા છે.");
          });
        }
      }, 100);
    } catch {
      setCameraError(
        "કેમેરા એક્સેસ કરવામાં સમસ્યા છે. કૃપા કરીને પરવાનગી આપો અને ફરી પ્રયાસ કરો."
      );
    }
  };

  // Function to stop camera
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setShowCameraModal(false);
  };

  // Function to capture photo from camera
  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      const video = videoRef.current;

      // Set canvas size to match video dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");

      // Draw the video frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to blob with high quality
      canvas.toBlob(
        (blob) => {
          const imageUrl = URL.createObjectURL(blob);
          setImageSrc(imageUrl);
          stopCamera();
          setShowCropModal(true);
        },
        "image/jpeg",
        0.95
      );
    }
  };

  const handleCropSubmit = () => {
    if (!cropper) return;

    const canvas = cropper.getCroppedCanvas({
      width: 300,
      height: 300,
      fillColor: "#fff",
      imageSmoothingEnabled: true,
      imageSmoothingQuality: "high",
    });

    if (canvas) {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const file = new File([blob], "profile-photo.jpg", {
              type: "image/jpeg",
            });
            setFormData({ ...formData, photo: file });
            setCroppedImage(URL.createObjectURL(blob));
            setShowCropModal(false);
            setImageSrc(null);
            toast.success("ફોટો સફળતાપૂર્વક અપલોડ થયો");
          }
        },
        "image/jpeg",
        0.95
      );
    }
  };

  // Cleanup camera on component unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  return (
    <div className="min-h-screen bg-white py-4 px-4 sm:px-6 lg:px-8 font-ghanu">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center flex justify-center">
          <img
            src={getImage()}
            alt="Responsive"
            className="w-full object-cover rounded-lg"
          />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white shadow-md rounded-lg p-6 mb-10 mt-4 border border-gray-200">
            {/* Personal Information Section */}
            <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-2xl font-medium border-b border-gray-300 pb-2 mb-4">
                વ્યક્તિગત માહિતી
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-1">
                    નામ*
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="નામ"
                    required
                  />
                </div>
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-1">
                    પિતાનું નામ*
                  </label>
                  <input
                    type="text"
                    name="father_name"
                    value={formData.father_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="પિતાનું નામ"
                    required
                  />
                </div>
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-1">
                    અટક*
                  </label>
                  <input
                    type="text"
                    name="surname"
                    value={formData.surname}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="અટક"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-1">
                    અભ્યાસ
                  </label>
                  <input
                    type="text"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="તમારો અભ્યાસ દાખલ કરો"
                    required
                  />
                </div>
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-1">
                    વ્યવસાય
                  </label>
                  <input
                    type="text"
                    name="business"
                    value={formData.business}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="તમારો વ્યવસાય દાખલ કરો"
                    required
                  />
                </div>
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-1">
                    જન્મ તારીખ*
                  </label>
                  <DatePicker
                    selected={
                      formData.birth_date ? new Date(formData.birth_date) : null
                    }
                    onChange={(date) =>
                      handleChange({
                        target: { name: "birth_date", value: date },
                      })
                    }
                    renderCustomHeader={({
                      date,
                      changeYear,
                      changeMonth,
                      decreaseMonth,
                      increaseMonth,
                      prevMonthButtonDisabled,
                      nextMonthButtonDisabled,
                    }) => (
                      <div className="flex justify-center items-center gap-2 p-2">
                        <button
                          onClick={decreaseMonth}
                          disabled={prevMonthButtonDisabled}
                          className="px-2 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                        >
                          {"<"}
                        </button>
                        <select
                          value={getYear(date)}
                          onChange={({ target: { value } }) =>
                            changeYear(value)
                          }
                          className="px-2 py-1 border rounded bg-white"
                        >
                          {years.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>

                        <select
                          value={months[getMonth(date)]}
                          onChange={({ target: { value } }) =>
                            changeMonth(months.indexOf(value))
                          }
                          className="px-2 py-1 border rounded bg-white"
                        >
                          {months.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>

                        <button
                          onClick={increaseMonth}
                          disabled={nextMonthButtonDisabled}
                          className="px-2 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                        >
                          {">"}
                        </button>
                      </div>
                    )}
                    placeholderText="તારીખ પસંદ કરો"
                    dateFormat="dd-MM-yyyy"
                    className="w-full px-3 py-2 border rounded-md"
                    required
                    maxDate={new Date()}
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={50}
                    showMonthDropdown
                    dropdownMode="select"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-1">
                    મોબાઇલ નંબર - ૧*
                  </label>
                  <PhoneInput
                    country={countryCode}
                    enableSearch={true}
                    value={formData.mobile_no}
                    onChange={(phone) =>
                      setFormData({ ...formData, mobile_no: phone })
                    }
                    inputClass="w-full px-3 py-2 border !w-full !bg-white rounded-md"
                    containerClass="!w-full"
                    buttonClass="!h-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-1">
                    મોબાઇલ નંબર - ૨
                  </label>
                  <PhoneInput
                    country={countryCode}
                    enableSearch={true}
                    value={formData.alt_mobile_no}
                    onChange={(phone) =>
                      setFormData({ ...formData, alt_mobile_no: phone })
                    }
                    inputClass="w-full px-3 py-2 border !w-full !bg-white rounded-md"
                    containerClass="!w-full"
                    buttonClass="!h-full"
                  />
                </div>
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-1">
                    ઉમર*
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="ઉમર"
                    min="0"
                    max="100"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-1">
                    સરનામું
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="તમારું સરનામું દાખલ કરો"
                    rows="3"
                    required
                  ></textarea>

                  <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-1">
                        ગામ*
                      </label>
                      <input
                        type="text"
                        name="village"
                        value={formData.village}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="ગામ"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-1">
                        તાલુકો*
                      </label>
                      <input
                        type="text"
                        name="taluka"
                        value={formData.taluka || ""}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="તાલુકો"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-1">
                        જીલ્લો*
                      </label>
                      <input
                        type="text"
                        name="district"
                        value={formData.district || ""}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="જીલ્લો"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-1">
                    ફોટો અપલોડ કરો*
                  </label>
                  <div className="flex items-center">
                    <label className="flex flex-col items-center justify-center p-3 w-52 h-44 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      {croppedImage ? (
                        <div className="flex flex-col items-center justify-center w-full h-full relative">
                          <img
                            src={croppedImage}
                            alt="Profile Preview"
                            className="w-full h-full object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, photo: null });
                              setCroppedImage(null);
                            }}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                          >
                            <MdCancel size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                document.getElementById("fileInput").click()
                              }
                              className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                              <MdPhotoLibrary />
                              ફાઇલ
                            </button>
                            <button
                              type="button"
                              onClick={startCamera}
                              className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                              <MdCamera />
                              કેમેરા
                            </button>
                          </div>
                          <p className="text-sm text-gray-500 text-center">
                            <span className="font-semibold">
                              પાસપોર્ટ સાઈઝનો ફોટો
                            </span>
                          </p>
                        </div>
                      )}
                      <input
                        id="fileInput"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileSelect}
                        required={!formData.photo}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Camera Modal */}
              {showCameraModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                  <div className="bg-white p-4 rounded-lg max-w-2xl w-full mx-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">ફોટો લો</h3>
                      <button
                        onClick={stopCamera}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <MdCancel size={24} />
                      </button>
                    </div>
                    <div className="relative bg-black rounded overflow-hidden min-h-[300px] flex flex-col items-center justify-center">
                      {cameraError ? (
                        <div className="text-red-600 text-center p-4">
                          {cameraError}
                        </div>
                      ) : (
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full max-h-[60vh] bg-black"
                          style={{ transform: "scaleX(-1)" }}
                        />
                      )}
                      {cameraStream && !cameraError && (
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                          <button
                            onClick={capturePhoto}
                            className="bg-white p-4 rounded-full shadow-lg hover:bg-gray-100"
                          >
                            <MdCamera size={32} className="text-gray-800" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Crop Modal */}
              {showCropModal && imageSrc && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-4 rounded-lg max-w-2xl w-full mx-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">ફોટો ક્રોપ કરો</h3>
                      <button
                        onClick={() => {
                          setShowCropModal(false);
                          setImageSrc(null);
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <MdCancel size={24} />
                      </button>
                    </div>
                    <div className="max-h-[60vh] overflow-auto">
                      <Cropper
                        ref={imageRef}
                        src={imageSrc}
                        style={{ height: 400, width: "100%" }}
                        aspectRatio={1}
                        guides={true}
                        autoCropArea={0.8}
                        background={false}
                        viewMode={1}
                        onInitialized={(instance) => setCropper(instance)}
                        cropBoxMovable={true}
                        cropBoxResizable={true}
                        dragMode="move"
                        responsive={true}
                        restore={false}
                        center={true}
                        highlight={false}
                        modal={true}
                        zoomable={true}
                        zoomOnTouch={true}
                        zoomOnWheel={true}
                      />
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setShowCropModal(false);
                          setImageSrc(null);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        રદ કરો
                      </button>
                      <button
                        type="button"
                        onClick={handleCropSubmit}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        ક્રોપ કરો
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    તમે સ્વયં સેવક તરીકે કેટલા દિવસ જોડાઈ શકશો ? *
                  </h3>
                  <div className="flex items-center space-x-4">
                    <input
                      type="number"
                      name="seva_days"
                      value={formData.seva_days}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="દિવસની સંખ્યા"
                      min="1"
                      max="30"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    વાહનની સેવા કરી શકશો ? *
                  </h3>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        className="h-4 w-4 text-blue-600"
                        checked={formData.is_seva_vehicle === "1"}
                        onChange={() => setVehicleServiceStatus(true)}
                      />
                      <span className="ml-2">હા</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        className="h-4 w-4 text-blue-600"
                        checked={formData.is_seva_vehicle === "0"}
                        onChange={() => setVehicleServiceStatus(false)}
                      />
                      <span className="ml-2">ના</span>
                    </label>
                  </div>
                </div>
              </div>

              {formData.is_seva_vehicle === "1" && (
                <div className="mb-4 bg-gray-100 p-4 rounded-lg border border-gray-300 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">
                      વાહનનો પ્રકાર *
                    </label>
                    <div className="flex flex-wrap gap-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600"
                          checked={formData.seva_vehicle_types?.includes("Car")}
                          onChange={(e) => {
                            const updatedTypes = e.target.checked
                              ? [...(formData.seva_vehicle_types || []), "Car"]
                              : formData.seva_vehicle_types?.filter(
                                  (type) => type !== "Car"
                                );
                            setFormData({
                              ...formData,
                              seva_vehicle_types: updatedTypes,
                            });
                          }}
                        />
                        <span className="ml-2">કાર</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600"
                          checked={formData.seva_vehicle_types?.includes(
                            "Tractor"
                          )}
                          onChange={(e) => {
                            const updatedTypes = e.target.checked
                              ? [
                                  ...(formData.seva_vehicle_types || []),
                                  "Tractor",
                                ]
                              : formData.seva_vehicle_types?.filter(
                                  (type) => type !== "Tractor"
                                );
                            setFormData({
                              ...formData,
                              seva_vehicle_types: updatedTypes,
                            });
                          }}
                        />
                        <span className="ml-2">ટ્રેક્ટર</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600"
                          checked={formData.seva_vehicle_types?.includes(
                            "Other"
                          )}
                          onChange={(e) => {
                            const updatedTypes = e.target.checked
                              ? [
                                  ...(formData.seva_vehicle_types || []),
                                  "Other",
                                ]
                              : formData.seva_vehicle_types?.filter(
                                  (type) => type !== "Other"
                                );
                            setFormData({
                              ...formData,
                              seva_vehicle_types: updatedTypes,
                            });
                          }}
                        />
                        <span className="ml-2">અન્ય</span>
                      </label>
                    </div>

                    {formData.seva_vehicle_types?.includes("Other") && (
                      <div className="mt-3">
                        <label className="block text-lg font-medium text-gray-700 mb-1">
                          અન્ય વાહનની વિગત *
                        </label>
                        <input
                          type="text"
                          name="other_vehicle_detail"
                          value={formData.other_vehicle_detail || ""}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          placeholder="અન્ય વાહનની વિગત"
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">કેટલા દિવસ ? *</h3>
                    <input
                      type="number"
                      name="seva_vehicle_days"
                      value={formData.seva_vehicle_days}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="દિવસની સંખ્યા"
                      min="1"
                      max="30"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">
                  ડ્રાઈવીંગ લાઈસન્સ છે ? *
                </h3>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      className="h-4 w-4 text-blue-600"
                      checked={formData.is_driving_license === "1"}
                      onChange={() => setLicenseStatus(true)}
                    />
                    <span className="ml-2">હા</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      className="h-4 w-4 text-blue-600"
                      checked={formData.is_driving_license === "0"}
                      onChange={() => setLicenseStatus(false)}
                    />
                    <span className="ml-2">ના</span>
                  </label>
                </div>
              </div>

              {formData.is_driving_license === "1" && (
                <div className="mb-4 bg-gray-100 p-4 rounded-lg border border-gray-300">
                  <label className="block text-lg font-medium text-gray-700 mb-2">
                    લાઈસન્સનો પ્રકાર *
                  </label>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600"
                        checked={formData.types_of_license?.includes(
                          "Two-wheeler"
                        )}
                        onChange={(e) => {
                          const updatedTypes = e.target.checked
                            ? [
                                ...(formData.types_of_license || []),
                                "Two-wheeler",
                              ]
                            : formData.types_of_license?.filter(
                                (type) => type !== "Two-wheeler"
                              );
                          setFormData({
                            ...formData,
                            types_of_license: updatedTypes,
                          });
                        }}
                      />
                      <span className="ml-2">ટુ વ્હીલર</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600"
                        checked={formData.types_of_license?.includes("LMV")}
                        onChange={(e) => {
                          const updatedTypes = e.target.checked
                            ? [...(formData.types_of_license || []), "LMV"]
                            : formData.types_of_license?.filter(
                                (type) => type !== "LMV"
                              );
                          setFormData({
                            ...formData,
                            types_of_license: updatedTypes,
                          });
                        }}
                      />
                      <span className="ml-2">ફોર વ્હીલર</span>
                    </label>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    તમારામાં રહેલી વિશેષ આવડત જણાવો
                  </h3>
                  <input
                    name="skill"
                    value={formData.skill}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="તમારી વિશેષ આવડત અહીં જણાવો"
                    rows="3"
                  ></input>
                </div>
                <div>
                  <label className="block text-xl font-medium text-gray-700">
                    કયા વિભાગમાં સેવા કરવા ઇચ્છો છો?
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-3"
                  >
                    <option value="">વિભાગ પસંદ કરો</option>
                    {Object.entries(departments).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    પરિચિત સંત કે હરિભક્તનું નામ *
                  </h3>
                  <input
                    type="text"
                    name="saint_or_devotee_name"
                    value={formData.saint_or_devotee_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="પરિચિત સંત કે હરિભક્તનું નામ"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-center mt-6 space-x-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 border border-gray-300 rounded-md shadow-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                રદ કરો
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 border border-transparent rounded-md shadow-sm font-medium text-white bg-orange-600"
              >
                {isSubmitting ? "સબમિટ થઈ રહ્યું છે..." : "સબમિટ કરો"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
