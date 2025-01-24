import React from "react";
import api from "../utils/api";

const useFetchLaunches = () => {
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [isSuccess, setIsSuccess] = React.useState(false);

  async function exec({ search, offset, limit, sort, order }) {
    try {
      setIsLoading(true);
      const res = await api.get("/launches", {
        params: {
          id: true,
          limit,
          offset,
          sort,
          order,
          launch_year: search,
        },
      });
      const data = res.data;

      setData(data);
      setError(null);
      setIsSuccess(true);
    } catch (error) {
      setError(error);
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  }

  return { data, isLoading, error, exec, isSuccess };
};

export default useFetchLaunches;
