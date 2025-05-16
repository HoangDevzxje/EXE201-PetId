import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Container, Row, Col, Form } from "react-bootstrap";
import movieApi from "../../api/MovieApi"; // Import movieApi
import "bootstrap/dist/css/bootstrap.min.css";
import "./MovieDetail.css";
import { Link } from "react-router-dom";

const MovieDetail = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showTrailer, setShowTrailer] = useState(false);
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchMovieDetail = async () => {
      const data = await movieApi.getMovieDetail(movieId); // Sử dụng movieApi.getMovieDetail
      if (data) {
        setMovie(data);
        const reviewsData = await movieApi.getReview(movieId); // Sử dụng movieApi.getReview
        setReviews(reviewsData);
      }
    };
    fetchMovieDetail();
  }, [movieId]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push("★");
      } else {
        stars.push("☆");
      }
    }
    return stars.join("");
  };

  const StarRatingInput = ({ rating, setRating }) => {
    const [hoverRating, setHoverRating] = useState(0);

    return (
      <div>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            style={{
              cursor: "pointer",
              color: star <= (hoverRating || rating) ? "gray" : "gray",
              fontSize: "24px",
            }}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
          >
            {star <= (hoverRating || rating) ? "★" : "☆"}
          </span>
        ))}
      </div>
    );
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      alert("Vui lòng nhập bình luận trước khi gửi đánh giá.");
      return;
    }

    try {
      const reviewData = { rating, comment, movie: movieId };
      const newReview = await movieApi.addReview(reviewData); // Sử dụng movieApi.addReview
      console.log(newReview);
      if (newReview) {
        setReviews((prevReviews) => [...prevReviews, newReview]);
        setRating(1);
        setComment("");
      }
    } catch (error) {
      console.error("Error submitting review", error);
    }
  };

  if (!movie) return;

  const getTrailerUrlWithAutoplay = (url) => {
    const urlObj = new URL(url);
    urlObj.searchParams.set("autoplay", "1");
    return urlObj.toString();
  };

  return (
    <Container fluid className="p-0">
      {/* Phần 1: Trailer */}
      <div className="bg-dark text-white py-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} className="text-center">
              {!showTrailer && (
                <div
                  style={{ position: "relative", cursor: "pointer" }}
                  onClick={() => setShowTrailer(true)}
                >
                  <img
                    src={movie.imageUrl}
                    alt={movie.title}
                    className="img-fluid rounded shadow"
                    style={{ maxHeight: "500px", width: "100%" }}
                  />
                  <div className="play-button-overlay">
                    <div className="play-button">
                      <i className="bi bi-play play-icon"></i>
                    </div>
                  </div>
                </div>
              )}

              {showTrailer && (
                <div className="ratio ratio-16x9">
                  <iframe
                    src={getTrailerUrlWithAutoplay(movie.trailerUrl)}
                    title="trailer"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                    className="rounded shadow"
                  ></iframe>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </div>

      {/* Phần 2: Thông tin phim */}
      <Container className="my-5">
        <Row>
          <Col md={4} className="text-center">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="img-fluid rounded shadow"
              style={{ maxHeight: "500px" }}
            />
          </Col>
          <Col md={8}>
            <h2 className="fw-bold mb-4">{movie.title}</h2>
            <p>
              <strong>Đạo diễn:</strong> {movie.director?.join(", ")}
            </p>
            <p>
              <strong>Diễn viên:</strong> {movie.casts?.join(", ")}
            </p>
            <p>
              <strong>Thể loại:</strong> {movie.genre?.join(", ")}
            </p>
            <p>
              <strong>Khởi chiếu:</strong>{" "}
              {new Date(movie.releaseDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Thời lượng:</strong> {movie.duration} phút
            </p>
            <p>
              <strong>Ngôn ngữ:</strong> {movie.language}
            </p>
            <p>
              <strong>Rated:</strong> Phim dành cho khán giả{" "}
              {movie.rating === "P"
                ? "mọi lứa tuổi"
                : `từ ${movie.rating.replace("C", "")} tuổi trở lên`}
            </p>
            <p>
              <strong>Nội dung:</strong> {movie.description}
            </p>
            <Link
              to={`/showtime/${movie._id}`}
              className="btn btn-primary fw-bold px-4 py-2 rounded shadow-lg text-white text-decoration-none"
            >
              Đặt vé
            </Link>
          </Col>
        </Row>
      </Container>

      {/* Phần 3: Đánh giá */}
      <Container className="my-5">
        <h3 className="fw-bold mb-4">Xếp hạng và đánh giá phim</h3>

        {/* Form thêm đánh giá */}
        <Form
          onSubmit={handleSubmitReview}
          className="border p-2 rounded shadow-sm"
        >
          <Row className="align-items-center">
            <Col md={2} className="border-end text-center p-2">
              <h6 className="fw-bold mb-2" style={{ fontSize: "14px" }}>
                Xếp hạng
              </h6>
              <StarRatingInput rating={rating} setRating={setRating} />
              <div className="mt-1 text-muted" style={{ fontSize: "12px" }}>
                {rating} sao
              </div>
            </Col>
            <Col md={8} className="p-2">
              <Form.Group className="mb-0">
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  placeholder="Vui lòng viết đánh giá phim..."
                  style={{ resize: "none", fontSize: "16px" }}
                  className="border-0 shadow-none"
                />
              </Form.Group>
            </Col>
            <Col
              md={2}
              className="p-3 text-center bg-dark text-light d-flex align-items-center justify-content-center"
            >
              <Button
                type="submit"
                variant="link"
                className="text-light fw-bold w-100 h-100"
              >
                Bình luận
              </Button>
            </Col>
          </Row>
        </Form>

        {/* Hiển thị danh sách đánh giá */}
        <div className="mt-5">
          {reviews?.map((review, index) =>
            review ? (
              <Row className="mb-5 border-bottom" key={index}>
                <Col md={9}>
                  <div>
                    <strong className="mb-2 text-muted">
                      Khách: {renderStars(review?.rating || 0)}{" "}
                    </strong>
                    <br />
                    <strong>{review.comment}</strong>
                    <div className="text-muted">
                      <small>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center"></div>
                </Col>
              </Row>
            ) : null
          )}
        </div>
      </Container>
    </Container>
  );
};

export default MovieDetail;
