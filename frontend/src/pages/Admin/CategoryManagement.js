import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CategoryManagement.css";

function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editing, setEditing] = useState(null);
  const [editedName, setEditedName] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:9999/admin/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const handleAdd = async () => {
    if (!newCategory.trim()) return;
    try {
      const res = await axios.post("http://localhost:9999/admin/categories", {
        name: newCategory.trim(),
      });
      setCategories([...categories, res.data]);
      setNewCategory("");
    } catch (err) {
      console.error("Failed to add category:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá danh mục này?")) return;
    try {
      await axios.delete(`http://localhost:9999/admin/categories/${id}`);
      setCategories(categories.filter((cat) => cat._id !== id));
    } catch (err) {
      console.error("Failed to delete category:", err);
    }
  };

  const handleUpdate = async (id) => {
    if (!editedName.trim()) return;
    try {
      const res = await axios.put(
        `http://localhost:9999/admin/categories/${id}`,
        { name: editedName.trim() }
      );
      setCategories(categories.map((cat) => (cat._id === id ? res.data : cat)));
      setEditing(null);
    } catch (err) {
      console.error("Failed to update category:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="category-container">
      <h2 className="category-title">Quản lý danh mục</h2>

      <div className="add-category">
        <input
          type="text"
          placeholder="Tên danh mục mới"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button onClick={handleAdd}>Thêm</button>
      </div>

      <div className="category-list">
        {categories.map((cat, index) => (
          <div key={cat._id} className="category-item">
            {editing === cat._id ? (
              <>
                <span className="category-stt">{index + 1}.</span>
                <input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                />
                <div className="btn-group">
                  <button
                    className="save"
                    onClick={() => handleUpdate(cat._id)}
                  >
                    Lưu
                  </button>
                  <button className="cancel" onClick={() => setEditing(null)}>
                    Huỷ
                  </button>
                </div>
              </>
            ) : (
              <>
                <span className="category-stt">{index + 1}.</span>
                <span className="category-name">{cat.name}</span>
                <div className="btn-group">
                  <button
                    className="edit"
                    onClick={() => {
                      setEditing(cat._id);
                      setEditedName(cat.name);
                    }}
                  >
                    Sửa
                  </button>
                  <button
                    className="delete"
                    onClick={() => handleDelete(cat._id)}
                  >
                    Xoá
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryManagement;
