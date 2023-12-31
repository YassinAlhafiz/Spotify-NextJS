"use client";

import { FC, useState } from "react";
import Modal from "./Modal";
import { Price, ProductsWithPrice } from "@/types";
import Button from "./Button";
import { supabase } from "@supabase/auth-ui-shared";
import { useUser } from "@/hooks/useUser";
import toast from "react-hot-toast";
import { postData } from "@/libs/helpers";
import { getStripe } from "@/libs/stripeClient";
import { useSubscribeModal } from "@/hooks/useSubscribeModal";

interface SubscribeModalProps {
	products: ProductsWithPrice[];
}

const formatPrice = (price: Price) => {
	const priceString = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: price.currency,
		minimumFractionDigits: 0,
	}).format((price.unit_amount || 0) / 100);

	return priceString;
};

const SubscribeModal: FC<SubscribeModalProps> = ({ products }) => {
	//Get Subscribe modal from hook
	const subscribeModal = useSubscribeModal();

	const onChange = (open: Boolean) => {
		if (!open) {
			subscribeModal.onClose();
		}
	};
	// get user from hook
	const { user, isLoading, subscription } = useUser();
	// create state for priceIdLoading
	const [priceIdLoading, setPriceIdLoading] = useState<string>();
	// Handle checkout function
	const handleCheckout = async (price: Price) => {
		setPriceIdLoading(price.id);
		if (!user) {
			setPriceIdLoading(undefined);
			return toast.error("Must be logged in!");
		}
		if (subscription) {
			setPriceIdLoading(undefined);
			return toast("Already subscribed");
		}
		try {
			const { sessionId } = await postData({
				url: "/api/create-checkout-session",
				data: { price },
			});
			/////
			const stripe = await getStripe();
			stripe?.redirectToCheckout({ sessionId });
			//////
		} catch (error) {
			toast.error((error as Error)?.message);
		} finally {
			setPriceIdLoading(undefined);
		}
	};
	/////////////////////////////////////////
	/////////////////////////////////////////
	/////////////////////////////////////////
	let content = <div className="text-center">No products available</div>;

	if (products.length) {
		content = (
			<div>
				{products.map((product) => {
					if (!product.prices?.length) {
						return <div key={product.id}>No prices available</div>;
					}
					return product.prices.map((price) => (
						<Button
							key={price.id}
							onClick={() => handleCheckout(price)}
							className="mb-4"
							disabled={isLoading || price.id === priceIdLoading}
						>
							{`Subscribe for ${formatPrice(price)} a ${price.interval}`}
						</Button>
					));
				})}
			</div>
		);
	}
	if (subscription) {
		content = <div className="text-center">Already subscribed</div>;
	}
	return (
		<Modal
			title="Only for premium users"
			description="Subscribe to Spotify Premium"
			isOpen={subscribeModal.isOpen}
			onChange={onChange}
		>
			{content}
		</Modal>
	);
};

export default SubscribeModal;
