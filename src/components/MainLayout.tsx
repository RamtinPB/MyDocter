import React, { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import MyHeader from "./MyHeader";

interface MainLayoutProps {
	children?: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = () => {
	return (
		<div>
			<MyHeader />
			<main>
				<Outlet /> {/* This renders the nested routes */}
			</main>
		</div>
	);
};

export default MainLayout;
