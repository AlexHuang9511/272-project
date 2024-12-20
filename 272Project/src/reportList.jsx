import React, { useEffect, useState } from "react";
import "./reportList.css";

function ReportList({ reports, onDelete, onChangeStatus, markers, setHighlight, mapReset, mapHasReset}) {
  const [alreadyHighlighted, setAlreadyHighlighted] = useState(null);
  function setClickedReport(clickedReport){
    console.log("MARKERS ", markers);
    console.log("ALREADY", alreadyHighlighted);
    // highlighted marker already
    if(alreadyHighlighted){
      alreadyHighlighted._icon.style.filter = "hue-rotate(0deg)";
    }
    if(clickedReport){
      console.log("I CLICKED THIS", clickedReport);
      const highlightMarker = markers.find((marker)=> 
            marker.data.name === clickedReport.name &&
            marker.data.time === clickedReport.time &&
            marker.data.phone === clickedReport.phone &&
            marker.data.emergencyInfo === clickedReport.emergencyInfo &&
            marker.data.location === clickedReport.location &&
            marker.data.pictureLink === clickedReport.pictureLink &&
            marker.data.comments === clickedReport.comments);
      highlightMarker.openPopup();
      highlightMarker._icon.style.filter = "hue-rotate(-120deg)";
      setHighlight(highlightMarker);
      console.log("SET HIGHLIGHT", highlightMarker);
      setAlreadyHighlighted(highlightMarker);
    }
  }

  useEffect(()=>{
    if(mapReset){
      mapHasReset(false);
      setAlreadyHighlighted(null);
    }
  }, [mapReset]);

  return (
    <div className="ReportListCenter">
      <h2>Report List</h2>
      <div id="details-backing" onClick={() => {
        const reportDetails = document.querySelector("#report-details");
        reportDetails.style.display = "none";
        const detailsBacking = document.querySelector("#details-backing");
        detailsBacking.style.display = "none";
      }}></div>
      <div id="report-details">
        <img
          id="report-details-image"
          src=""
          target="_blank"
          rel="noopener noreferrer"
        />
        <p> Emergency Info: <em id="report-type"></em></p>
        <p> Location: <em id="report-location"></em></p>
        <p> Reported by: <em id="report-name-phone"></em></p>
        <p> Time of Report: <em id="report-date-time"></em></p>
        <p> Current Status: <em id="report-status"></em></p>
        <p id="comments-p"> Comments: <em id="report-comments"></em></p>
      </div>
      {reports.length === 0 ? <p>No reports available.</p> : (
        <table>
          <tbody>
            {reports.map((report, index) => (
              <tr key={index}>
                <td onClick={() => {openReportDetails(report); setClickedReport(report);}}>{report.name}</td>
                <td onClick={() => {openReportDetails(report); setClickedReport(report);}}>
                  {report.phone}
                </td>
                <td onClick={() => {openReportDetails(report); setClickedReport(report);}}>
                  {report.emergencyInfo}
                </td>
                <td onClick={() => {openReportDetails(report); setClickedReport(report);}}>
                  {report.location}
                </td>

                {/* If picture link exists */}
                {report.pictureLink && (
                  <td onClick={() => {openReportDetails(report); setClickedReport(report);}}>
                    <img
                      className="report-image"
                      src={report.pictureLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  </td>
                )}

                {/* If picture link doesn't exist */}
                {!report.pictureLink && (
                  <td className="not-provided" onClick={() => {openReportDetails(report); setClickedReport(report);}}>
                    <em>No picture provided</em>
                  </td>
                )}

                {/* If comment exists */}
                {report.comments && (
                  <td onClick={() => {openReportDetails(report); setClickedReport(report);}}>
                    {report.comments}
                  </td>
                )}

                {/* If comment does not exist */}
                {!report.comments && (
                  <td className="not-provided" onClick={() => {openReportDetails(report); setClickedReport(report);}}>
                    <em>No comments provided</em>
                  </td>
                )}
                <td onClick={() => {openReportDetails(report); setClickedReport(report);}}>
                  {report.status}{"  "}
                  <a
                    onClick={(event) => {
                      event.preventDefault();
                      onChangeStatus(report);
                    }}
                  >
                    Change
                  </a>
                </td>
                <td onClick={() => onDelete(report)}>
                  X
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function openReportDetails(report){
  const reportDetails = document.querySelector("#report-details");
  reportDetails.style.display = "flex";

  const detailsBacking = document.querySelector("#details-backing");
  detailsBacking.style.display = "block";

  const reportName = document.querySelector("#report-name-phone");
  reportName.innerHTML = report.name + " (" + report.phone + ")";

  const reportType = document.querySelector("#report-type");
  reportType.innerHTML = report.emergencyInfo;

  const reportImage = document.querySelector("#report-details-image");

  if (report.pictureLink){
    reportImage.src = report.pictureLink;
    reportImage.style.display = "block";
  }
  else {
    reportImage.style.display = "none";
  }

  const reportLocation = document.querySelector("#report-location");
  reportLocation.innerHTML = report.location;
  
  const reportComments = document.querySelector("#report-comments");
  const commentsContainer = document.querySelector("#comments-p");

  if (report.comments){
    reportComments.innerHTML = report.comments;
    commentsContainer.style.display = "inline-block";
  }
  else {
    commentsContainer.style.display = "none";
  }


  const reportDateTime = document.querySelector("#report-date-time");
  reportDateTime.innerHTML = report.year + "-" + report.month + "-" + report.date + " (" + report.time + ")";

  const reportStatus = document.querySelector("#report-status");
  reportStatus.innerHTML = report.status;
}

export default ReportList;
