import { useEffect, useState } from "react";
import Form from "./form.jsx";
import ReportList from "./reportList.jsx";
import "./App.css";
import Map from "./map.jsx";
import Header from "./Header.jsx";
import md5 from "crypto-js/md5";

function App() {
  const PASSWORD_HASH = md5("1234").toString(); // Predefined hashed password
  const [reports, setReports] = useState([]);
  const [reportFromMap, setReportsInMap] = useState([]);

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

  // Edit status with password verification
  const changeReportStatus = (report) => {
    const getReports = [...reports];
    getReports.forEach((search, index) => {
      if (report.name === search.name && report.time === search.time) {
        if (getReports[index].status == "OPEN") {
          const password = window.prompt(
            "Enter the password to change Status of report to RESOLVED:",
          );
          if (password && md5(password).toString() === PASSWORD_HASH) {
            getReports[index].status = "RESOLVED";
            saveReports(getReports);
            alert("Report status successfully changed to resolved.");
          } else {
            alert("Incorrect password. Change in status canceled.");
          }
        } else {
          const password = window.alert(
            "This report is resolved and cannot be re-opened.\nPlease submit a new report.",
          );
        }
      }
    });
  };

  return (
    <div className="component-container">
      <Header />
      <h1>Emergency Report System</h1>
      <Form addReport={addReport} />
      <Map reports={reports} setReportsInMap={setReportsInMap} />
      <ReportList
        reports={reportFromMap}
        onDelete={deleteReport}
        onChangeStatus={changeReportStatus}
      />
    </div>
  );
}

export default App;

