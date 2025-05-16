import React, { useEffect, useState } from "react";
import "./Movies.css";
import api from "../../api/MovieApi.js";
import { Link } from "react-router-dom"; // Import Link

const Movies = () => {
  const [listMovies, setListMovies] = useState([]);
  const [movieType, setMovieType] = useState("now-playing"); // Trạng thái mặc định là "Phim Đang Chiếu"

  useEffect(() => {
    const listImages = document.querySelector(".list-images");
    const imgs = document.querySelectorAll(".list-images img");
    const btnLeft = document.querySelector(".btn-left");
    const btnRight = document.querySelector(".btn-right");
    let current = 0;
    
    const handleChangeSlide = () => { 
      if (current === imgs.length - 1) {
        current = 0
        listImages.style.transform = `translateX(0px)`;
      }else{
        current++;
        let width = imgs[0].offsetWidth;
        listImages.style.transform = `translateX(-${width * current}px)`;
      }
    };

    if (!listImages || imgs.length === 0 || !btnRight || !btnLeft) return;

    const interval = setInterval(() => {
     handleChangeSlide();
    }, 4000);

    btnRight.addEventListener('click',() => {
      handleChangeSlide();
    })

    btnLeft.addEventListener('click',() => {
      if (current === 0) {
        current = imgs.length - 1
        let width = imgs[0].offsetWidth;
        listImages.style.transform = `translateX(-${width * current}px)`;

      }else{
        current--;
        let width = imgs[0].offsetWidth;
        listImages.style.transform = `translateX(-${width * current}px)`;// dịch bn px so với vị trí ban đầuđầu
      }
    })  
    const getData = async () => {
      const movies = movieType === "now-playing" ? await api.getNowPlayingMovies() : await api.get5NewMovies();
      setListMovies(movies);
    };

    getData();
  }, [movieType]); // Khi movieType thay đổi, gọi API tương ứng

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
      {/* Nút chọn loại phim */}
      <div className="movie-buttons">
        <button className={movieType === "now-playing" ? "active" : ""} onClick={() => setMovieType("now-playing")}>
          Phim Đang Chiếu
        </button>
        <button className={movieType === "coming-soon" ? "active" : ""} onClick={() => setMovieType("coming-soon")}>
          Phim Sắp Chiếu
        </button>
      </div>

      <h1 className="mt-5 mb-2">{movieType === "now-playing" ? "Phim Đang Chiếu" : "Phim Sắp Chiếu"}</h1>

      <div className="list-film">
        {listMovies.map((movie) => (
          <div className="film-poster" key={movie.id}>
            <img className="film" src={movie.posterUrl} alt={movie.title} />
            <div className="overlay">
              <button className="btn-ticket">Đặt vé</button>
              <Link to={`/detail/${movie._id}`} className="btn-detail">
                Xem chi tiết
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Movies;
