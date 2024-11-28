import { useState } from "react";
import "./form.css";

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
  // State for form data
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    emergencyInfo: "",
    location: "",
    pictureLink: "",
    comments: "",
  });

  // State for modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

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

    const newReport = new Report(
      formData.name,
      formData.phone,
      formData.emergencyInfo,
      formData.location,
      formData.pictureLink,
      formData.comments,
    );

    const existingReports = JSON.parse(localStorage.getItem("reports")) || [];
    const updatedReports = [...existingReports, newReport];

    localStorage.setItem("reports", JSON.stringify(updatedReports));
    addReport(newReport);

    // Clear the form and close the modal
    setFormData({
      name: "",
      phone: "",
      emergencyInfo: "",
      location: "",
      pictureLink: "",
      comments: "",
    });
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Button to open modal */}
      <button onClick={() => setIsModalOpen(true)}>Create New Report</button>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Create a New Report</h2>
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
              <button type="button" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default ReportForm;
