import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { MdCancel } from "react-icons/md";
import { BsArrowRight } from "react-icons/bs";

export default function EnForm() {
  const [formData, setFormData] = useState({
    locale: "en",
    first_name: "",
    middle_name: "",
    last_name: "",
    age: "",
    mobile_no: "",
    email: "",
    isSeva: false,
    skill: "",
    department: "",
    address: "",
    city: "",
    country: "",
    pincode: "",
    arrival_date: "",
    departure_date: "",
    totalMembers: "0",
    members: [
      // {
      //   first_name: "",
      //   middle_name: "",
      //   last_name: "",
      //   age: "",
      //   isSeva: false,
      //   mobile_no: "",
      //   arrival_date: "",
      //   departure_date: "",
      //   skill: "",
      //   department: "",
      // },
    ],
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Minimum date constraints
  const minArrivalDate = "2025-12-01";
  const maxArrivalDate = "2026-01-20";
  const minDepartureDate = "2025-12-01";
  const maxDepartureDate = "2026-01-20";

  // Department options
  const departments = {
    AssemblyHall: "AssemblyHall",
    YagShala: "YagnShala",
    Residence: "Residence",
    Kitchen: "Kitchen",
    "Computer / Office ": "Computer / Office ",
    "Video / Graphics ": "Video / Graphics ",
    Medical: "Medical ",
    Transportation: "Transportation ",
    Inquiry: "Inquiry ",
    Cleaning: "Cleaning ",
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Special handling for totalMembers to update member array
    if (name === "totalMembers") {
      const totalCount = parseInt(value);
      const currentCount = formData.members.length;
      let updatedMembers = [...formData.members];

      if (totalCount > currentCount) {
        // Add new member fields
        for (let i = currentCount; i < totalCount; i++) {
          updatedMembers.push({
            first_name: "",
            middle_name: "",
            last_name: "",
            age: "",
            isSeva: false,
            mobile_no: "",
            arrival_date: "",
            departure_date: "",
            skill: "",
            department: "",
          });
        }
      } else if (totalCount < currentCount) {
        // Remove excess member fields
        updatedMembers = updatedMembers.slice(0, totalCount);
      }

      setFormData({
        ...formData,
        [name]: value,
        members: updatedMembers,
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  // Handle member data change
  const handleMemberChange = (index, field, value) => {
    const updatedMembers = [...formData.members];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };

    // If age is changed and becomes <= 15, set isSeva to false
    if (field === "age") {
      const age = parseInt(value);
      if (!isNaN(age) && age <= 15) {
        updatedMembers[index].isSeva = false;
      }
    }

    setFormData({ ...formData, members: updatedMembers });
  };

  // Set join seva status for a specific member
  const setMemberSevaStatus = (index, value) => {
    const updatedMembers = [...formData.members];
    updatedMembers[index] = { ...updatedMembers[index], isSeva: value };
    setFormData({ ...formData, members: updatedMembers });
  };

  const setFormSevaStatus = (value) => {
    setFormData({ ...formData, isSeva: value });
  };

  // Form validation
  const validateForm = () => {
    const errors = {};

    // Validate personal info fields
    if (!formData.first_name) {
      errors.personal_first_name = "First name is required";
    }
    if (!formData.middle_name) {
      errors.personal_middle_name = "Father's name is required";
    }
    if (!formData.last_name) {
      errors.personal_last_name = "Last name is required";
    }
    if (!formData.age) {
      errors.personal_age = "Age is required";
    } else if (
      isNaN(formData.age) ||
      parseInt(formData.age) < 0 ||
      parseInt(formData.age) > 100
    ) {
      errors.personal_age = "Age must be between 0-100";
    }
    if (!formData.mobile_no) {
      errors.personal_mobile_no = "Mobile number is required";
    }
    if (!formData.email) {
      errors.personal_email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.personal_email = "Email is invalid";
    }

    // Validate address
    if (!formData.address) {
      errors.address = "Address is required";
    }

    // Validate pincode
    if (!formData.pincode) {
      errors.pincode = "Pincode is required";
    }

    // Validate city
    if (!formData.city) {
      errors.city = "City is required";
    }

    // Validate country
    if (!formData.country) {
      errors.country = "Country is required";
    }

    if (!formData.arrival_date) {
      errors.arrival_date = "Arrivaldate is required";
    }

    if (!formData.departure_date) {
      errors.departure_date = "Departuredate is required";
    } else if (
      formData.arrival_date &&
      new Date(formData.departure_date) < new Date(formData.arrival_date)
    ) {
      errors.departure_date = "Departure date must be after arrival date";
    }

    // Validate member information
    const memberErrors = [];
    formData.members.forEach((member, index) => {
      const memberError = {};

      if (!member.first_name) {
        memberError.first_name = "First name is required";
      }
      if (!member.middle_name) {
        memberError.middle_name = "Father's name is required";
      }
      if (!member.last_name) {
        memberError.last_name = "Last name is required";
      }

      if (!member.age) {
        memberError.age = "Age is required";
      } else if (
        isNaN(member.age) ||
        parseInt(member.age) < 0 ||
        parseInt(member.age) > 100
      ) {
        memberError.age = "Age must be between 0-100";
      }

      if (!member.mobile_no) {
        memberError.mobile_no = "Mobile number is required";
      }

      if (!member.arrival_date) {
        memberError.arrival_date = "Arrival date is required";
      }

      if (!member.departure_date) {
        memberError.departure_date = "Departure date is required";
      } else if (
        member.arrival_date &&
        new Date(member.departure_date) < new Date(member.arrival_date)
      ) {
        memberError.departure_date =
          "Departure date must be after arrival date";
      }

      if (Object.keys(memberError).length > 0) {
        memberErrors[index] = memberError;
      }
    });

    if (memberErrors.length > 0) {
      errors.members = memberErrors;
    }

    return errors;
  };

  // Prepare final form data for submission
  const prepareFinalFormData = () => {
    // Combine personal info with formData
 
    // return false;
    return formData;
  };

  // Submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);

      try {
        const finalFormData = prepareFinalFormData();

        const response = await axios.post(
          "https://api.janmangal.ssgd.org/api/accommodations",
          finalFormData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = response.data;

        // Handle status check
        if (data.status === false) {
          const apiErrors = {};
          const messages = [];

          // Process API error responses
          for (const key in data.response) {
            if (key.startsWith("members.")) {
              // Extract member index and field name from the error key (e.g., "members.0.mobile_no")
              const parts = key.split(".");
              if (parts.length === 3) {
                const memberIndex = parseInt(parts[1]);
                const fieldName = parts[2];

                // Initialize the members errors array if it doesn't exist
                if (!apiErrors.members) {
                  apiErrors.members = [];
                }

                // Initialize the specific member's errors if they don't exist
                if (!apiErrors.members[memberIndex]) {
                  apiErrors.members[memberIndex] = {};
                }

                // Add the error message for this specific field
                apiErrors.members[memberIndex][fieldName] =
                  data.response[key].join(", ");
              }
            } else {
              // Handle non-member specific errors
              apiErrors[key] = data.response[key].join(", ");
            }

            // Also collect all messages for general display
            messages.push(...data.response[key]);
          }

          // Merge with existing form errors
          setFormErrors({
            ...apiErrors,
            submit: messages.join("\n"),
          });

          console.log("API validation errors:", apiErrors);
          toast.error("Validation failed. Please check errors.");
          return;
        }

        navigate("/");
        toast.success("Form submitted successfully!");
      } catch (error) {
        console.error("Error submitting form:", error);
        setFormErrors({
          submit: "An error occurred. Please try again.",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Get country code for phone input
  const [countryCode, setCountryCode] = useState("in"); // default to India

  useEffect(() => {
    fetch("https://ipapi.co/json")
      .then((res) => res.json())
      .then((data) => {
        setCountryCode(data.country_code.toLowerCase());
        setFormData((prevData) => ({
          ...prevData,
          city: data.city,
          country: data.country_name,
        }));
      })
      .catch(() => {
        // Keep default country code if fetch fails
      });
  }, []);

  const [device, setDevice] = useState("mobile");

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
        return "/desktop_image.jpg";
      case "tablet":
        return "/ipad-0001.png";
      default:
        return "/mobile-0001.png";
    }
  };

  const handleRemoveMember = (indexToRemove) => {
    // Create a new array without the member at the specified index
    const updatedMembers = formData.members.filter(
      (_, index) => index !== indexToRemove
    );

    // Update the formData state with the new array and adjust totalMembers
    setFormData({
      ...formData,
      members: updatedMembers,
      totalMembers: String(updatedMembers.length),
    });

    // Also update any formErrors related to members if needed
    if (formErrors.members) {
      const updatedErrors = formErrors.members.filter(
        (_, index) => index !== indexToRemove
      );
      setFormErrors({
        ...formErrors,
        members: updatedErrors,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-4 px-4 sm:px-6 lg:px-8">
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
          <div className="bg-white shadow-lg rounded-lg p-6 mb-10 mt-4">
            {/* Personal Information Section */}
            <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-md font-medium border-b border-gray-300 pb-2 mb-4">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-md font-medium text-gray-700 mb-1">
                    First Name*
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      formErrors.personal_first_name
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md`}
                    placeholder="First Name"
                  />
                  {formErrors.personal_first_name && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.personal_first_name}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-md font-medium text-gray-700 mb-1">
                    Father's Name*
                  </label>
                  <input
                    type="text"
                    name="middle_name"
                    value={formData.middle_name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      formErrors.personal_middle_name
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md`}
                    placeholder="Father's Name"
                  />
                  {formErrors.personal_middle_name && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.personal_middle_name}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-md font-medium text-gray-700 mb-1">
                    Last Name*
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      formErrors.personal_last_name
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md`}
                    placeholder="Last Name"
                  />
                  {formErrors.personal_last_name && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.personal_last_name}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-md font-medium text-gray-700 mb-1">
                    Age*
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      formErrors.personal_age
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md`}
                    placeholder="Age"
                    min="0"
                    max="120"
                  />
                  {formErrors.personal_age && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.personal_age}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-md font-medium text-gray-700 mb-1">
                    Mobile Number*
                  </label>
                  <div className="relative">
                    <PhoneInput
                      country={countryCode}
                      enableSearch={true}
                      onChange={(phone) =>
                        handleInputChange("mobile_no", phone)
                      }
                      inputClass={`w-full px-3 py-2 border !w-full !bg-white !text-sm px-3 py-5 ${
                        formErrors.personal_mobile_no
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md`}
                      buttonClass="!bg-white !border-r !border-gray-300 !rounded-l-md"
                      containerClass="!w-full"
                    />
                  </div>
                  {formErrors.personal_mobile_no && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.personal_mobile_no}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-md font-medium text-gray-700 mb-1">
                    Email*
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      formErrors.personal_email
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md`}
                    placeholder="Email"
                  />
                  {formErrors.personal_email && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.personal_email}
                    </p>
                  )}
                </div>
              </div>
              <div className="mb-4 mt-4 relative">
                <label className="block text-md font-medium text-gray-700 mb-1">
                  Address*
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      formErrors.address ? "border-red-500" : "border-gray-300"
                    } rounded-md`}
                    placeholder="Enter your address"
                  />
                </div>
                {formErrors.address && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.address}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-md font-medium text-gray-700 mb-1">
                    City*
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      formErrors.city ? "border-red-500" : "border-gray-300"
                    } rounded-md`}
                    placeholder="City"
                  />
                  {formErrors.city && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.city}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-md font-medium text-gray-700 mb-1">
                    Pincode*
                  </label>
                  <input
                    type="number"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      formErrors.pincode ? "border-red-500" : "border-gray-300"
                    } rounded-md`}
                    placeholder="Pincode"
                  />
                  {formErrors.pincode && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.pincode}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-md font-medium text-gray-700 mb-1">
                    Country*
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      formErrors.country ? "border-red-500" : "border-gray-300"
                    } rounded-md`}
                    placeholder="Country"
                  />
                  {formErrors.country && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.country}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-md font-medium text-gray-700 mb-1">
                    Arrival Date*
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="arrival_date"
                      value={formData.arrival_date}
                      onChange={handleChange}
                      min={minArrivalDate}
                      max={maxArrivalDate}
                      className={`w-full px-3 py-2 border ${
                        formErrors.arrival_date
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md`}
                    />
                  </div>
                  <p className="text-x text-gray-500 mt-1">
                    Between December 01, 2025 - January 20, 2026
                  </p>
                  {formErrors.arrival_date && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.arrival_date}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-md font-medium text-gray-700 mb-1">
                    Departure Date*
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="departure_date"
                      value={formData.departure_date}
                      onChange={handleChange}
                      min={formData.arrival_date || minDepartureDate}
                      max={maxDepartureDate}
                      className={`w-full px-3 py-2 border ${
                        formErrors.departure_date
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md`}
                    />
                  </div>
                  <p className="text-x text-gray-500 mt-1">
                    Between December 01, 2025 - January 20, 2026
                  </p>
                  {formErrors.departure_date && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.departure_date}
                    </p>
                  )}
                </div>
              </div>
              <div className="mb-4">
                <h3 className="text-md font-medium border-b border-gray-300 pb-2 mb-4">
                  Would you like to volunteer for seva?
                </h3>

                <div className="flex items-center space-x-4 mb-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      className="h-5 w-5 text-blue-600"
                      checked={formData.isSeva === true}
                      onChange={() => setFormSevaStatus(true)}
                    />
                    <span className="ml-2 text-md">Yes</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="radio"
                      className="h-5 w-5 text-blue-600"
                      checked={formData.isSeva === false}
                      onChange={() => setFormSevaStatus(false)}
                    />
                    <span className="ml-2 text-md">No</span>
                  </label>
                </div>

                {formData.isSeva && (
                  <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-md font-medium text-gray-700">
                          Your Skills/Other Notes
                        </label>
                        <input
                          type="text"
                          value={formData.skill}
                          onChange={(e) =>
                            handleInputChange("skill", e.target.value)
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                        />
                      </div>

                      <div>
                        <label className="block text-md font-medium text-gray-700">
                          Which department would you like to serve in?
                        </label>
                        <select
                          value={formData.department}
                          onChange={(e) =>
                            handleInputChange("department", e.target.value)
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                        >
                          <option value="">Select Department</option>
                          {Object.entries(departments).map(([key, value]) => (
                            <option key={key} value={key}>
                              {value}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <p className="text-red-700 font-bold text-xl flex justify-center">
              Note : If other family members are attending the festival, please
              fill in the information below.
            </p>

            {/* Stay Information */}
            <div className="mb-8 p-3 mt-4 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 rounded-xl shadow-md grid sm:grid-cols-1 md:grid-cols-2">
              <h3 className="text-md font-semibold text-gray-800 flex items-center ps-4">
                Family Member Information
              </h3>

              <div className="flex items-center gap-4">
                <label className="text-md font-medium text-gray-800">
                  Total Members*
                </label>
                <select
                  name="totalMembers"
                  value={formData.totalMembers}
                  onChange={handleChange}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>
                      {num == 0 ? "select member" : num}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Member Information - Automatically shows based on total members selected */}
            <div className="mb-8">
              {formData.members.map((member, index) => (
                <div
                  key={index}
                  className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-white bg-orange-500 px-4 py-2 rounded-xl text-md">
                      Member {index + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(index)}
                      className="text-orange-600 rounded-md font-medium"
                    >
                      <MdCancel className="text-2xl " />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="block text-md font-medium text-gray-700 mb-1">
                        First Name*
                      </label>
                      <input
                        type="text"
                        value={member.first_name}
                        onChange={(e) =>
                          handleMemberChange(
                            index,
                            "first_name",
                            e.target.value
                          )
                        }
                        className={`w-full px-3 py-2 border ${
                          formErrors.members &&
                          formErrors.members[index]?.first_name
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md`}
                        placeholder="First Name"
                      />
                      {formErrors.members &&
                        formErrors.members[index]?.first_name && (
                          <p className="text-red-500 text-xs mt-1">
                            {formErrors.members[index].first_name}
                          </p>
                        )}
                    </div>

                    <div>
                      <label className="block text-md font-medium text-gray-700 mb-1">
                        Middle Name*
                      </label>
                      <input
                        type="text"
                        value={member.middle_name}
                        onChange={(e) =>
                          handleMemberChange(
                            index,
                            "middle_name",
                            e.target.value
                          )
                        }
                        className={`w-full px-3 py-2 border ${
                          formErrors.members &&
                          formErrors.members[index]?.middle_name
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md`}
                        placeholder="Middle Name"
                      />
                      {formErrors.members &&
                        formErrors.members[index]?.middle_name && (
                          <p className="text-red-500 text-xs mt-1">
                            {formErrors.members[index].middle_name}
                          </p>
                        )}
                    </div>

                    <div>
                      <label className="block text-md font-medium text-gray-700 mb-1">
                        Last Name*
                      </label>
                      <input
                        type="text"
                        value={member.last_name}
                        onChange={(e) =>
                          handleMemberChange(index, "last_name", e.target.value)
                        }
                        className={`w-full px-3 py-2 border ${
                          formErrors.members &&
                          formErrors.members[index]?.last_name
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md`}
                        placeholder="Last Name"
                      />
                      {formErrors.members &&
                        formErrors.members[index]?.last_name && (
                          <p className="text-red-500 text-xs mt-1">
                            {formErrors.members[index].last_name}
                          </p>
                        )}
                    </div>

                    <div>
                      <label className="block text-md font-medium text-gray-700 mb-1">
                        Age*
                      </label>
                      <input
                        type="number"
                        value={member.age}
                        onChange={(e) =>
                          handleMemberChange(index, "age", e.target.value)
                        }
                        className={`w-full px-3 py-2 border ${
                          formErrors.members && formErrors.members[index]?.age
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md`}
                        placeholder="Age"
                        min="0"
                        max="120"
                      />
                      {formErrors.members && formErrors.members[index]?.age && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.members[index].age}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-md font-medium text-gray-700 mb-1">
                        Mobile Number*
                      </label>
                      <div className="relative">
                        <PhoneInput
                          country={countryCode}
                          enableSearch={true}
                          value={member.mobile_no}
                          onChange={(phone) =>
                            handleMemberChange(index, "mobile_no", phone)
                          }
                          inputClass={`w-full px-3 py-2 border !w-full !bg-white !text-sm px-3 py-5 ${
                            formErrors.members &&
                            formErrors.members[index]?.arrival_date
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-md`}
                          buttonClass="!bg-white !border-r !border-gray-300 !rounded-l-md"
                          containerClass="!w-full"
                          className={`w-20 border ${
                            formErrors.members &&
                            formErrors.members[index]?.mobile_no
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-md`}
                        />
                      </div>

                      {formErrors.members &&
                        formErrors.members[index]?.mobile_no && (
                          <p className="text-red-500 text-xs mt-1">
                            {formErrors.members[index].mobile_no}
                          </p>
                        )}
                    </div>
                    <div>
                      <label className="block text-md font-medium text-gray-700 mb-1">
                        Arrival Date*
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={member.arrival_date}
                          onChange={(e) =>
                            handleMemberChange(
                              index,
                              "arrival_date",
                              e.target.value
                            )
                          }
                          min={minArrivalDate}
                          max={maxArrivalDate}
                          className={`w-full px-3 py-2 border ${
                            formErrors.members &&
                            formErrors.members[index]?.arrival_date
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-md`}
                        />
                      </div>
                      <p className="text-x text-gray-500 mt-1">
                        Between December 01, 2025 - January 20, 2026
                      </p>
                      {formErrors.members &&
                        formErrors.members[index]?.arrival_date && (
                          <p className="text-red-500 text-xs mt-1">
                            {formErrors.members[index].arrival_date}
                          </p>
                        )}
                    </div>

                    <div>
                      <label className="block text-md font-medium text-gray-700 mb-1">
                        Departure Date*
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={member.departure_date}
                          onChange={(e) =>
                            handleMemberChange(
                              index,
                              "departure_date",
                              e.target.value
                            )
                          }
                          min={member.arrival_date || minDepartureDate}
                          max={maxDepartureDate}
                          className={`w-full px-3 py-2 border ${
                            formErrors.members &&
                            formErrors.members[index]?.departure_date
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-md`}
                        />
                      </div>
                      <p className="text-x text-gray-500 mt-1">
                        Between December 01, 2025 - January 20, 2026
                      </p>
                      {formErrors.members &&
                        formErrors.members[index]?.departure_date && (
                          <p className="text-red-500 text-xs mt-1">
                            {formErrors.members[index].departure_date}
                          </p>
                        )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-md font-medium border-b border-gray-300 pb-2 mb-4">
                      Do you want to join the service?
                    </h3>

                    <div className="flex items-center space-x-4 mb-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          className="h-5 w-5 text-blue-600"
                          checked={member.isSeva === true}
                          onChange={() => setMemberSevaStatus(index, true)}
                        />
                        <span className="ml-2 text-md">Yes</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="radio"
                          className="h-5 w-5 text-blue-600"
                          checked={member.isSeva === false}
                          onChange={() => setMemberSevaStatus(index, false)}
                        />
                        <span className="ml-2 text-md">No</span>
                      </label>
                    </div>

                    {member.isSeva && (
                      <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-md font-medium text-gray-700">
                              Your Skills/Other Notes
                            </label>
                            <input
                              type="text"
                              value={member.skill}
                              onChange={(e) =>
                                handleMemberChange(
                                  index,
                                  "skill",
                                  e.target.value
                                )
                              }
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                            />
                          </div>

                          <div>
                            <label className="block text-md font-medium text-gray-700">
                              Which department do you want to serve in?
                            </label>
                            <select
                              value={member.department}
                              onChange={(e) =>
                                handleMemberChange(
                                  index,
                                  "department",
                                  e.target.value
                                )
                              }
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                            >
                              <option value="">Select Department</option>
                              {Object.entries(departments).map(
                                ([key, value]) => (
                                  <option key={key} value={key}>
                                    {value}
                                  </option>
                                )
                              )}
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Form Actions */}
            <div className="flex justify-center mt-6 space-x-4">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-md font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-md font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
