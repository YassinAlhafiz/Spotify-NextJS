"use client";
import { Box } from "@/components/Box";
import { FC } from "react";
import { BounceLoader } from "react-spinners";

interface loadingProps {}

const Loading: FC<loadingProps> = ({}) => {
	return (
		<Box classname="h-full flex items-center justify-center">
			<BounceLoader color="#22c55e" size={40} />
		</Box>
	);
};

export default Loading;
