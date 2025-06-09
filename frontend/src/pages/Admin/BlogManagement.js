import React, { useEffect, useState } from "react";
import blogApi from "../../api/blogApi"; // Đã sửa thành blogApi
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Modal } from "react-bootstrap";

export default function BlogManagement() {
  const [blogs, setBlogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const [newBlog, setNewBlog] = useState({
    title: "",
    description: "",
  });

  const [editBlog, setEditBlog] = useState({
    title: "",
    description: "",
  });

  const fetchBlogs = async () => {
    try {
      const res = await blogApi.getAll();
      setBlogs(res.data);
    } catch (error) {
      console.log("Failed to fetch blogs: ", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa blog này không?")) return;
    try {
      await blogApi.deleteBlogById(id);
      alert("Blog deleted successfully!");
      fetchBlogs();
    } catch (error) {
      console.log("Failed to delete blog: ", error);
    }
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewBlog((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditBlog((prev) => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (value) => {
    setNewBlog((prev) => ({ ...prev, description: value }));
  };

  const handleEditDescriptionChange = (value) => {
    setEditBlog((prev) => ({ ...prev, description: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await blogApi.addNewBlog(newBlog);
      alert("Blog created successfully!");
      setShowForm(false);
      setNewBlog({ title: "", description: "" });
      fetchBlogs();
    } catch (error) {
      console.error("Failed to create blog: ", error);
      alert("Failed to create blog. Please try again!");
    }
  };

  const handleShowEditModal = (blog) => {
    setEditBlog(blog);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await blogApi.updateBlogById(editBlog._id, editBlog);
      alert("Blog updated successfully!");
      setShowEditModal(false);
      fetchBlogs();
    } catch (error) {
      console.log("Failed to update blog: ", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div id="layoutSidenav_content">
      <main>
        <div className="container-fluid px-4">
          <h1 className="mt-4">Blogs</h1>
          <button
            className="btn btn-outline-dark mb-3"
            style={{ borderRadius: "0px" }}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Close Form" : "Add Blog"}
          </button>

          {/* Form Add Blog */}
          {showForm && (
            <div className="card mb-4">
              <div className="card-header">Create New Blog</div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={newBlog.title}
                      onChange={handleAddChange}
                      required
                    />
                  </div>
                  <ReactQuill
                    value={newBlog.description}
                    onChange={handleDescriptionChange}
                    modules={{
                      toolbar: [
                        [{ header: [1, 2, 3, 4, false] }],
                        ["bold", "italic", "underline", "strike"],
                        [{ list: "ordered" }, { list: "bullet" }],
                        [{ script: "sub" }, { script: "super" }],
                        [{ indent: "-1" }, { indent: "+1" }],
                        [{ direction: "rtl" }],
                        [{ color: [] }, { background: [] }],
                        [{ font: [] }],
                        [{ align: [] }],
                        ["link", "image", "video"],
                        ["clean"],
                      ],
                    }}
                  />
                  <button type="submit" className="btn btn-success mt-3">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* List Blogs */}
          <div className="card mb-4">
            <div className="card-header">
              <i className="fas fa-table me-1"></i> List of blogs
            </div>
            <div className="card-body">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map((blog) => (
                    <tr key={blog._id}>
                      <td>{blog.title}</td>
                      <td>
                        <ReactQuill
                          value={blog.description}
                          readOnly={true}
                          theme="bubble"
                        />
                      </td>
                      <td>
                        <button
                          style={{ borderRadius: "0px" }}
                          className="btn btn-primary text-white mb-2"
                          onClick={() => handleShowEditModal(blog)}
                        >
                          Edit
                        </button>
                        <button
                          style={{ borderRadius: "0px" }}
                          onClick={() => handleDelete(blog._id)}
                          className="btn btn-danger text-white"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal Edit Blog */}
          <Modal
            show={showEditModal}
            onHide={() => setShowEditModal(false)}
            size="lg"
          >
            <Modal.Header closeButton>
              <Modal.Title>Edit Blog</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {editBlog && (
                <form onSubmit={handleEditSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={editBlog.title}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  <ReactQuill
                    value={editBlog.description}
                    onChange={handleEditDescriptionChange}
                    modules={{
                      toolbar: [
                        [{ header: [1, 2, 3, 4, false] }],
                        ["bold", "italic", "underline", "strike"],
                        [{ list: "ordered" }, { list: "bullet" }],
                        [{ script: "sub" }, { script: "super" }],
                        [{ indent: "-1" }, { indent: "+1" }],
                        [{ direction: "rtl" }],
                        [{ color: [] }, { background: [] }],
                        [{ font: [] }],
                        [{ align: [] }],
                        ["link", "image", "video"],
                        ["clean"],
                      ],
                    }}
                  />
                  <button type="submit" className="btn btn-success mt-3">
                    Save Changes
                  </button>
                </form>
              )}
            </Modal.Body>
          </Modal>
        </div>
      </main>
    </div>
  );
}
