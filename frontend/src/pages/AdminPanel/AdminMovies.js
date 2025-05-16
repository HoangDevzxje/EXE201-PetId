import React, { useEffect, useState } from "react";
import axios from "axios";
import moviesApi from "../../api/MovieApi";
import "./AdminMovies.css"; 
import {Table ,Modal, Form, Button, Row, Col } from "react-bootstrap";
import movieApi from "../../api/MovieApi";
import { Link } from "react-router-dom"; // Import Link

const AdminMovies = () => {
  const [movies, setMovies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    genre: "",
    language: "",
    subtitles: "",
    director: "",
    casts: "",
    duration: "",
    posterUrl: "",
    imageUrl: "",
    trailerUrl: "",
    releaseDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await moviesApi.getAdminMovies();
      setMovies(response);
    } catch (error) {
      console.error("Error fetching movies", error);
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this movie?");
    if (!isConfirmed) return;
  
    try {
      await moviesApi.deleteMovie(id);
      fetchMovies();
    } catch (error) {
      console.error("Error deleting movie", error);
    }
  };
  const handleSave = async () => {
    try {
      if (editingMovie) {
        await movieApi.updateMovie(editingMovie._id, formData);
      } else {
        await movieApi.addNewMovie(formData);
      }
      fetchMovies();
      setShowModal(false);
      setEditingMovie(null);
    } catch (error) {
      console.error("Error saving movie", error);
    }
  };

  const handleEdit = (movie) => {
    setEditingMovie(movie);
    setFormData(movie);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingMovie(null);
    setFormData({
      title: "",
      description: "",
      genre: "",
      language: "",
      subtitles: "",
      director: "",
      casts: "",
      duration: "",
      posterUrl: "",
      imageUrl: "",
      trailerUrl: "",
      releaseDate: "",
      endDate: "",
    });
    setShowModal(true);
  };

  return (
    <div className="container mt-5">
      <h2>Movie Management</h2>
      <Button onClick={handleAdd} className="mb-3">Add Movie</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Poster </th>
            <th>Tên phim</th>
            <th>Thể loại</th>
            <th>Ngôn ngữ</th>
            <th>Thời lượng phim</th>
            <th>Thời gian khởi chiếu</th>
            <th>Action </th>
          </tr>
        </thead>
        <tbody>
          {movies?.map((movie) => (
            <tr key={movie._id}>
              <td><img src={movie.posterUrl} style={{ width: "100px", height: "150px" }}/></td>
              <td>{movie.title} </td>
              <td>{movie.genre[0]} {movie.genre[1]}</td>
              <td>{movie.language} </td>
              <td>{movie.duration} </td>
              <td>{new Date(movie.releaseDate).toLocaleDateString()}</td>

              <td>
                <Link to={`/admin/detail/${movie._id}`} className="btn" style={{background: 'blue', color: 'white', marginRight: '5px'}}>
                  Detail
                </Link>
                <Button variant="warning" onClick={() => handleEdit(movie)}>Edit</Button>
                <Button variant="danger" onClick={() => handleDelete(movie._id)} className="ms-2">Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
      <Modal.Header closeButton className="modal-header-custom">
        <Modal.Title>{editingMovie ? "Edit Movie" : "Add Movie"}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body-custom">
        <Form>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Enter movie title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-custom"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Genre</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Action, Comedy..."
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  className="input-custom"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Language</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Enter language"
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="input-custom"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Subtitles</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Subtitles (if any)"
                  value={formData.subtitles}
                  onChange={(e) => setFormData({ ...formData, subtitles: e.target.value })}
                  className="input-custom"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={3} 
              placeholder="Enter movie description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-custom"
            />
          </Form.Group>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Director</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Director's name"
                  value={formData.director}
                  onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                  className="input-custom"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Casts</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Cast names (comma-separated)"
                  value={formData.casts}
                  onChange={(e) => setFormData({ ...formData, casts: e.target.value })}
                  className="input-custom"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Duration (mins)</Form.Label>
                <Form.Control 
                  type="number" 
                  placeholder="Enter duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="input-custom"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Release Date</Form.Label>
                <Form.Control 
                  type="date" 
                  value={formData.releaseDate ? formData.releaseDate.split("T")[0] : ""}
                  onChange={(e) => {
                    console.log("New Date:", e.target.value); 
                    setFormData({ ...formData, releaseDate: e.target.value });
                  }}
                  className="input-custom"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>End Date</Form.Label>
                <Form.Control 
                  type="date" 
                  value={formData.endDate ? formData.endDate.split("T")[0] : ""}
                  onChange={(e) => {
                    console.log("New Date:", e.target.value); 
                    setFormData({ ...formData, endDate: e.target.value });
                  }}
                  className="input-custom"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Poster URL</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Enter poster URL"
                  value={formData.posterUrl}
                  onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
                  className="input-custom"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Trailer URL</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Enter trailer URL"
                  value={formData.trailerUrl}
                  onChange={(e) => setFormData({ ...formData, trailerUrl: e.target.value })}
                  className="input-custom"
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)} className="btn-custom">
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave} className="btn-custom btn-save">
          {editingMovie ? "Update" : "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
    </div>
  );
};

export default AdminMovies;
