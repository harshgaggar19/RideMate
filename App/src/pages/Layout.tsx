// import React from "react";
import {  Outlet, } from "react-router-dom";
// import Navbar from "./Navbar";
// import Footer from "./Footer";
// import "./css/Layout.css";
import Navbar from "@/components/Navbar";

const Layout = () => {
	// const navigate = useNavigate();
	// navigate("/home");
	return (
		<div className="layout">
			<Navbar/>
			<main className="container">
				<Outlet />
			</main>
		</div>
	);
};

export default Layout;
