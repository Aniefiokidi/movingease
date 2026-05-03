import { Link } from "react-router-dom";

export default function NotFound() {
	return (
		<section className="section-wrap py-16">
			<div className="rounded-2xl bg-white p-10 text-center shadow-md">
				<p className="text-sm font-semibold uppercase tracking-wide text-[#C0272D]">404</p>
				<h1 className="mt-2 text-3xl font-bold text-[#1B2A4A]">Page not found</h1>
				<p className="mt-3 text-slate-600">The page you are looking for does not exist.</p>
				<Link to="/" className="mt-6 inline-block rounded-xl bg-[#1B2A4A] px-5 py-3 font-semibold text-white">Back to Home</Link>
			</div>
		</section>
	);
}
