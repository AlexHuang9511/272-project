import { useEffect, useState } from "react";
import Form from "./form.jsx";
import ReportList from "./reportList.jsx";
import "./App.css";
import Header from "./Header.jsx";
import Map from "./map.jsx";

function App() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const savedReports = JSON.parse(localStorage.getItem("reports")) || [];
    setReports(savedReports);
  }, []);

  // Function to add a new report and update local storage
  const addReport = (newReport) => {
    const updatedReports = [...reports, newReport];
    setReports(updatedReports);
    localStorage.setItem("reports", JSON.stringify(updatedReports));
  };

  return (
    <>
      <Header />
      <h1>create new report</h1>
      <Form addReport={addReport} />
      <br></br>

      <Map reports={reports} />
      <ReportList reports={reports} />
    </>
  );
}

export default App;
