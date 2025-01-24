import React from "react";
import { getTimeAgo } from "../../utils/fomatter";
import "./launch-card.scss";

const LaunchCard = (props) => {
  const [hideDetails, setHideDetails] = React.useState(true);

  const renderStatus = () => {
    if (props.upcoming) {
      return (
        <div className="launch-card__status launch-card__status--upcoming">
          Upcoming
        </div>
      );
    }

    if (props.launch_success) {
      return (
        <div className="launch-card__status launch-card__status--success">
          Success
        </div>
      );
    }

    return (
      <div className="launch-card__status launch-card__status--failure">
        Failed
      </div>
    );
  };

  return (
    <div
      className={`launch-card ${props.className}`}
      style={{
        backgroundImage: `url(${props.links.flickr_images[0]})`,
      }}
    >
      <div className="launch-card__front">
        <div className="launch-card__front-header">{renderStatus()}</div>
        <div className="launch-card__front-body">
          {!props.links.mission_patch_small ? (
            "No image yet"
          ) : (
            <img
              src={props.links.mission_patch_small}
              alt={props.mission_name}
              className="launch-card__front-image"
            />
          )}
          <h2 className="launch-card__front-title">{props.mission_name} </h2>{" "}
        </div>
        <div className="launch-card__front-footer"></div>
      </div>

      <div
        className={`launch-card__body ${
          !hideDetails ? "launch-card__body--visible" : ""
        }`}
      >
        <div className={`launch-card__body-info`}>
          <span className="launch-card__body-date">
            {getTimeAgo(props.launch_date_local)}
          </span>
          <div className="launch-card__body-links">
            <a href={props.links.article_link}>article</a>|
            <a href={props.links.video_link}>video</a>
          </div>
        </div>
        <div className="launch-card__body-details">{props.details}</div>
      </div>
      <button
        className={`launch-card__body-button ${
          !hideDetails ? "" : "launch-card__body-button--open"
        }`}
        onClick={() => setHideDetails((prev) => !prev)}
      ></button>
    </div>
  );
};

export default LaunchCard;
