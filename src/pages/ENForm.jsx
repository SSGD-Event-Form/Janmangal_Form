import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AccommodationForm() {
  const [formData, setFormData] = useState({
    locale:"en",
    address: "",
    city: "",
    country: "",
    email: "",
    totalMembers: "1",
    members: [
      {
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
      },
    ],
  });

  const [suggestions, setAddressSuggestions] = useState([]);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate()
  // Simulated address suggestions
  const mockAddresses = [
    "123 Main St, Atlanta, USA",
    "456 Oak Ave, London, UK",
    "789 Patel Road, Ahmedabad, India",
    "101 Queen St, Toronto, Canada",
    "202 Elizabeth St, Sydney, Australia",
  ];

  // Minimum date constraints
  const minArrivalDate = "2025-12-01";
  const maxArrivalDate = "2026-01-20";
  const minDepartureDate = "2025-12-01";
  const maxDepartureDate = "2026-01-20";

  // Department options
  const departments = [
    "Kitchen",
    "Computer/Accounts",
    "Senior Citizen",
    "Medical",
    "Transportation",
    "Cleaning",
    "Registration",
    "Security",
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

  // Handle member age change with conditional seva showing
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

  // Form validation
  const validateForm = () => {
    const errors = {};

    // Validate email
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    // Validate address
    if (!formData.address) {
      errors.address = "Address is required";
    }

    // Validate city
    if (!formData.city) {
      errors.city = "City is required";
    }

    // Validate country
    if (!formData.country) {
      errors.country = "Country is required";
    }

    // Validate member information
    const memberErrors = [];
    formData.members.forEach((member, index) => {
      const memberError = {};

      if (!member.first_name) {
        memberError.first_name = "First name is required";
      }
      if (!member.middle_name) {
        memberError.middle_name = "Middle name is required";
      }
      if (!member.last_name) {
        memberError.last_name = "Last name is required";
      }

      if (!member.age) {
        memberError.age = "Age is required";
      } else if (
        isNaN(member.age) ||
        parseInt(member.age) < 0 ||
        parseInt(member.age) > 120
      ) {
        memberError.age = "Age must be between 0-120";
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
          toast.error("Validation failed. Please check the errors.");
          return;
        }

        navigate("/en-thanku");
        toast.success("Form submitted successfully!");
        console.log(response);
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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orange-600">
            Jay Swaminarayan
          </h1>
          <h2 className="text-2xl font-semibold text-gray-800 mt-2">
            Janmangal Mahotsav 2026
          </h2>
          <h3 className="text-xl text-gray-700">
            NRI Temporary Accommodation Request
          </h3>
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
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
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
                      placeholder="Email Address"
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
                  Address*
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
                    placeholder="Enter your address"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
              </div>
            </div>

            {/* Stay Information */}
            <div className="mb-8">
              <h3 className="text-lg font-medium border-b border-gray-300 pb-2 mb-4">
                Stay Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Members*
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
                Member Information
              </h3>

              {formData.members.map((member, index) => (
                <div
                  key={index}
                  className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-700">
                      Member {index + 1}
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mobile No*
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          value={member.mobile_no}
                          onChange={(e) =>
                            handleMemberChange(
                              index,
                              "mobile_no",
                              e.target.value
                            )
                          }
                          placeholder="Mobile No"
                          className={`w-full px-3 py-2 border ${
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      <p className="text-xs text-gray-500 mt-1">
                        Between Dec 01, 2025 - Jan 20, 2026
                      </p>
                      {formErrors.members &&
                        formErrors.members[index]?.arrival_date && (
                          <p className="text-red-500 text-xs mt-1">
                            {formErrors.members[index].arrival_date}
                          </p>
                        )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      <p className="text-xs text-gray-500 mt-1">
                        Between Dec 01, 2025 - Jan 20, 2026
                      </p>
                      {formErrors.members &&
                        formErrors.members[index]?.departure_date && (
                          <p className="text-red-500 text-xs mt-1">
                            {formErrors.members[index].departure_date}
                          </p>
                        )}
                    </div>
                  </div>
                  {/* Seva Section - only show if age > 15 */}
                  {member.age && parseInt(member.age) > 15 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-medium border-b border-gray-300 pb-2 mb-4">
                        Do You Want to join Seva?
                      </h3>

                      <div className="flex items-center space-x-4 mb-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            className="h-5 w-5 text-blue-600"
                            checked={member.isSeva === true}
                            onChange={() => setMemberSevaStatus(index, true)}
                          />
                          <span className="ml-2">Yes</span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="radio"
                            className="h-5 w-5 text-blue-600"
                            checked={member.isSeva === false}
                            onChange={() => setMemberSevaStatus(index, false)}
                          />
                          <span className="ml-2">No</span>
                        </label>
                      </div>

                      {member.isSeva && (
                        <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Your Skills/ Other Notes
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
                              <label className="block text-sm font-medium text-gray-700">
                                Which department would you like to serve in?
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
                  )}
                </div>
              ))}
            </div>

            {/* Form Actions */}
            <div className="flex justify-center mt-6 space-x-4">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </form>
        {/* Footer */}
        <div className="text-center text-gray-500 text-sm pb-8">
          © 2025 Janmangal Mahotsav Committee. All rights reserved.
        </div>
      </div>
    </div>
  );
}
