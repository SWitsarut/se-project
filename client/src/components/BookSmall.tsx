import Image from "next/image";
import React from "react";
import { Button,Text } from "@mantine/core";

type BookSmallProps = {
	img: string;
	name: string;
	price: number;
};

function BookSmall(props: BookSmallProps) {
	const { img, name, price }: BookSmallProps = props;
	return (
		<div className="bg-dark max-w-sm">
			<Image
				sizes="100vw"
				className="w-full h-auto aspect-[16/9]"
				src={img}
				alt={name}
				width={0}
				height={0}
			/>
			<div className="flex flex-col p-3 justify-between">
				<div className="flex w-auto justify-between">
					<Text component="h1" className="text-white">{name}</Text>
					<h5 className="text-white">price {price}</h5>
				</div>
				<div className="flex w-auto justify-between">
					<h4 className="text-white">review :{}</h4>
					<Button>add to card</Button>
				</div>
			</div>
		</div>
	);
}

export default BookSmall;
