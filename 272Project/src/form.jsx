import { useState } from "react";

// for each report
class Report {
  constructor(
    name,
    phone,
    emergencyInfo,
    location,
    pictureLink = "",
    comments = "",
  ) {
    this.name = name;
    this.phone = phone;
    this.emergencyInfo = emergencyInfo;
    this.location = location;
    this.pictureLink = pictureLink;
    this.comments = comments;
    this.status = "OPEN";
  }
}

function ReportForm({ addReport }) {
  // Initialize state for form inputs
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    emergencyInfo: "",
    location: "",
    pictureLink: "",
    comments: "",
  });

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    // Create a new ContactInfo instance using form data
    const newReport = new Report(
      formData.name,
      formData.phone,
      formData.emergencyInfo,
      formData.location,
      formData.pictureLink,
      formData.comments,
    );

    // Retrieve existing contacts from local storage, or initialize with an empty array
    const existingReports = JSON.parse(localStorage.getItem("reports")) || [];

    // Add the new contact to the list of contacts
    const updatedReports = [...existingReports, newReport];

    // Save the updated contacts list back to local storage
    localStorage.setItem("reports", JSON.stringify(updatedReports));

    addReport(newReport);

    // clear the form after submission
    setFormData({
      name: "",
      phone: "",
      emergencyInfo: "",
      location: "",
      pictureLink: "",
      comments: "",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="phone">Phone Number:</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="emergencyInfo">Emergency Info:</label>
        <textarea
          id="emergencyInfo"
          name="emergencyInfo"
          value={formData.emergencyInfo}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="location">Location:</label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="pictureLink">Picture Link (optional):</label>
        <input
          type="url"
          id="pictureLink"
          name="pictureLink"
          value={formData.pictureLink}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="comments">Comments (optional):</label>
        <textarea
          id="comments"
          name="comments"
          value={formData.comments}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}

export default ReportForm;
