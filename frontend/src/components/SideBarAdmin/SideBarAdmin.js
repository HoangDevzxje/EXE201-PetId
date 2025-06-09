import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  Toolbar,
  Box,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Pets as PetsIcon,
  Notifications as RemindersIcon,
  ShoppingCart as ProductsIcon,
  Category as CategoriesIcon,
  People as UsersIcon,
  Receipt as OrdersIcon,
  Chat as ChatbotIcon,
  EventNote as AppointmentIcon,
  Article as BlogIcon,
} from "@mui/icons-material";

const StyledListItem = styled(ListItem)(({ theme }) => ({
  "& .MuiListItemButton-root": {
    borderRadius: theme.shape.borderRadius,
    margin: theme.spacing(0.5, 1),
    padding: theme.spacing(1, 2),
  },
  "& .MuiListItemButton-root.Mui-selected": {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
    },
    "& .MuiListItemIcon-root": {
      color: theme.palette.primary.main,
    },
  },
}));

const menuItems = [
  { label: "Người dùng", path: "/admin/users", icon: <UsersIcon /> },
  {
    label: "Quản lý sản phẩm",
    path: "/admin/products",
    icon: <ProductsIcon />,
  },
  { label: "Danh mục", path: "/admin/categories", icon: <CategoriesIcon /> },
  { label: "Đơn hàng", path: "/admin/orders", icon: <OrdersIcon /> },
  { label: "Phòng khám", path: "/admin/clinics", icon: <PetsIcon /> },
  {
    label: "Đơn hàng phòng khám",
    path: "/admin/appointments",
    icon: <AppointmentIcon />, // đổi icon
  },
  {
    label: "Blog",
    path: "/admin/blogs",
    icon: <BlogIcon />, // đổi icon
  },
];

const SidebarAdmin = ({ open, onClose }) => {
  const location = useLocation();

  return (
    <Drawer
      variant="persistent"
      open={open}
      sx={{
        width: open ? 240 : 0,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          backgroundColor: "#ffffff",
          borderRight: "1px solid rgba(0, 0, 0, 0.12)",
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <List>
          {menuItems.map((item) => (
            <StyledListItem key={item.path} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                selected={
                  location.pathname === item.path ||
                  (item.path !== "/admin" &&
                    location.pathname.startsWith(item.path))
                }
                onClick={onClose}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontWeight: "medium" }}
                />
              </ListItemButton>
            </StyledListItem>
          ))}
        </List>
        <Divider sx={{ my: 1 }} />
      </Box>
    </Drawer>
  );
};

export default SidebarAdmin;
