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
    comments = ""
  ) {
    this.name = name;
    this.phone = phone;
    this.emergencyInfo = emergencyInfo;
    this.location = location;
    this.pictureLink = pictureLink;
    this.comments = comments;
    this.status = "OPEN";
    this.time = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
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
      formData.comments
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
            <form id="report-form" onSubmit={handleSubmit}>
              <div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full name"
                  required
                />
                <label htmlFor="name">Name </label>
              </div>
              <div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  required
                />
                <label htmlFor="phone">Phone Number </label>
              </div>
              <div>
                <input
                  id="emergencyInfo"
                  name="emergencyInfo"
                  value={formData.emergencyInfo}
                  onChange={handleChange}
                  placeholder="Emergency info"
                  required
                />
                <label className="textarea-placeholder" htmlFor="emergencyInfo">Emergency Info </label>
              </div>
              <div>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Location of incident"
                  required
                />
                <label htmlFor="location">Location </label>
              </div>
              <div>
                <input
                  type="url"
                  id="pictureLink"
                  name="pictureLink"
                  value={formData.pictureLink}
                  placeholder="Picture link (optional)"
                  onChange={handleChange}
                />
                <label htmlFor="pictureLink">Picture Link (optional) </label>
              </div>
              <div>
                <input
                  id="comments"
                  name="comments"
                  value={formData.comments}
                  onChange={handleChange}
                  placeholder="Comments (optional)"
                />
                <label className="textarea-placeholder" htmlFor="comments">Comments (optional) </label>
              </div>
              <button className="formbutton submit" type="submit">Submit</button>
              <button className="formbutton cancel" type="button" onClick={() => setIsModalOpen(false)}>
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
