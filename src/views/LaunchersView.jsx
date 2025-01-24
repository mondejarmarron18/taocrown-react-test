import React, { useEffect, useState, useRef, useMemo } from "react";
import useFetchLaunches from "../hooks/useFetchLaunches";
import LaunchCard from "../components/LaunchCard";
import _ from "lodash";
import Spinner from "../components/Spinner";
import "./launcher-view.scss";
import { Swiper, SwiperSlide } from "swiper/react";

function LaunchersView() {
  const { data, isLoading, exec } = useFetchLaunches();
  const [launches, setLaunches] = useState([]);
  const [filter, setFilter] = useState({ offset: 0, limit: 3 });
  const observerRef = useRef(null);
  const listContainerRef = useRef(null);
  const [search, setSearch] = useState("");
  const [activeCardIndex, setActiveCardIndex] = useState(1);

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
    <div className="launcher-view">
      <div className="launcher-view__header">
        <h1>Space X Launches</h1>
        <input
          type="text"
          onChange={handleSearch}
          placeholder="Search..."
          className="launcher-view__search"
        />
      </div>
      <div ref={listContainerRef} className="launcher-list">
        <Swiper
          spaceBetween={10}
          slidesPerView={3}
          onSlideChange={(e) => setActiveCardIndex(e.activeIndex + 1)}
          initialSlide={1}
          centeredSlides={filteredData.length < 2}
          className="launcher-list__swiper"
        >
          {(search ? filteredData : launches).map((launch, index) => (
            <SwiperSlide key={launch._id}>
              <LaunchCard
                key={launch._id}
                {...launch}
                className={
                  (index === activeCardIndex || filteredData.length < 2) &&
                  "launch-card--active"
                }
              />
            </SwiperSlide>
          ))}

          {isLoading && (
            <SwiperSlide>
              <div className="launch-card">
                <Spinner />
              </div>
            </SwiperSlide>
          )}

          {!isLoading && !data.length ? (
            <SwiperSlide>
              <div className="launch-card launch-card--no-data">
                No more data
              </div>
            </SwiperSlide>
          ) : (
            !search && (
              <SwiperSlide>
                <div
                  ref={observerRef}
                  className="launch-card launch-card--no-data"
                />
              </SwiperSlide>
            )
          )}
        </Swiper>
      </div>
    </div>
  );
}

export default LaunchersView;
