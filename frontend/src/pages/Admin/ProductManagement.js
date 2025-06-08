import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Switch,
  CircularProgress,
  Snackbar,
  Alert,
  Tooltip,
  Grid,
  InputAdornment,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import axios from "axios";
import { useFormik } from "formik";
import * as yup from "yup";
import api from "../../api/baseApi";

// Schema validation cho form sản phẩm
const productSchema = yup.object({
  name: yup.string().required("Tên sản phẩm là bắt buộc"),
  description: yup.string(),
  price: yup
    .number()
    .required("Giá là bắt buộc")
    .positive("Giá phải là số dương"),
  stock: yup
    .number()
    .integer("Số lượng phải là số nguyên")
    .min(0, "Số lượng không thể âm"),
  imageUrl: yup.string().url("Phải là URL hợp lệ"),
  isActive: yup.boolean(),
  isFeatured: yup.boolean(),
  category: yup.string().required("Danh mục là bắt buộc"),
  tags: yup.string(),
});

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // States cho tìm kiếm
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Lấy dữ liệu sản phẩm và danh mục
  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        api.get("/admin/products"),
        api.get("/categories"),
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Không thể tải dữ liệu");
      console.error("Lỗi khi tải dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Lọc sản phẩm dựa trên từ khóa tìm kiếm và danh mục
  useEffect(() => {
    let filtered = products;

    // Lọc theo từ khóa tìm kiếm
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          product.tags?.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Lọc theo danh mục
    if (selectedCategory) {
      filtered = filtered.filter(
        (product) =>
          (typeof product.category === "object"
            ? product.category._id
            : product.category) === selectedCategory
      );
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory]);

  // Thiết lập form với Formik
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      imageUrl: "",
      isActive: true,
      isFeatured: false,
      category: "",
      tags: "",
    },
    validationSchema: productSchema,
    onSubmit: async (values) => {
      try {
        const productData = {
          ...values,
          tags: values.tags
            ? values.tags.split(",").map((tag) => tag.trim())
            : [],
        };

        let response;
        if (currentProduct) {
          response = await api.put(
            `/admin/products/${currentProduct._id}`,
            productData
          );
          setProducts(
            products.map((p) =>
              p._id === currentProduct._id ? response.data : p
            )
          );
          setSnackbar({
            open: true,
            message: "Cập nhật sản phẩm thành công",
            severity: "success",
          });
        } else {
          response = await api.post(
            "/admin/products",
            productData
          );
          setProducts([...products, response.data]);
          setSnackbar({
            open: true,
            message: "Tạo sản phẩm thành công",
            severity: "success",
          });
        }
        handleCloseDialog();
      } catch (err) {
        setSnackbar({
          open: true,
          message: err.response?.data?.message || "Thao tác thất bại",
          severity: "error",
        });
      }
    },
  });

  // Xử lý dialog
  const handleOpenDialog = (product = null) => {
    setCurrentProduct(product);
    if (product) {
      formik.setValues({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        imageUrl: product.imageUrl,
        isActive: product.isActive,
        isFeatured: product.isFeatured,
        category: product.category._id || product.category,
        tags: product.tags?.join(", ") || "",
      });
    } else {
      formik.resetForm();
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setCurrentProduct(null);
    formik.resetForm();
  };

  // Xử lý xóa
  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(
        `/admin/products/${productToDelete._id}`
      );
      setProducts(products.filter((p) => p._id !== productToDelete._id));
      setSnackbar({
        open: true,
        message: "Xóa sản phẩm thành công",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Xóa sản phẩm thất bại",
        severity: "error",
      });
    }
    setDeleteConfirmOpen(false);
    setProductToDelete(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Xóa bộ lọc
  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý sản phẩm
      </Typography>

      {/* Phần tìm kiếm và lọc */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              placeholder="Tìm theo tên, mô tả hoặc tags"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              select
              fullWidth
              label="Lọc theo danh mục"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              variant="outlined"
              size="small"
            >
              <MenuItem value="">Tất cả danh mục</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={handleClearFilters}
              disabled={!searchQuery && !selectedCategory}
            >
              Xóa bộ lọc
            </Button>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="body2" color="text.secondary">
              Hiển thị {filteredProducts.length} trong {products.length} sản
              phẩm
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<RefreshIcon />}
          onClick={fetchData}
          disabled={loading}
        >
          Làm mới
        </Button>
        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Thêm sản phẩm
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width="60">STT</TableCell>
                <TableCell>Ảnh</TableCell>
                <TableCell>Tên sản phẩm</TableCell>
                <TableCell>Giá</TableCell>
                <TableCell>Số lượng</TableCell>
                <TableCell>Danh mục</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Nổi bật</TableCell>
                <TableCell width="150">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ py: 3 }}
                    >
                      {searchQuery || selectedCategory
                        ? "Không tìm thấy sản phẩm phù hợp với tiêu chí tìm kiếm"
                        : "Chưa có sản phẩm nào"}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product, index) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {index + 1}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {product.imageUrl && (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          style={{
                            width: 50,
                            height: 50,
                            objectFit: "cover",
                            borderRadius: 4,
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" fontWeight="medium">
                        {product.name}
                      </Typography>
                      {product.tags && product.tags.length > 0 && (
                        <Typography variant="caption" color="text.secondary">
                          Tags: {product.tags.join(", ")}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body1"
                        fontWeight="medium"
                        color="primary"
                      >
                        {product.price.toLocaleString("vi-VN")}đ
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body1"
                        color={product.stock <= 10 ? "error" : "text.primary"}
                      >
                        {product.stock}
                        {product.stock <= 10 && (
                          <Typography
                            variant="caption"
                            color="error"
                            display="block"
                          >
                            Sắp hết hàng
                          </Typography>
                        )}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {typeof product.category === "object"
                        ? product.category.name
                        : categories.find((c) => c._id === product.category)
                            ?.name || "N/A"}
                    </TableCell>
                    <TableCell>
                      <Switch checked={product.isActive} disabled />
                    </TableCell>
                    <TableCell>
                      <Switch checked={product.isFeatured} disabled />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        <Tooltip title="Chỉnh sửa">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(product)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteClick(product)}
                          >
                            <DeleteIcon color="error" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog thêm/sửa sản phẩm */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {currentProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                fullWidth
                label="Tên sản phẩm"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Mô tả"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
              />
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Giá"
                  name="price"
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  error={formik.touched.price && Boolean(formik.errors.price)}
                  helperText={formik.touched.price && formik.errors.price}
                />
                <TextField
                  fullWidth
                  type="number"
                  label="Số lượng"
                  name="stock"
                  value={formik.values.stock}
                  onChange={formik.handleChange}
                  error={formik.touched.stock && Boolean(formik.errors.stock)}
                  helperText={formik.touched.stock && formik.errors.stock}
                />
              </Box>
              <TextField
                fullWidth
                label="URL hình ảnh"
                name="imageUrl"
                value={formik.values.imageUrl}
                onChange={formik.handleChange}
                error={
                  formik.touched.imageUrl && Boolean(formik.errors.imageUrl)
                }
                helperText={formik.touched.imageUrl && formik.errors.imageUrl}
              />
              <TextField
                select
                fullWidth
                label="Danh mục"
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
                error={
                  formik.touched.category && Boolean(formik.errors.category)
                }
                helperText={formik.touched.category && formik.errors.category}
              >
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                label="Tags (ngăn cách bằng dấu phẩy)"
                name="tags"
                value={formik.values.tags}
                onChange={formik.handleChange}
                placeholder="ví dụ: điện tử, smartphone, di động"
              />
              <Box sx={{ display: "flex", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Switch
                    name="isActive"
                    checked={formik.values.isActive}
                    onChange={formik.handleChange}
                  />
                  <Typography>Kích hoạt</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Switch
                    name="isFeatured"
                    checked={formik.values.isFeatured}
                    onChange={formik.handleChange}
                  />
                  <Typography>Nổi bật</Typography>
                </Box>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Hủy</Button>
            <Button type="submit" variant="contained" color="primary">
              {currentProduct ? "Cập nhật" : "Tạo mới"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog xác nhận xóa */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa sản phẩm "{productToDelete?.name}" không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Hủy</Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Thông báo */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductManagement;
