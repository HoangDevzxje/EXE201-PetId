import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/baseApi";
import { Container } from "react-bootstrap";

const BlogDetail = () => {
  const { blogId } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await api.get(`/blogs/${blogId}`);
        setBlog(res.data);
      } catch (err) {
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [blogId]);

  if (loading) return <div className="text-center py-4">Đang tải...</div>;
  if (!blog)
    return <div className="text-center py-4">Không tìm thấy bài viết.</div>;

  return (
    <Container className="my-5">
      <Link to="/" className="btn btn-secondary mb-3">
        &larr; Quay lại trang chủ
      </Link>
      <div className="blog-detail-card shadow-sm rounded p-4">
        {blog.image && (
          <img
            src={blog.image}
            alt={blog.title}
            className="mb-4"
            style={{
              width: "100%",
              maxHeight: "350px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        )}
        <h2 className="mb-3">{blog.title}</h2>
        {blog.summary && <p className="text-muted">{blog.summary}</p>}
        <div className="blog-detail-content" style={{ whiteSpace: "pre-line" }}>
          {blog.description}
        </div>
      </div>
    </Container>
  );
};

export default BlogDetail;
