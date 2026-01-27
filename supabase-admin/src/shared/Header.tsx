import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BRAND } from "./constants";
import { Menu, X, Search } from "lucide-react";

interface HeaderProps {
	isAdmin?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isAdmin = false }) => {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [searchOpen, setSearchOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const location = useLocation();

	const navLinks = isAdmin
		? [
				{ href: "/admin", label: "Dashboard" },
				{ href: "/admin/posts", label: "Posts" },
				{ href: "/admin/media", label: "Media" },
				{ href: "/admin/categories", label: "Categories" },
			]
		: [
				{ href: "/", label: "Home" },
				{ href: "/category/waterworks", label: "Waterworks" },
				{ href: "/category/agriculture", label: "Agriculture" },
				{ href: "/category/real-estate", label: "Real Estate" },
				{ href: "/category/foundation", label: "Foundation" },
				{ href: "/category/news", label: "News" },
			];

	const isActive = (href: string) => {
		if (href === "/" || href === "/admin") {
			return location.pathname === href;
		}
		return location.pathname.startsWith(href);
	};

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			window.location.href = `/?search=${encodeURIComponent(searchQuery)}`;
		}
	};

	return (
		<header className="bg-white shadow-sm sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16 md:h-20">
					{/* Logo */}
					<Link
						to={isAdmin ? "/admin" : "/"}
						className="flex items-center gap-3"
					>
						<img src="/logo.png" alt="Logo" className="h-10 w-auto" />

						<div className="hidden sm:block">
							<h1 className="text-lg md:text-xl font-bold text-[#1A1A2E]">
								{BRAND.name}
							</h1>
							<p className="text-xs text-gray-500">
								{isAdmin ? "Admin Panel" : "Blog"}
							</p>
						</div>
					</Link>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center gap-1">
						{navLinks.map((link) => (
							<Link
								key={link.href}
								to={link.href}
								className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
									isActive(link.href)
										? "bg-[#FF6B35] text-white"
										: "text-gray-600 hover:text-[#FF6B35] hover:bg-orange-50"
								}`}
							>
								{link.label}
							</Link>
						))}
					</nav>

					{/* Right side actions */}
					<div className="flex items-center gap-2">
						{!isAdmin && (
							<>
								{searchOpen ? (
									<form
										onSubmit={handleSearch}
										className="hidden md:flex items-center"
									>
										<input
											type="text"
											value={searchQuery}
											onChange={(e) => setSearchQuery(e.target.value)}
											placeholder="Search posts..."
											className="w-48 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
											autoFocus
										/>
										<button
											type="button"
											onClick={() => setSearchOpen(false)}
											className="ml-2 p-2 text-gray-400 hover:text-gray-600"
										>
											<X className="w-5 h-5" />
										</button>
									</form>
								) : (
									<button
										onClick={() => setSearchOpen(true)}
										className="hidden md:flex p-2 text-gray-500 hover:text-[#FF6B35] transition-colors"
									>
										<Search className="w-5 h-5" />
									</button>
								)}
							</>
						)}

						{!isAdmin && (
							<Link
								to="/admin"
								className="hidden md:inline-flex px-4 py-2 text-sm font-medium text-[#FF6B35] border border-[#FF6B35] rounded-lg hover:bg-[#FF6B35] hover:text-white transition-colors"
							>
								Admin
							</Link>
						)}

						{isAdmin && (
							<Link
								to="/"
								className="hidden md:inline-flex px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
							>
								View Blog
							</Link>
						)}

						{/* Mobile menu button */}
						<button
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
							className="md:hidden p-2 text-gray-500 hover:text-[#FF6B35]"
						>
							{mobileMenuOpen ? (
								<X className="w-6 h-6" />
							) : (
								<Menu className="w-6 h-6" />
							)}
						</button>
					</div>
				</div>

				{/* Mobile Navigation */}
				{mobileMenuOpen && (
					<div className="md:hidden py-4 border-t border-gray-100">
						{!isAdmin && (
							<form onSubmit={handleSearch} className="mb-4">
								<input
									type="text"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									placeholder="Search posts..."
									className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
								/>
							</form>
						)}
						<nav className="flex flex-col gap-1">
							{navLinks.map((link) => (
								<Link
									key={link.href}
									to={link.href}
									onClick={() => setMobileMenuOpen(false)}
									className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
										isActive(link.href)
											? "bg-[#FF6B35] text-white"
											: "text-gray-600 hover:bg-orange-50"
									}`}
								>
									{link.label}
								</Link>
							))}
							<div className="border-t border-gray-100 mt-2 pt-2">
								{isAdmin ? (
									<Link
										to="/"
										onClick={() => setMobileMenuOpen(false)}
										className="block px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
									>
										View Blog
									</Link>
								) : (
									<Link
										to="/admin"
										onClick={() => setMobileMenuOpen(false)}
										className="block px-4 py-3 text-sm font-medium text-[#FF6B35] hover:bg-orange-50 rounded-lg"
									>
										Admin Panel
									</Link>
								)}
							</div>
						</nav>
					</div>
				)}
			</div>
		</header>
	);
};

export default Header;
