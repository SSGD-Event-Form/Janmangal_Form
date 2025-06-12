import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { MdCancel } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function SevakForm() {
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    age: "",
    mobile_no: "",
    second_mobile_no: "",
    education: "",
    occupation: "",
    isSeva: false,
    isVehicleService: false,
    hasLicense: false,
    licenseTypes: [],
    specialSkills: "",
    address: "",
    city: "",
    taluka: "",
    district: "",
    birth_date: "",
    daysCount: "",
    vehicleType: [],
    otherVehicleDetail: "",
    profileImage: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countryCode, setCountryCode] = useState("in");
  const [device, setDevice] = useState("mobile");
  const [successData, setSuccessData] = useState(null);

  const formatDateToLocalYMD = (date) => {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().split("T")[0];
  };

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
    setFormData({ ...formData, isSeva: value });
  };

  // Set vehicle service status
  const setVehicleServiceStatus = (value) => {
    setFormData({ ...formData, isVehicleService: value });
  };

  // Set license status
  const setLicenseStatus = (value) => {
    setFormData({ ...formData, hasLicense: value });
  };

  // Prepare final form data for submission
  const prepareFinalFormData = () => {
    // Create a FormData object to handle the file upload
    const formDataObj = new FormData();

    // Map our form fields to API expected fields
    if (formData.profileImage) {
      formDataObj.append("photo", formData.profileImage);
    }

    // Personal information
    formDataObj.append("name", `${formData.first_name}`);
    formDataObj.append("father_name", formData.middle_name);
    formDataObj.append("surname", formData.last_name);
    formDataObj.append("address", formData.address);
    formDataObj.append("village", formData.city);
    formDataObj.append("taluka", formData.taluka);
    formDataObj.append("district", formData.district);
    formDataObj.append("education", formData.education);
    formDataObj.append("business", formData.occupation);
    formDataObj.append(
      "saint_or_devotee_name",
      `${formData.first_name} ${formData.last_name}`
    );
    formDataObj.append("birth_date", formData.birth_date);
    formDataObj.append("mobile_no", formData.mobile_no);
    formDataObj.append("alt_mobile_no", formData.second_mobile_no || "");

    // Seva information
    formDataObj.append("seva_days", formData.daysCount || "0");
    formDataObj.append(
      "is_seva_vehicle",
      formData.isVehicleService ? "1" : "0"
    );

    // Vehicle information
    if (formData.isVehicleService) {
      formDataObj.append("seva_vehicle_days", formData.daysCount || "0");

      // Map vehicle types to English equivalents for API
      const vehicleTypeMapping = {
        કાર: "Car",
        ટ્રેક્ટર: "Tractor",
        અન્ય: formData.otherVehicleDetail || "Other",
      };

      const mappedVehicleTypes = formData.vehicleType.map(
        (type) => vehicleTypeMapping[type] || type
      );

      formDataObj.append("seva_vehicle_types", mappedVehicleTypes.join(", "));
    }

    // License information
    formDataObj.append("is_driving_license", formData.hasLicense ? "1" : "0");
    if (formData.hasLicense) {
      // Map license types to English equivalents for API
      const licenseTypeMapping = {
        "ટુ વ્હીલર": "Two-wheeler",
        "ફોર વ્હીલર": "LMV",
      };

      const mappedLicenseTypes = formData.licenseTypes.map(
        (type) => licenseTypeMapping[type] || type
      );

      formDataObj.append("types_of_license", mappedLicenseTypes.join(", "));
    }

    // Skills
    formDataObj.append("skill", formData.specialSkills || "");

    return formDataObj;
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      first_name: "",
      middle_name: "",
      last_name: "",
      age: "",
      mobile_no: "",
      second_mobile_no: "",
      education: "",
      occupation: "",
      isSeva: false,
      isVehicleService: false,
      hasLicense: false,
      licenseTypes: [],
      specialSkills: "",
      address: "",
      city: "",
      taluka: "",
      district: "",
      birth_date: "",
      daysCount: "",
      vehicleType: [],
      otherVehicleDetail: "",
      profileImage: null,
    });
  };

  // Submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessData(null);

    try {
      const finalFormData = prepareFinalFormData();

      const response = await axios.post(
        "https://api.janmangal.ssgd.org/api/volunteer",
        finalFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = response.data;

      if (data.status === false) {
        console.log("API validation errors:", data.response);
        toast.error("કૃપા કરીને બધા આવશ્યક ફીલ્ડ ભરો.");
        return;
      }

      // Handle successful submission
      if (data.status === true) {
        console.log("Volunteer registration successful:", data);
        setSuccessData(data);
        toast.success("સ્વયંસેવક નોંધણી સફળતાપૂર્વક થઈ!");

        // Reset form after successful submission
        resetForm();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("ફોર્મ સબમિટ કરવામાં ભૂલ આવી. કૃપા કરીને ફરી પ્રયાસ કરો.");
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
        return "/computer-size-swayam-sevak.jpg";
      case "tablet":
        return "/ipad-size-swayam-sevak.jpg";
      default:
        return "/mobile-size-swayamsevak.jpg";
    }
  };

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
                    name="first_name"
                    value={formData.first_name}
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
                    name="middle_name"
                    value={formData.middle_name}
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
                    name="last_name"
                    value={formData.last_name}
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
                    અભ્યાસ*
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
                    વ્યવસાય*
                  </label>
                  <input
                    type="text"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="તમારો વ્યવસાય દાખલ કરો"
                    required
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
                    value={formData.second_mobile_no}
                    onChange={(phone) =>
                      setFormData({ ...formData, second_mobile_no: phone })
                    }
                    inputClass="w-full px-3 py-2 border !w-full !bg-white rounded-md"
                    containerClass="!w-full"
                    buttonClass="!h-full"
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
                    placeholderText="dd-mm-yyyy"
                    dateFormat="dd-MM-yyyy"
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-1">
                    સરનામું*
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
                        name="city"
                        value={formData.city}
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
                      {formData.profileImage ? (
                        <div className="flex flex-col items-center justify-center w-full h-full relative">
                          <img
                            src={URL.createObjectURL(formData.profileImage)}
                            alt="Profile Preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({ ...formData, profileImage: null })
                            }
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                          >
                            <MdCancel size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center">
                          <svg
                            className="w-6 h-6 mb-2 text-gray-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 16"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                            />
                          </svg>
                          <p className="text-sm text-gray-500 text-center">
                            <span className="font-semibold">
                              પાસપોર્ટ સાઈઝનો ફોટો
                            </span>
                          </p>
                        </div>
                      )}
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setFormData({
                              ...formData,
                              profileImage: e.target.files[0],
                            });
                          }
                        }}
                        required={!formData.profileImage}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    તમે સ્વયં સેવક તરીકે જોડાઈ શકશો ?
                  </h3>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        className="h-4 w-4 text-blue-600"
                        checked={formData.isSeva === true}
                        onChange={() => setFormSevaStatus(true)}
                      />
                      <span className="ml-2">હા</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        className="h-4 w-4 text-blue-600"
                        checked={formData.isSeva === false}
                        onChange={() => setFormSevaStatus(false)}
                      />
                      <span className="ml-2">ના</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">કેટલા દિવસ ?</h3>
                  <input
                    type="number"
                    name="daysCount"
                    value={formData.daysCount}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="દિવસની સંખ્યા"
                    min="1"
                    max="30"
                    required={formData.isSeva}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    વાહનની સેવા કરી શકશો ?
                  </h3>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        className="h-4 w-4 text-blue-600"
                        checked={formData.isVehicleService === true}
                        onChange={() => setVehicleServiceStatus(true)}
                      />
                      <span className="ml-2">હા</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        className="h-4 w-4 text-blue-600"
                        checked={formData.isVehicleService === false}
                        onChange={() => setVehicleServiceStatus(false)}
                      />
                      <span className="ml-2">ના</span>
                    </label>
                  </div>
                </div>
              </div>

              {formData.isVehicleService && (
                <div className="mb-4 bg-gray-100 p-4 rounded-lg border border-gray-300">
                  <label className="block text-lg font-medium text-gray-700 mb-2">
                    વાહનનો પ્રકાર
                  </label>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600"
                        checked={formData.vehicleType?.includes("કાર")}
                        onChange={(e) => {
                          const updatedTypes = e.target.checked
                            ? [...(formData.vehicleType || []), "કાર"]
                            : formData.vehicleType?.filter(
                                (type) => type !== "કાર"
                              );
                          setFormData({
                            ...formData,
                            vehicleType: updatedTypes,
                          });
                        }}
                      />
                      <span className="ml-2">કાર</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600"
                        checked={formData.vehicleType?.includes("ટ્રેક્ટર")}
                        onChange={(e) => {
                          const updatedTypes = e.target.checked
                            ? [...(formData.vehicleType || []), "ટ્રેક્ટર"]
                            : formData.vehicleType?.filter(
                                (type) => type !== "ટ્રેક્ટર"
                              );
                          setFormData({
                            ...formData,
                            vehicleType: updatedTypes,
                          });
                        }}
                      />
                      <span className="ml-2">ટ્રેક્ટર</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600"
                        checked={formData.vehicleType?.includes("અન્ય")}
                        onChange={(e) => {
                          const updatedTypes = e.target.checked
                            ? [...(formData.vehicleType || []), "અન્ય"]
                            : formData.vehicleType?.filter(
                                (type) => type !== "અન્ય"
                              );
                          setFormData({
                            ...formData,
                            vehicleType: updatedTypes,
                          });
                        }}
                      />
                      <span className="ml-2">અન્ય</span>
                    </label>
                  </div>

                  {formData.vehicleType?.includes("અન્ય") && (
                    <div className="mt-3">
                      <label className="block text-lg font-medium text-gray-700 mb-1">
                        અન્ય વાહનની વિગત
                      </label>
                      <input
                        type="text"
                        name="otherVehicleDetail"
                        value={formData.otherVehicleDetail || ""}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="અન્ય વાહનની વિગત"
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">
                  ડ્રાઈવીંગ લાઈસન્સ છે?
                </h3>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      className="h-4 w-4 text-blue-600"
                      checked={formData.hasLicense === true}
                      onChange={() => setLicenseStatus(true)}
                    />
                    <span className="ml-2">હા</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      className="h-4 w-4 text-blue-600"
                      checked={formData.hasLicense === false}
                      onChange={() => setLicenseStatus(false)}
                    />
                    <span className="ml-2">ના</span>
                  </label>
                </div>
              </div>

              {formData.hasLicense && (
                <div className="mb-4 bg-gray-100 p-4 rounded-lg border border-gray-300">
                  <label className="block text-lg font-medium text-gray-700 mb-2">
                    લાઈસન્સનો પ્રકાર
                  </label>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600"
                        checked={formData.licenseTypes?.includes("ટુ વ્હીલર")}
                        onChange={(e) => {
                          const updatedTypes = e.target.checked
                            ? [...(formData.licenseTypes || []), "ટુ વ્હીલર"]
                            : formData.licenseTypes?.filter(
                                (type) => type !== "ટુ વ્હીલર"
                              );
                          setFormData({
                            ...formData,
                            licenseTypes: updatedTypes,
                          });
                        }}
                      />
                      <span className="ml-2">ટુ વ્હીલર</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600"
                        checked={formData.licenseTypes?.includes("ફોર વ્હીલર")}
                        onChange={(e) => {
                          const updatedTypes = e.target.checked
                            ? [...(formData.licenseTypes || []), "ફોર વ્હીલર"]
                            : formData.licenseTypes?.filter(
                                (type) => type !== "ફોર વ્હીલર"
                              );
                          setFormData({
                            ...formData,
                            licenseTypes: updatedTypes,
                          });
                        }}
                      />
                      <span className="ml-2">ફોર વ્હીલર</span>
                    </label>
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-lg font-medium mb-2">
                  તમારામાં રહેલી વિશેષ આવડત જણાવો
                </h3>
                <textarea
                  name="specialSkills"
                  value={formData.specialSkills}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="તમારી વિશેષ આવડત અહીં જણાવો"
                  rows="3"
                ></textarea>
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
