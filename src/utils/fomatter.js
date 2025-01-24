import moment from "moment";

export function getTimeAgo(date) {
  const timeAgo = moment(date).fromNow();

  return timeAgo;
}
