"use client";

import AuthModal from "@/components/AuthModal";
import SubscribeModal from "@/components/SubscribeModal";
import UploadModal from "@/components/UploadModal";
import { ProductsWithPrice } from "@/types";
import { FC, useEffect, useState } from "react";

interface ModelProviderProps {
	products: ProductsWithPrice[];
}

const ModelProvider: FC<ModelProviderProps> = ({ products }) => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	}

	return (
		<>
			<AuthModal />
			<UploadModal />
			<SubscribeModal products={products} />
		</>
	);
};

export default ModelProvider;
