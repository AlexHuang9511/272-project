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
  const [markers, setMarkers] = useState([]);
  const [highlight, setHighlight] = useState(null);
  const [mapReset, mapHasReset] = useState(false);

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
  const deleteReport = (report) => {
    const password = window.prompt("Enter the password to delete this report:");

    const getReports = [...reports];
    getReports.forEach((search, index) => {
      if (report.name === search.name && 
        report.time === search.time &&
        report.phone === search.phone &&
        report.emergencyInfo === search.emergencyInfo &&
        report.location === search.location &&
        report.pictureLink === search.pictureLink &&
        report.comments === search.comments
      ) {
        if (password && md5(password).toString() === PASSWORD_HASH) {
          saveReports(reports.filter((_, idx) => idx !== index));
          alert("Report deleted successfully.");
        } else {
          alert("Incorrect password. Deletion canceled.");
        }
      }
    });
  };

  // Edit status with password verification
  const changeReportStatus = (report) => {
    const getReports = [...reports];
    getReports.forEach((search, index) => {
      if (report.name === search.name && 
        report.time === search.time &&
        report.phone === search.phone &&
        report.emergencyInfo === search.emergencyInfo &&
        report.location === search.location &&
        report.pictureLink === search.pictureLink &&
        report.comments === search.comments
      ) {
        if (report.status == "OPEN") {
          const password = window.prompt(
            "Enter the password to change Status of report to RESOLVED:",
          );
          if (password && md5(password).toString() === PASSWORD_HASH) {
            report.status = "RESOLVED";
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

  useEffect(() => {
    console.log("APP HIGHLIGHT ", highlight);
  }, [highlight]);

  return (
    <div className="component-container">
      <Header />
      <h1>Emergency Report System</h1>
      <Form addReport={addReport} />
      <Map reports={reports} setReportsInMap={setReportsInMap} setMarkers={setMarkers} mapHasReset={mapHasReset}/>
      <ReportList
        reports={reportFromMap}
        onDelete={deleteReport}
        onChangeStatus={changeReportStatus}
        markers = {markers}
        setHighlight = {setHighlight}
        mapReset = {mapReset}
        mapHasReset = {mapHasReset}
      />
    </div>
  );
}

export default App;
