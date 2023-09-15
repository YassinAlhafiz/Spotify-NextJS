"use client";

import AuthModal from "@/components/AuthModal";
import { FC, useEffect, useState } from "react";

interface ModelProviderProps {}

const ModelProvider: FC<ModelProviderProps> = ({}) => {
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
		</>
	);
};

export default ModelProvider;
