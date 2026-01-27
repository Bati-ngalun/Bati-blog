import React from "react";
import { Link } from "react-router-dom";
import { BRAND } from "./constants";
import {
	Facebook,
	Linkedin,
	Twitter,
	Mail,
	Phone,
	MapPin,
	ArrowRight,
} from "lucide-react";

const Footer: React.FC = () => {
	const currentYear = new Date().getFullYear();

	const quickLinks = [
		{ href: "/", label: "Home" },
		{ href: "/category/waterworks", label: "Waterworks" },
		{ href: "/category/agriculture", label: "Agriculture" },
		{ href: "/category/real-estate", label: "Real Estate" },
		{ href: "/category/foundation", label: "Foundation" },
		{ href: "/category/news", label: "News" },
	];

	const companyLinks = [
		{ href: BRAND.mainWebsite, label: "Main Website", external: true },
		{ href: `${BRAND.mainWebsite}/about`, label: "About Us", external: true },
		{
			href: `${BRAND.mainWebsite}/services`,
			label: "Services",
			external: true,
		},
		{ href: `${BRAND.mainWebsite}/contact`, label: "Contact", external: true },
	];

	return (
		<footer className="bg-[#1A1A2E] text-white">
			{/* Newsletter Section */}
			<div className="border-b border-white/10">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					<div className="flex flex-col md:flex-row items-center justify-between gap-6">
						<div>
							<h3 className="text-xl md:text-2xl font-bold mb-2">
								Subscribe to Our Newsletter
							</h3>
							<p className="text-gray-400">
								Get the latest construction insights and project updates
								delivered to your inbox.
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
								className="flex-1 md:w-64 px-4 py-3 bg-white/10 border border-white/20 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
							/>
							<button
								type="submit"
								className="px-6 py-3 bg-[#FF6B35] hover:bg-[#E55A2B] rounded-r-lg font-medium transition-colors flex items-center gap-2"
							>
								Subscribe
								<ArrowRight className="w-4 h-4" />
							</button>
						</form>
					</div>
				</div>
			</div>

			{/* Main Footer Content */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
					{/* Brand Column */}
					<div className="lg:col-span-1">
						<Link to="/" className="flex items-center gap-3 mb-4">
							<img src="/logo.png" alt="Logo" className="h-10 w-auto" />

							<div>
								<h2 className="text-lg font-bold">{BRAND.name}</h2>
							</div>
						</Link>
						<p className="text-gray-400 text-sm mb-6">
							{BRAND.tagline}. Stay updated with the latest in Waterworks,
							Agriculture, Real Estate and Foundation
						</p>
						<div className="flex gap-3">
							<a
								href={BRAND.socials.facebook}
								target="_blank"
								rel="noopener noreferrer"
								className="w-10 h-10 bg-white/10 hover:bg-[#FF6B35] rounded-lg flex items-center justify-center transition-colors"
							>
								<Facebook className="w-5 h-5" />
							</a>

							<a
								href={BRAND.socials.linkedin}
								target="_blank"
								rel="noopener noreferrer"
								className="w-10 h-10 bg-white/10 hover:bg-[#FF6B35] rounded-lg flex items-center justify-center transition-colors"
							>
								<Linkedin className="w-5 h-5" />
							</a>
							<a
								href={BRAND.socials.twitter}
								target="_blank"
								rel="noopener noreferrer"
								className="w-10 h-10 bg-white/10 hover:bg-[#FF6B35] rounded-lg flex items-center justify-center transition-colors"
							>
								<Twitter className="w-5 h-5" />
							</a>
						</div>
					</div>

					{/* Quick Links */}
					<div>
						<h3 className="text-lg font-semibold mb-4">Categories</h3>
						<ul className="space-y-3">
							{quickLinks.map((link) => (
								<li key={link.href}>
									<Link
										to={link.href}
										className="text-gray-400 hover:text-[#FF6B35] transition-colors text-sm"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Company Links */}
					<div>
						<h3 className="text-lg font-semibold mb-4">Company</h3>
						<ul className="space-y-3">
							{companyLinks.map((link) => (
								<li key={link.href}>
									{link.external ? (
										<a
											href={link.href}
											target="_blank"
											rel="noopener noreferrer"
											className="text-gray-400 hover:text-[#FF6B35] transition-colors text-sm"
										>
											{link.label}
										</a>
									) : (
										<Link
											to={link.href}
											className="text-gray-400 hover:text-[#FF6B35] transition-colors text-sm"
										>
											{link.label}
										</Link>
									)}
								</li>
							))}
						</ul>
					</div>

					{/* Contact Info */}
					<div>
						<h3 className="text-lg font-semibold mb-4">Contact Us</h3>
						<ul className="space-y-4">
							<li>
								<a
									href={`mailto:${BRAND.email}`}
									className="flex items-center gap-3 text-gray-400 hover:text-[#FF6B35] transition-colors text-sm"
								>
									<Mail className="w-5 h-5 text-[#FF6B35]" />
									{BRAND.email}
								</a>
							</li>
							<li>
								<a
									href={`tel:${BRAND.phone}`}
									className="flex items-center gap-3 text-gray-400 hover:text-[#FF6B35] transition-colors text-sm"
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

			{/* Bottom Bar */}
			<div className="border-t border-white/10">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<div className="flex flex-col md:flex-row justify-between items-center gap-4">
						<p className="text-gray-400 text-sm">
							© {currentYear} {BRAND.name}. All rights reserved.
						</p>
						<div className="flex gap-6">
							<a
								href="#"
								className="text-gray-400 hover:text-[#FF6B35] text-sm transition-colors"
							>
								Privacy Policy
							</a>
							<a
								href="#"
								className="text-gray-400 hover:text-[#FF6B35] text-sm transition-colors"
							>
								Terms of Service
							</a>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
