import React from "react";
import { DAYS } from "@tmp/front/constants";

type TimelineProps = {
  // style?: React.CSSProperties;
};

function Timeline({}: TimelineProps) {
  const containerStyles: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${DAYS.length}, auto)`,
    gridGap: "0.5rem",
    backgroundColor: "#ffffff",
    padding: "1rem",
    borderRadius: "5px",
  };

  const itemStyles: React.CSSProperties = {
    backgroundColor: "red",
    gridColumn: "2/6",
    padding: "5px",
    borderRadius: "5px",
    transition: "all 1s ease-out",
    boxShadow: "0px 0px 14px -9px rgba(66, 68, 90, 1)",
    MozBoxShadow: "0px 0px 14px -9px rgba(66, 68, 90, 1)",
    WebkitBoxShadow: "0px 0px 14px -9px rgba(66, 68, 90, 1)",
    color: "#ffffff"
  };

  return (
    <div style={containerStyles}>
      {DAYS.map((day) => (
        <div>{day.short[0]}</div>
      ))}
      <div style={itemStyles}>Test Event</div>
    </div>
  );
}

export default Timeline;
