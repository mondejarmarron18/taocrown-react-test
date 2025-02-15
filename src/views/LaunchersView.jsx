import React, { useEffect, useState, useRef, useMemo } from "react";
import useFetchLaunches from "../hooks/useFetchLaunches";
import LaunchCard from "../components/LaunchCard";
import _ from "lodash";
import Spinner from "../components/Spinner";

function LaunchersView() {
  const { data, isLoading, exec } = useFetchLaunches();
  const [launches, setLaunches] = useState([]);
  const [filter, setFilter] = useState({ offset: 0, limit: 5 });
  const observerRef = useRef(null);
  const listContainerRef = useRef(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    exec(filter);
  }, [filter]);

  useEffect(() => {
    if (data) {
      setLaunches((prevLaunches) => [...prevLaunches, ...data]);
    }
  }, [data]);

  // infinite scroll
  useEffect(() => {
    if (!data.length || search) return;

    const options = {
      root: listContainerRef.current,
      rootMargin: "0px",
      threshold: 1,
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isLoading) {
        setFilter((prev) => ({
          offset: prev.offset + prev.limit,
          limit: prev.limit,
        }));
      }
    }, options);

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [isLoading, search]);

  const filteredData = useMemo(() => {
    return launches.filter(
      (launch) =>
        launch.mission_name.toLowerCase().includes(search) ||
        (launch.details && launch.details.toLowerCase().includes(search)) ||
        launch.launch_date_local.toLowerCase().includes(search)
    );
  }, [search, launches]);

  const handleSearchDebounce = _.debounce((value) => {
    setSearch(value.toLowerCase());
  }, 500);

  const handleSearch = (e) => {
    const value = e.target.value;

    handleSearchDebounce(value);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        alignItems: "center",
      }}
    >
      <input
        type="text"
        onChange={handleSearch}
        placeholder="Search..."
        style={{
          padding: "1rem",
          border: "1px solid #ccc",
          borderRadius: "0.25rem",
          width: "100%",
          maxWidth: "400px",
        }}
      />
      <div
        ref={listContainerRef}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          maxWidth: "400px",
          width: "100%",
          maxHeight: "600px",
          overflowY: "auto",
          paddingBottom: "30px",
        }}
      >
        {(search ? filteredData : launches).map((launch) => (
          <LaunchCard key={launch._id} {...launch} />
        ))}

        {isLoading && <Spinner />}

        {!isLoading && !data.length ? (
          <div className="no-content">No more data</div>
        ) : (
          <div ref={observerRef} style={{ height: "1px", width: "100%" }} />
        )}
      </div>
    </div>
  );
}

export default LaunchersView;
