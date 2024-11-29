import { useEffect, useState } from "react";
import Form from "./form.jsx";
import ReportList from "./reportList.jsx";
import "./App.css";
import md5 from "crypto-js/md5";

function App() {
  const PASSWORD_HASH = md5("1234").toString(); // Predefined hashed password
  const [reports, setReports] = useState([]);

  // Load saved reports from localStorage when the app initializes
  useEffect(() => {
    const savedReports = JSON.parse(localStorage.getItem("reports")) || [];
    setReports(savedReports);
  }, []);

  // Save reports to localStorage whenever they change
  const saveReports = (updatedReports) => {
    setReports(updatedReports);
    localStorage.setItem("reports", JSON.stringify(updatedReports));
  };

  // Add a new report
  const addReport = (newReport) => {
    saveReports([...reports, newReport]);
  };

  // Delete a report with password verification
  const deleteReport = (index) => {
    const password = window.prompt("Enter the password to delete this report:");
    if (password && md5(password).toString() === PASSWORD_HASH) {
      saveReports(reports.filter((_, idx) => idx !== index));
      alert("Report deleted successfully.");
    } else {
      alert("Incorrect password. Deletion canceled.");
    }
  };

  return (
    <div>
      <h1>Emergency Report System</h1>
      <Form addReport={addReport} />
      <ReportList reports={reports} onDelete={deleteReport} />
    </div>
  );
}

export default App;
