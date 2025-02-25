import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SkeletonReportCard = () => {
  return (
    <div className="bg-white p-4 rounded-md shadow-md">
      <Skeleton height={20} width="60%" className="mb-2" />
      <Skeleton height={15} width="80%" className="mb-2" />
      <Skeleton height={200} width="100%" className="mb-2" />
      <Skeleton height={15} width="50%" />
    </div>
  );
};

export default SkeletonReportCard;
