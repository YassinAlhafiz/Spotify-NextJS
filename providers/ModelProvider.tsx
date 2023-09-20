"use client";

import AuthModal from "@/components/AuthModal";
import UploadModal from "@/components/UploadModal";
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
			<UploadModal />
		</>
	);
};

export default ModelProvider;
