import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import {
	Menu,
	X,
	Search,
	Calendar,
	Clock,
	Eye,
	ArrowRight,
	Mail,
	Phone,
	MapPin,
	Facebook,
	Instagram,
	Linkedin,
	Twitter,
	ChevronLeft,
	ChevronRight,
	Loader2,
} from "lucide-react";

interface Post {
	id: string;
	title: string;
	slug: string;
	excerpt?: string;
	content: string;
	featured_image?: string;
	categories?: { name: string; slug: string };
	author: string;
	status: string;
	published_at?: string;
	read_time: number;
	views: number;
}

interface Category {
	id: string;
	name: string;
	slug: string;
}

const BRAND = {
	name: "Bati-Ngalun Company Limited",
	tagline: "Building Excellence in The Gambia & The sub-region",
	email: "admin@bati-ngalun.com",
	phone: "+220 3258794 / 6822093",
	address: "Marikissa Village, Kombo Central WestCoast Region, The Gambia",
};

const AppLayout: React.FC = () => {
	const [posts, setPosts] = useState<Post[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	useEffect(() => {
		fetchData();
	}, []);

	useEffect(() => {
		fetchPosts();
	}, [selectedCategory]);

	const fetchData = async () => {
		try {
			const { data: cats } = await supabase
				.from("categories")
				.select("*")
				.order("name");
			setCategories(cats || []);
		} catch (err) {
			console.error("Error:", err);
		}
	};

	const fetchPosts = async () => {
		setLoading(true);
		try {
			let query = supabase
				.from("posts")
				.select("*, categories(name, slug)")
				.eq("status", "published")
				.order("published_at", { ascending: false })
				.limit(12);

			if (selectedCategory !== "all") {
				const cat = categories.find((c) => c.slug === selectedCategory);
				if (cat) query = query.eq("category_id", cat.id);
			}

			const { data } = await query;
			setPosts(data || []);
		} catch (err) {
			console.error("Error:", err);
		} finally {
			setLoading(false);
		}
	};

	const formatDate = (dateString?: string) => {
		if (!dateString) return "";
		return new Date(dateString).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	return (
		<div className="min-h-screen bg-[#FAFAFA]">
			{/* Header */}
			<header className="bg-white shadow-sm sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16 md:h-20">
						<Link to="/" className="flex items-center gap-3">
							<img src="/logo.png" alt="Logo" className="h-10 w-auto" />

							<div className="hidden sm:block">
								<h1 className="text-lg md:text-xl font-bold text-[#1A1A2E]">
									{BRAND.name}
								</h1>
							</div>
						</Link>
						<nav className="hidden md:flex items-center gap-1">
							{[
								"Home",
								"Waterworks",
								"Agriculture",
								"Real Estate",
								"Foundation",
								"News",
							].map((item) => (
								<button
									key={item}
									onClick={() =>
										setSelectedCategory(
											item === "Home" ? "all" : item.toLowerCase(),
										)
									}
									className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${(item === "Home" && selectedCategory === "all") || selectedCategory === item.toLowerCase() ? "bg-[#FF6B35] text-white" : "text-gray-600 hover:text-[#FF6B35] hover:bg-orange-50"}`}
								>
									{item}
								</button>
							))}
						</nav>
						<div className="flex items-center gap-2">
							<Link
								to="/admin"
								className="hidden md:inline-flex px-4 py-2 text-sm font-medium text-[#FF6B35] border border-[#FF6B35] rounded-lg hover:bg-[#FF6B35] hover:text-white transition-colors"
							>
								Admin
							</Link>
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
					{mobileMenuOpen && (
						<div className="md:hidden py-4 border-t border-gray-100">
							<nav className="flex flex-col gap-1">
								{[
									"Home",
									"Waterworks",
									"Agriculture",
									"Real Estate",
									"Foundation",
									"News",
								].map((item) => (
									<button
										key={item}
										onClick={() => {
											setSelectedCategory(
												item === "Home" ? "all" : item.toLowerCase(),
											);
											setMobileMenuOpen(false);
										}}
										className={`px-4 py-3 rounded-lg text-sm font-medium text-left ${(item === "Home" && selectedCategory === "all") || selectedCategory === item.toLowerCase() ? "bg-[#FF6B35] text-white" : "text-gray-600 hover:bg-orange-50"}`}
									>
										{item}
									</button>
								))}
								<Link
									to="/admin"
									onClick={() => setMobileMenuOpen(false)}
									className="px-4 py-3 text-sm font-medium text-[#FF6B35] hover:bg-orange-50 rounded-lg"
								>
									Admin Panel
								</Link>
							</nav>
						</div>
					)}
				</div>
			</header>

			{/* Hero */}
			<section className="relative bg-gradient-to-br from-[#1A1A2E] via-[#2D2D44] to-[#1A1A2E] py-16 md:py-24 overflow-hidden">
				<div className="absolute inset-0 opacity-10">
					<div className="absolute top-0 left-0 w-96 h-96 bg-[#FF6B35] rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2" />
					<div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FF6B35] rounded-full filter blur-3xl translate-x-1/2 translate-y-1/2" />
				</div>
				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<span className="inline-block px-4 py-1.5 bg-[#FF6B35]/20 text-[#FF6B35] text-sm font-medium rounded-full mb-4">
						Bati-Ngalun's Blog
					</span>
					<h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
						Building Excellence,
						<br />
						<span className="text-[#FF6B35]">One Story at a Time</span>
					</h1>
					<p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
						Discover insights, tips, and inspiration from Gambia leading company
						in Waterworks, Agriculture, Real Estate and Foundation.
					</p>
					<div className="flex flex-wrap justify-center gap-3">
						<button
							onClick={() => setSelectedCategory("waterworks")}
							className="px-6 py-3 bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-medium rounded-lg transition-colors flex items-center gap-2"
						>
							Explore Waterworks <ArrowRight className="w-4 h-4" />
						</button>
						<a
							href="https://bati-ngalun.com"
							target="_blank"
							rel="noopener noreferrer"
							className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors"
						>
							Visit Main Site
						</a>
					</div>
				</div>
			</section>

			{/* Category Filter */}
			<section className="bg-white border-b border-gray-100 sticky top-16 md:top-20 z-40">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center gap-2 py-4 overflow-x-auto">
						<button
							onClick={() => setSelectedCategory("all")}
							className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === "all" ? "bg-[#FF6B35] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
						>
							All Posts
						</button>
						{categories.map((cat) => (
							<button
								key={cat.id}
								onClick={() => setSelectedCategory(cat.slug)}
								className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat.slug ? "bg-[#FF6B35] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
							>
								{cat.name}
							</button>
						))}
					</div>
				</div>
			</section>

			{/* Posts Grid */}
			<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				{loading ? (
					<div className="flex items-center justify-center py-20">
						<Loader2 className="w-8 h-8 text-[#FF6B35] animate-spin" />
					</div>
				) : posts.length === 0 ? (
					<div className="text-center py-20">
						<p className="text-gray-500 text-lg">
							No posts found. Check back soon!
						</p>
					</div>
				) : (
					<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{posts.map((post) => (
							<Link
								key={post.id}
								to={`/post/${post.slug}`}
								className="group block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
							>
								<div className="relative h-48 overflow-hidden">
									<img
										src={
											post.featured_image ||
											"https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800"
										}
										alt={post.title}
										className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
									/>
									{post.categories && (
										<span className="absolute top-3 left-3 px-2.5 py-1 bg-[#FF6B35] text-white text-xs font-medium rounded-full">
											{post.categories.name}
										</span>
									)}
								</div>
								<div className="p-5">
									<div className="flex items-center gap-3 text-gray-500 text-xs mb-3">
										<span className="flex items-center gap-1">
											<Calendar className="w-3.5 h-3.5" />
											{formatDate(post.published_at)}
										</span>
										<span className="flex items-center gap-1">
											<Clock className="w-3.5 h-3.5" />
											{post.read_time} min
										</span>
										<span className="flex items-center gap-1">
											<Eye className="w-3.5 h-3.5" />
											{post.views}
										</span>
									</div>
									<h3 className="text-lg font-semibold text-[#1A1A2E] mb-2 group-hover:text-[#FF6B35] transition-colors line-clamp-2">
										{post.title}
									</h3>
									{post.excerpt && (
										<p className="text-gray-600 text-sm line-clamp-2 mb-4">
											{post.excerpt}
										</p>
									)}
									<div className="flex items-center text-[#FF6B35] text-sm font-medium">
										Read More{" "}
										<ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
									</div>
								</div>
							</Link>
						))}
					</div>
				)}
			</section>

			{/* Footer */}
			<footer className="bg-[#1A1A2E] text-white">
				<div className="border-b border-white/10">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
						<div className="flex flex-col md:flex-row items-center justify-between gap-6">
							<div>
								<h3 className="text-xl md:text-2xl font-bold mb-2">
									Subscribe to Our Newsletter
								</h3>
								<p className="text-gray-400">
									Get the latest project insights delivered to your inbox.
								</p>
							</div>
							<form
								onSubmit={(e) => {
									e.preventDefault();
									alert("Thank you for subscribing!");
								}}
								className="flex w-full md:w-auto"
							>
								<input
									type="email"
									placeholder="Enter your email"
									required
									className="flex-1 md:w-64 px-4 py-3 bg-white/10 border border-white/20 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
								/>
								<button
									type="submit"
									className="px-6 py-3 bg-[#FF6B35] hover:bg-[#E55A2B] rounded-r-lg font-medium transition-colors flex items-center gap-2"
								>
									Subscribe <ArrowRight className="w-4 h-4" />
								</button>
							</form>
						</div>
					</div>
				</div>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						<div>
							<div className="flex items-center gap-3 mb-4">
								<img src="/logo.png" alt="Logo" className="h-10 w-auto" />

								<div>
									<h2 className="text-lg font-bold">{BRAND.name}</h2>
								</div>
							</div>
							<p className="text-gray-400 text-sm mb-6">
								{BRAND.tagline}. Stay updated with the latest in Waterworks,
								Agriculture, Real Estate and Foundation.
							</p>
							<div className="flex gap-3">
								{[Facebook, Instagram, Linkedin, Twitter].map((Icon, i) => (
									<a
										key={i}
										href="#"
										className="w-10 h-10 bg-white/10 hover:bg-[#FF6B35] rounded-lg flex items-center justify-center transition-colors"
									>
										<Icon className="w-5 h-5" />
									</a>
								))}
							</div>
						</div>
						<div>
							<h3 className="text-lg font-semibold mb-4">Categories</h3>
							<ul className="space-y-3">
								{[
									"Waterworks",
									"Agriculture",
									"Real Estate",
									"Foundation",
									"News",
								].map((item) => (
									<li key={item}>
										<button
											onClick={() => setSelectedCategory(item.toLowerCase())}
											className="text-gray-400 hover:text-[#FF6B35] text-sm"
										>
											{item}
										</button>
									</li>
								))}
							</ul>
						</div>
						<div>
							<h3 className="text-lg font-semibold mb-4">Company</h3>
							<ul className="space-y-3">
								{["Main Website", "About Us", "Services", "Contact"].map(
									(item) => (
										<li key={item}>
											<a
												href="https://bati-ngalun.com"
												target="_blank"
												rel="noopener noreferrer"
												className="text-gray-400 hover:text-[#FF6B35] text-sm"
											>
												{item}
											</a>
										</li>
									),
								)}
							</ul>
						</div>
						<div>
							<h3 className="text-lg font-semibold mb-4">Contact Us</h3>
							<ul className="space-y-4">
								<li>
									<a
										href={`mailto:${BRAND.email}`}
										className="flex items-center gap-3 text-gray-400 hover:text-[#FF6B35] text-sm"
									>
										<Mail className="w-5 h-5 text-[#FF6B35]" />
										{BRAND.email}
									</a>
								</li>
								<li>
									<a
										href={`tel:${BRAND.phone}`}
										className="flex items-center gap-3 text-gray-400 hover:text-[#FF6B35] text-sm"
									>
										<Phone className="w-5 h-5 text-[#FF6B35]" />
										{BRAND.phone}
									</a>
								</li>
								<li className="flex items-start gap-3 text-gray-400 text-sm">
									<MapPin className="w-5 h-5 text-[#FF6B35] flex-shrink-0 mt-0.5" />
									{BRAND.address}
								</li>
							</ul>
						</div>
					</div>
				</div>
				<div className="border-t border-white/10">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
						<p className="text-gray-400 text-sm text-center">
							© {new Date().getFullYear()} {BRAND.name}. All rights reserved.
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default AppLayout;
