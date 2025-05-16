import React, { useEffect, useState } from "react";
import "./Home.css";

import movieApi from "../../api/MovieApi.js";
import eventApi from "../../api/eventApi";

import { Link } from "react-router-dom"; // Import Link

const Home = () => {
  const [listMovies, setListMovies] = useState([]);
  const [listEvents, setListEvents] = useState([]);

  useEffect(() => {
    const listImages = document.querySelector(".list-images");
    const imgs = document.querySelectorAll(".list-images img");
    const btnLeft = document.querySelector(".btn-left");
    const btnRight = document.querySelector(".btn-right");
    let current = 0;

    const handleChangeSlide = () => {
      if (current === imgs.length - 1) {
        current = 0;
        listImages.style.transform = `translateX(0px)`;
      } else {
        current++;
        let width = imgs[0].offsetWidth;
        listImages.style.transform = `translateX(-${width * current}px)`;
      }
    };

    if (!listImages || imgs.length === 0 || !btnRight || !btnLeft) return;

    const interval = setInterval(() => {
      handleChangeSlide();
    }, 4000);

    btnRight.addEventListener("click", () => {
      handleChangeSlide();
    });

    btnLeft.addEventListener("click", () => {
      if (current === 0) {
        current = imgs.length - 1;
        let width = imgs[0].offsetWidth;
        listImages.style.transform = `translateX(-${width * current}px)`;
      } else {
        current--;
        let width = imgs[0].offsetWidth;
        listImages.style.transform = `translateX(-${width * current}px)`; // dịch bn px so với vị trí ban đầuđầu
      }
    });

    const getData = async () => {
      const movies = await movieApi.get5NewMovies();
      const events = await eventApi.getAll();
      setListMovies(movies);
      setListEvents(events.data);
    };

    getData();

    return () => {
      clearInterval(interval); // Cleanup khi component unmount
      btnRight.removeEventListener("click", handleChangeSlide);
      btnLeft.removeEventListener("click", handleChangeSlide);
    };
  }, []); // Chạy 1 lần khi component mount

  return (
    <div className="home">
      <div className="slide-show ">
        <div className="list-images">
          <img
            src="https://files.betacorp.vn/media/images/2025/02/14/ngt-payoff-poster-1702x621-sneak-155826-140225-38.jpg"
            alt="poster2"
          />
          <img
            src="https://files.betacorp.vn/media/images/2025/02/14/1702x621-29-130857-140225-28.jpg"
            alt="poster2"
          />
        </div>
        <div className="btns">
          <div className="btn-left">
            <h1>&lt;</h1>
          </div>
          <div className="btn-right">
            <h1>&gt;</h1>
          </div>
        </div>
      </div>

      <h1 className="mt-5 mb-2">New Movies</h1>
      <div className="list-film ">
        {listMovies.map((movie) => (
          <div className="film-poster" key={movie._id}>
            <img className="film" src={movie.posterUrl} alt={movie.title} />
            <div className="overlay">
              <Link to={`/showtime/${movie._id}`} className="btn-detail">
                Đặt vé
              </Link>
              <Link to={`/detail/${movie._id}`} className="btn-detail">
                Xem chi tiết
              </Link>
            </div>
          </div>
        ))}
      </div>

      <h1 className="m-2">Events</h1>
      <div className="list-event container mb-5">
        {listEvents.map((event) => (
          <div className="event" onClick={() => window.location.href = `/promotion/${event._id}`}>
            <img src={event.homePageUrl} />
          </div>
        ))}
      </div>
      <div className="list-event row container mb-5">
        <img src="https://media.lottecinemavn.com/Media/WebAdmin/6f7ba9d65ac3466fb562d7a1d8d873a5.jpg" />
      </div>
    </div>
  );
};

export default Home;
