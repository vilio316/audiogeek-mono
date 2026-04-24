import React from "react";

export const SpinnerLoader: React.FC<{ className?: string }> = ({
  className = "",
}) => (
  <div
    className={`flex items-center justify-center w-screen h-screen ${className}`}
    data-testid="spinner-loader"
  >
    <div className="animate-spin rounded-full h-40 w-40 border-10 border-green-500 border-t-transparent"></div>
  </div>
);
