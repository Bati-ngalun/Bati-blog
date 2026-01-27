import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "@/shared/Header";
import Footer from "@/shared/Footer";
import PostCard from "./PostCard";
import { Post, Category } from "@/shared/types";
import { supabase } from "@/lib/supabase";
import { ArrowRight, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

const POSTS_PER_PAGE = 9;

const BlogHome: React.FC = () => {
	const [searchParams] = useSearchParams();
	const [posts, setPosts] = useState<Post[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [totalPosts, setTotalPosts] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedCategory, setSelectedCategory] = useState("all");

	const searchQuery = searchParams.get("search") || "";

	useEffect(() => {
		fetchCategories();
	}, []);

	useEffect(() => {
		fetchPosts();
	}, [currentPage, selectedCategory, searchQuery]);

	const fetchCategories = async () => {
		try {
			const { data, error } = await supabase
				.from("categories")
				.select("*")
				.order("name");

			if (error) throw error;
			setCategories(data || []);
		} catch (err) {
			console.error("Error fetching categories:", err);
		}
	};

	const fetchPosts = async () => {
		setLoading(true);
		try {
			let query = supabase
				.from("posts")
				.select("*, categories(name, slug)", { count: "exact" })
				.eq("status", "published")
				.order("published_at", { ascending: false });

			if (selectedCategory !== "all") {
				const cat = categories.find((c) => c.slug === selectedCategory);
				if (cat) {
					query = query.eq("category_id", cat.id);
				}
			}

			if (searchQuery) {
				query = query.or(
					`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%`,
				);
			}

			const offset = (currentPage - 1) * POSTS_PER_PAGE;
			query = query.range(offset, offset + POSTS_PER_PAGE - 1);

			const { data, error, count } = await query;

			if (error) throw error;
			setPosts(data || []);
			setTotalPosts(count || 0);
		} catch (err) {
			console.error("Error fetching posts:", err);
		} finally {
			setLoading(false);
		}
	};

	const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
	const featuredPosts = posts.slice(0, 2);
	const regularPosts = posts.slice(2);

	return (
		<div className="min-h-screen bg-[#FAFAFA]">
			<Header />

			{/* Hero Section */}
			<section className="relative bg-gradient-to-br from-[#1A1A2E] via-[#2D2D44] to-[#1A1A2E] py-16 md:py-24 overflow-hidden">
				<div className="absolute inset-0 opacity-10">
					<div className="absolute top-0 left-0 w-96 h-96 bg-[#FF6B35] rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2" />
					<div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FF6B35] rounded-full filter blur-3xl translate-x-1/2 translate-y-1/2" />
				</div>
				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<span className="inline-block px-4 py-1.5 bg-[#FF6B35]/20 text-[#FF6B35] text-sm font-medium rounded-full mb-4">
						Bati Ngalun's Blog
					</span>
					<h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
						Building Excellence,
						<br />
						<span className="text-[#FF6B35]">One Story at a Time</span>
					</h1>
					<p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
						Discover insights, tips, and inspiration from The Gambia's leading
						company in Waterworks, Agriculture, Real Estate and Foundation.
					</p>
					<div className="flex flex-wrap justify-center gap-3">
						<Link
							to="/category/waterworks"
							className="px-6 py-3 bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-medium rounded-lg transition-colors flex items-center gap-2"
						>
							Explore Waterworks
							<ArrowRight className="w-4 h-4" />
						</Link>
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
					<div className="flex items-center gap-2 py-4 overflow-x-auto scrollbar-hide">
						<button
							onClick={() => {
								setSelectedCategory("all");
								setCurrentPage(1);
							}}
							className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
								selectedCategory === "all"
									? "bg-[#FF6B35] text-white"
									: "bg-gray-100 text-gray-600 hover:bg-gray-200"
							}`}
						>
							All Posts
						</button>
						{categories.map((cat) => (
							<button
								key={cat.id}
								onClick={() => {
									setSelectedCategory(cat.slug);
									setCurrentPage(1);
								}}
								className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
									selectedCategory === cat.slug
										? "bg-[#FF6B35] text-white"
										: "bg-gray-100 text-gray-600 hover:bg-gray-200"
								}`}
							>
								{cat.name}
							</button>
						))}
					</div>
				</div>
			</section>

			{/* Search Results Header */}
			{searchQuery && (
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
					<p className="text-gray-600">
						Search results for:{" "}
						<span className="font-semibold text-[#1A1A2E]">
							"{searchQuery}"
						</span>
						<span className="ml-2 text-sm">({totalPosts} posts found)</span>
					</p>
				</div>
			)}

			{/* Posts Grid */}
			<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				{loading ? (
					<div className="flex items-center justify-center py-20">
						<Loader2 className="w-8 h-8 text-[#FF6B35] animate-spin" />
					</div>
				) : posts.length === 0 ? (
					<div className="text-center py-20">
						<p className="text-gray-500 text-lg">No posts found.</p>
					</div>
				) : (
					<>
						{/* Featured Posts */}
						{currentPage === 1 &&
							selectedCategory === "all" &&
							!searchQuery &&
							featuredPosts.length > 0 && (
								<div className="grid md:grid-cols-2 gap-6 mb-12">
									{featuredPosts.map((post) => (
										<PostCard key={post.id} post={post} featured />
									))}
								</div>
							)}

						{/* Regular Posts Grid */}
						<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{(currentPage === 1 && selectedCategory === "all" && !searchQuery
								? regularPosts
								: posts
							).map((post) => (
								<PostCard key={post.id} post={post} />
							))}
						</div>

						{/* Pagination */}
						{totalPages > 1 && (
							<div className="flex items-center justify-center gap-2 mt-12">
								<button
									onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
									disabled={currentPage === 1}
									className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
								>
									<ChevronLeft className="w-5 h-5" />
								</button>
								{Array.from({ length: totalPages }, (_, i) => i + 1).map(
									(page) => (
										<button
											key={page}
											onClick={() => setCurrentPage(page)}
											className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
												currentPage === page
													? "bg-[#FF6B35] text-white"
													: "border border-gray-200 text-gray-600 hover:bg-gray-50"
											}`}
										>
											{page}
										</button>
									),
								)}
								<button
									onClick={() =>
										setCurrentPage((p) => Math.min(totalPages, p + 1))
									}
									disabled={currentPage === totalPages}
									className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
								>
									<ChevronRight className="w-5 h-5" />
								</button>
							</div>
						)}
					</>
				)}
			</section>

			<Footer />
		</div>
	);
};

export default BlogHome;
