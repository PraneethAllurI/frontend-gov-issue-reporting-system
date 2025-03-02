import React from "react";

const ReportCard = ({ report }) => {
  console.log(report)
  //const coordinates = report.location?.coordinates || [];

  return (
    <div className="border p-4 rounded-md shadow-md bg-white">
      <h3 className="font-semibold text-lg">{report.title}</h3>

      {/* Ensure the image is properly sized */}
      {report.image && (
        <div className="overflow-hidden rounded-md">
          <img
            src={report.image}
            alt="Issue Report"
            className="object-cover"
            style={{height: "100px", width:"200px"}}
          />
        </div>
      )}

      <p className="text-gray-600">Status: {report.status}</p>

      {/* <p className="text-gray-600">
        Location:{" "}
        {coordinates.length === 2
          ? `Lat: ${coordinates[1]}, Lng: ${coordinates[0]}`
          : "Not Provided"}
      </p> */}
      <p>{report.location ? `Location: ${report.location}` : "Somewhere on Earth"}</p>
    </div>
  );
};

export default ReportCard;
