import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

export default function AccommodationForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    address: "",
    city: "",
    country: "",
    mobileNo: "",
    email: "",
    arrivalDate: "",
    departureDate: "",
    totalMembers: "1",
    adults: "1",
    kids: "0",
    SeniorCitizen: "",
    members: [
      {
        firstName: "",
        middleName: "",
        lastName: "",
        age: "",
        joinSeva: false,
        sevaDepartment: "",
      },
    ],
    skills: "",
  });

  const [suggestions, setAddressSuggestions] = useState([]);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Simulated address suggestions
  const mockAddresses = [
    "123 મેઈન સ્ટ્રીટ, અટલાન્ટા, યુએસએ",
    "456 ઓક એવેન્યુ, લંડન, યુકે",
    "789 પટેલ રોડ, અમદાવાદ, ભારત",
    "101 ક્વીન સ્ટ્રીટ, ટોરોન્ટો, કેનેડા",
    "202 એલિઝાબેથ સ્ટ્રીટ, સિડની, ઓસ્ટ્રેલિયા",
  ];

  // Minimum date constraints
  const minArrivalDate = "2025-12-01";
  const maxArrivalDate = "2026-01-20";
  const minDepartureDate = "2025-12-01";
  const maxDepartureDate = "2026-01-20";

  // Department options
  const departments = [
    "રસોડું",
    "કમ્પ્યુટર/હિસાબ",
    "વરિષ્ઠ નાગરિક",
    "તબીબી",
    "પરિવહન",
    "સફાઈ",
    "નોંધણી",
    "સુરક્ષા",
  ];

  // Update address suggestions when typing
  const handleAddressChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, address: value });

    if (value.length > 2) {
      const filteredSuggestions = mockAddresses.filter((addr) =>
        addr.toLowerCase().includes(value.toLowerCase())
      );
      setAddressSuggestions(filteredSuggestions);
      setShowAddressSuggestions(true);
    } else {
      setShowAddressSuggestions(false);
    }
  };

  // Select address from suggestions
  const selectAddress = (address) => {
    // Extract country from address
    const addressParts = address.split(", ");
    const selectedCountry = addressParts[addressParts.length - 1];

    setFormData({
      ...formData,
      address: address,
      country: selectedCountry,
    });
    setShowAddressSuggestions(false);
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
            firstName: "",
            middleName: "",
            lastName: "",
            age: "",
            joinSeva: false,
            sevaDepartment: "",
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

  // Handle member data changes
  const handleMemberChange = (index, field, value) => {
    const updatedMembers = [...formData.members];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setFormData({ ...formData, members: updatedMembers });
  };

  // Handle member skills change
  const handleSkillsChange = (e) => {
    setFormData({ ...formData, skills: e.target.value });
  };

  // Handle department selection
  const handleDepartmentChange = (e) => {
    setFormData({ ...formData, department: e.target.value });
  };

  // Set join seva status for all members
  const setWantToJoin = (value) => {
    const updatedMembers = formData.members.map((member) => ({
      ...member,
      joinSeva: value,
    }));

    setFormData({
      ...formData,
      members: updatedMembers,
    });
  };

  // Form validation
  const validateForm = () => {
    const errors = {};

    // Validate email
    if (!formData.email) {
      errors.email = "ઈમેલ જરૂરી છે";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "ઈમેલ અમાન્ય છે";
    }

    // Validate address
    if (!formData.address) {
      errors.address = "સરનામું જરૂરી છે";
    }

    // Validate city
    if (!formData.city) {
      errors.city = "શહેર જરૂરી છે";
    }

    // Validate country
    if (!formData.country) {
      errors.country = "દેશ જરૂરી છે";
    }

    // Validate mobile number
    if (!formData.mobileNo) {
      errors.mobileNo = "મોબાઈલ નંબર જરૂરી છે";
    }

    // Validate dates
    if (!formData.arrivalDate) {
      errors.arrivalDate = "આગમન તારીખ જરૂરી છે";
    }

    if (!formData.departureDate) {
      errors.departureDate = "પ્રસ્થાન તારીખ જરૂરી છે";
    } else if (
      formData.arrivalDate &&
      new Date(formData.departureDate) < new Date(formData.arrivalDate)
    ) {
      errors.departureDate = "પ્રસ્થાન તારીખ આગમન તારીખ પછી હોવી જોઈએ";
    }

    // Validate member information
    const memberErrors = [];
    formData.members.forEach((member, index) => {
      const memberError = {};

      if (!member.firstName) {
        memberError.firstName = "પ્રથમ નામ જરૂરી છે";
      }

      if (!member.middleName) {
        memberError.middleName = "મધ્ય નામ જરૂરી છે";
      }

      if (!member.lastName) {
        memberError.lastName = "અટક જરૂરી છે";
      }

      if (!member.age) {
        memberError.age = "ઉંમર જરૂરી છે";
      } else if (
        isNaN(member.age) ||
        parseInt(member.age) < 0 ||
        parseInt(member.age) > 120
      ) {
        memberError.age = "ઉંમર 0-120 વચ્ચે હોવી જોઈએ";
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

  // Submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);

      try {
        const response = await axios.post(
          "https://api.janmangal.ssgd.org/api/accommodations",
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("ફોર્મ સફળતાપૂર્વક સબમિટ થયું:", response.data);
      } catch (error) {
        console.error("ફોર્મ સબમિટ કરવામાં ભૂલ:", error);
        setFormErrors({
          submit: "એક ભૂલ આવી. કૃપા કરી ફરી પ્રયાસ કરો.",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orange-600">
            જય સ્વામિનારાયણ
          </h1>
          <h2 className="text-2xl font-semibold text-gray-800 mt-2">
            જન્મમંગલ મહોત્સવ ૨૦૨૬
          </h2>
          <h3 className="text-xl text-gray-700">એનઆરઆઈ અસ્થાયી આવાસ વિનંતી</h3>
        </div>

        {/* Error Message */}
        {formErrors.submit && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {formErrors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="bg-white shadow-lg rounded-lg p-6 mb-10">
            {/* Personal Information */}
            <div className="mb-8">
              <h3 className="text-lg font-medium border-b border-gray-300 pb-2 mb-4">
                વ્યક્તિગત માહિતી
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ઈમેલ*
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${
                        formErrors.email ? "border-red-500" : "border-gray-300"
                      } rounded-md`}
                      placeholder="ઈમેલ સરનામું"
                    />
                  </div>
                  {formErrors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.email}
                    </p>
                  )}
                </div>
              </div>
              <div className="mb-4 mt-4 relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  સરનામું*
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleAddressChange}
                    className={`w-full px-3 py-2 border ${
                      formErrors.address ? "border-red-500" : "border-gray-300"
                    } rounded-md`}
                    placeholder="તમારું સરનામું દાખલ કરો"
                  />
                </div>
                {formErrors.address && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.address}
                  </p>
                )}

                {/* Address suggestions */}
                {showAddressSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-10 w-full bg-white mt-1 border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                        onClick={() => selectAddress(suggestion)}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    શહેર*
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      formErrors.city ? "border-red-500" : "border-gray-300"
                    } rounded-md`}
                    placeholder="શહેર"
                  />
                  {formErrors.city && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.city}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    દેશ*
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      formErrors.country ? "border-red-500" : "border-gray-300"
                    } rounded-md`}
                    placeholder="દેશ"
                  />
                  {formErrors.country && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.country}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Stay Information */}
            <div className="mb-8">
              <h3 className="text-lg font-medium border-b border-gray-300 pb-2 mb-4">
                રોકાણની માહિતી
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    કુલ સભ્યો*
                  </label>
                  <select
                    name="totalMembers"
                    value={formData.totalMembers}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Member Information - Automatically shows based on total members selected */}
            <div className="mb-8">
              <h3 className="text-lg font-medium border-b border-gray-300 pb-2 mb-4">
                સભ્યની માહિતી
              </h3>

              {formData.members.map((member, index) => (
                <div
                  key={index}
                  className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-700">
                      સભ્ય {index + 1}
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        પ્રથમ નામ*
                      </label>
                      <input
                        type="text"
                        value={member.firstName}
                        onChange={(e) =>
                          handleMemberChange(index, "firstName", e.target.value)
                        }
                        className={`w-full px-3 py-2 border ${
                          formErrors.members &&
                          formErrors.members[index]?.firstName
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md`}
                        placeholder="પ્રથમ નામ"
                      />
                      {formErrors.members &&
                        formErrors.members[index]?.firstName && (
                          <p className="text-red-500 text-xs mt-1">
                            {formErrors.members[index].firstName}
                          </p>
                        )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        મધ્ય નામ
                      </label>
                      <input
                        type="text"
                        value={member.middleName}
                        onChange={(e) =>
                          handleMemberChange(
                            index,
                            "middleName",
                            e.target.value
                          )
                        }
                        className={`w-full px-3 py-2 border ${
                          formErrors.members &&
                          formErrors.members[index]?.middleName
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md`}
                        placeholder="મધ્ય નામ"
                      />{" "}
                      {formErrors.members &&
                        formErrors.members[index]?.middleName && (
                          <p className="text-red-500 text-xs mt-1">
                            {formErrors.members[index].middleName}
                          </p>
                        )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        અટક*
                      </label>
                      <input
                        type="text"
                        value={member.lastName}
                        onChange={(e) =>
                          handleMemberChange(index, "lastName", e.target.value)
                        }
                        className={`w-full px-3 py-2 border ${
                          formErrors.members &&
                          formErrors.members[index]?.lastName
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md`}
                        placeholder="અટક"
                      />
                      {formErrors.members &&
                        formErrors.members[index]?.lastName && (
                          <p className="text-red-500 text-xs mt-1">
                            {formErrors.members[index].lastName}
                          </p>
                        )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ઉંમર*
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
                        placeholder="ઉંમર"
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        મોબાઈલ નંબર*
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          name="mobileNo"
                          value={formData.mobileNo}
                          placeholder="મોબાઈલ નંબર"
                          onChange={handleChange}
                          className={`w-full px-3 py-2 border ${
                            formErrors.mobileNo
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-md`}
                        />
                      </div>

                      {formErrors.mobileNo && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.mobileNo}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        આગમન તારીખ*
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          name="arrivalDate"
                          value={formData.arrivalDate}
                          onChange={handleChange}
                          min={minArrivalDate}
                          max={maxArrivalDate}
                          className={`w-full px-3 py-2 border ${
                            formErrors.arrivalDate
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-md`}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        ડિસેમ્બર 01, 2025 - જાન્યુઆરી 20, 2026 વચ્ચે
                      </p>
                      {formErrors.arrivalDate && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.arrivalDate}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        પ્રસ્થાન તારીખ*
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          name="departureDate"
                          value={formData.departureDate}
                          onChange={handleChange}
                          min={formData.arrivalDate || minDepartureDate}
                          max={maxDepartureDate}
                          className={`w-full px-3 py-2 border ${
                            formErrors.departureDate
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-md`}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        ડિસેમ્બર 01, 2025 - જાન્યુઆરી 20, 2026 વચ્ચે
                      </p>
                      {formErrors.departureDate && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.departureDate}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Seva Section */}
            <div className="mb-8">
              <h3 className="text-lg font-medium border-b border-gray-300 pb-2 mb-4">
                શું તમે સેવામાં જોડાવા માંગો છો?
              </h3>

              <div className="flex items-center space-x-4 mb-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    className="h-5 w-5 text-blue-600"
                    checked={formData.members[0]?.joinSeva === true}
                    onChange={() => setWantToJoin(true)}
                  />
                  <span className="ml-2">હા</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    className="h-5 w-5 text-blue-600"
                    checked={formData.members[0]?.joinSeva === false}
                    onChange={() => setWantToJoin(false)}
                  />
                  <span className="ml-2">ના</span>
                </label>
              </div>
              {formData.members[0]?.joinSeva && (
                <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        તમારા કૌશલ્યો/અન્ય નોંધો
                      </label>
                      <input
                        type="text"
                        name="skills"
                        value={formData.skills}
                        onChange={handleSkillsChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        કયા વિભાગમાં સેવા આપવા ઇચ્છો છો?
                      </label>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleDepartmentChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                      >
                        <option value="">વિભાગ પસંદ કરો</option>
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex justify-center mt-6 space-x-4">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                રદ કરો
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                {isSubmitting ? "સબમિટ થઈ રહ્યું છે..." : "સબમિટ કરો"}
              </button>
            </div>
          </div>
        </form>
        {/* Form Actions */}
        <div className="text-center text-gray-500 text-sm pb-8">
          © 2025 જન્મમંગલ મહોત્સવ કમિટી. બધા અધિકારો સુરક્ષિત.
        </div>
      </div>
    </div>
  );
}
