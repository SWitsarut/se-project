import BookItem from "@/components/BookItem";

export default function HomePage() {
	return (
		<>
			<div className="w-fit grid gap-6 mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
				<BookItem />
				<BookItem />
				<BookItem />
				<BookItem />
				<BookItem />
				<BookItem />
			</div>
		</>
	);
}