import React, { useState } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { BRAND } from "@/shared/constants";
import { useAuth } from "@/contexts/AuthContext";
import {
	LayoutDashboard,
	FileText,
	Image,
	FolderOpen,
	Menu,
	X,
	ExternalLink,
	LogOut,
} from "lucide-react";

const AdminLayout: React.FC = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const location = useLocation();
	const { signOut } = useAuth();
	const navigate = useNavigate();

	const handleLogout = async () => {
		await signOut();
		navigate("/admin/login");
	};

	const navItems = [
		{ href: "/admin", label: "Dashboard", icon: LayoutDashboard },
		{ href: "/admin/posts", label: "Posts", icon: FileText },
		{ href: "/admin/media", label: "Media Library", icon: Image },
		{ href: "/admin/categories", label: "Categories", icon: FolderOpen },
	];

	const isActive = (href: string) => {
		if (href === "/admin") {
			return location.pathname === "/admin";
		}
		return location.pathname.startsWith(href);
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Mobile Header */}
			<div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
				<Link to="/admin" className="flex items-center gap-2">
					<img src="/logo.png" alt="Logo" className="h-10 w-auto" />

					<span className="font-semibold text-[#1A1A2E]">Admin</span>
				</Link>
				<button
					onClick={() => setSidebarOpen(!sidebarOpen)}
					className="p-2 text-gray-500 hover:text-gray-700"
				>
					{sidebarOpen ? (
						<X className="w-6 h-6" />
					) : (
						<Menu className="w-6 h-6" />
					)}
				</button>
			</div>

			<div className="flex">
				{/* Sidebar */}
				<aside
					className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out ${
						sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
					}`}
				>
					<div className="h-full flex flex-col">
						{/* Logo */}
						<div className="hidden lg:flex items-center gap-3 px-6 py-5 border-b border-gray-100">
							<img src="/logo.png" alt="Logo" className="h-10 w-auto" />

							<div>
								<h1 className="font-bold text-[#1A1A2E]">{BRAND.name}</h1>
								<p className="text-xs text-gray-500">Admin Panel</p>
							</div>
						</div>

						{/* Navigation */}
						<nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
							{navItems.map((item) => {
								const Icon = item.icon;
								return (
									<Link
										key={item.href}
										to={item.href}
										onClick={() => setSidebarOpen(false)}
										className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
											isActive(item.href)
												? "bg-[#FF6B35] text-white"
												: "text-gray-600 hover:bg-gray-100"
										}`}
									>
										<Icon className="w-5 h-5" />
										{item.label}
									</Link>
								);
							})}
						</nav>

						{/* Footer Actions */}
						<div className="px-4 py-4 border-t border-gray-100 space-y-2">
							<a
								href="/"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
							>
								<ExternalLink className="w-5 h-5" />
								View Blog
							</a>
							<a
								href={BRAND.mainWebsite}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
							>
								<ExternalLink className="w-5 h-5" />
								Main Website
							</a>
							<button
								onClick={handleLogout}
								className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
							>
								<LogOut className="w-5 h-5" />
								Logout
							</button>
						</div>
					</div>
				</aside>

				{/* Overlay */}
				{sidebarOpen && (
					<div
						className="fixed inset-0 bg-black/50 z-30 lg:hidden"
						onClick={() => setSidebarOpen(false)}
					/>
				)}

				{/* Main Content */}
				<main className="flex-1 min-h-screen lg:min-h-[calc(100vh)]">
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export default AdminLayout;
