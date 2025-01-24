import React from "react";
import { getTimeAgo } from "../../utils/fomatter";
import { Link } from "react-router-dom";

const LaunchCard = (props) => {
  const [showDetails, setShowDetails] = React.useState(false);

  const toggelDetails = () => {
    setShowDetails(!showDetails);
  };

  const renderStatus = () => {
    const style = {
      fontSize: "0.75rem",
      padding: "0.1rem 0.5rem",
      borderRadius: "15px",
    };

    if (props.upcoming) {
      return (
        <span
          style={{
            backgroundColor: "deepskyblue",
            color: "white",
            ...style,
          }}
        >
          Upcoming
        </span>
      );
    }

    if (props.launch_success) {
      return (
        <span
          style={{
            backgroundColor: "green",
            color: "white",
            ...style,
          }}
        >
          Success
        </span>
      );
    }

    return (
      <span style={{ backgroundColor: "red", color: "white", ...style }}>
        Failed
      </span>
    );
  };

  return (
    <div
      style={{
        textAlign: "left",
        padding: "1rem",
        border: "1px solid #ccc",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "1rem",
      }}
    >
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <h2>{props.mission_name} </h2> {renderStatus()}
      </div>
      {showDetails && (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <div style={{ display: "flex", gap: "0.2rem" }}>
            <span>{getTimeAgo(props.launch_date_local)}</span>|
            <Link to={props.links.article_link}>article</Link>|
            <Link to={props.links.video_link}>video</Link>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {!props.links.mission_patch_small ? (
              "No image yet"
            ) : (
              <img
                src={props.links.mission_patch_small}
                alt={props.mission_name}
                style={{ width: "100px", height: "100px" }}
              />
            )}
            <p>{props.details}</p>
          </div>
        </div>
      )}
      <button
        onClick={toggelDetails}
        style={{
          padding: "0.7rem 1rem",
          backgroundColor: "blue",
          color: "white",
          border: "none",
          textTransform: "uppercase",
          cursor: "pointer",
          borderRadius: "8px",
        }}
      >
        {showDetails ? "Hide" : "Show"}
      </button>
    </div>
  );
};

export default LaunchCard;
