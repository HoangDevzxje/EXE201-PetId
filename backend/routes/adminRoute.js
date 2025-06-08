const router = require("express").Router();
const adminController = require("../controllers/AdminController");
const AppointmentController = require('../controllers/AppointmentController');


// ----- User -----
router.get("/users", adminController.getAllUsers);
router.put("/users/:id/role", adminController.changeRoleUser);
router.put("/users/:id/status", adminController.changeStatusUser);

// ----- Product -----
router.get("/products", adminController.getAllProducts);
router.post("/products", adminController.addNewProduct);
router.put("/products/:id", adminController.updateProduct);
router.delete("/products/:id", adminController.deleteProduct);

// ----- Category -----
router.get("/categories", adminController.getAllCategories);
router.post("/categories", adminController.addNewCategory);
router.put("/categories/:id", adminController.updateCategory);
router.delete("/categories/:id", adminController.deleteCategory);

// ----- Order -----
router.get("/orders", adminController.getAllOrders);
router.put("/orders/:id", adminController.updateOrder);
router.delete("/orders/:id", adminController.deleteOrder);
router.put("/orders/:id/status", adminController.updateOrderStatus);

// ----- Clinic -----
router.get("/clinics", adminController.getAllClinics);
router.post("/clinics", adminController.addNewClinic);
router.put("/clinics/:id", adminController.updateClinic);
router.delete("/clinics/:id", adminController.deleteClinic);
// Toggle trạng thái hoạt động phòng khám
router.put("/clinics/:id/status", adminController.toggleClinicStatus);

router.get('/appointments', AppointmentController.getAllAppointments);
router.delete('/appointments/:id', AppointmentController.deleteAppointment);

module.exports = router;
