import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box, CssBaseline, Toolbar, styled } from "@mui/material";
import HeaderAdmin from "./HeaderAdmin";
import SidebarAdmin from "../SideBarAdmin/SideBarAdmin";

const MainContent = styled(Box)(({ theme, sidebaropen }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginLeft: sidebaropen ? "240px" : "0px",
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  width: `calc(100% - ${sidebaropen ? 240 : 0}px)`,
  minHeight: "100vh",
  backgroundColor: "#f5f7fa",
}));

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <HeaderAdmin toggleSidebar={toggleSidebar} />
      <SidebarAdmin open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <MainContent component="main" sidebaropen={sidebarOpen ? 1 : 0}>
        <Toolbar />
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: 2,
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            p: 3,
          }}
        >
          <Outlet />
        </Box>
      </MainContent>
    </Box>
  );
};

export default AdminLayout;
