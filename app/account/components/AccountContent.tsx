"use client";
import Button from "@/components/Button";
import { useSubscribeModal } from "@/hooks/useSubscribeModal";
import { useUser } from "@/hooks/useUser";
import { postData } from "@/libs/helpers";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface AccountContentProps {}

const AccountContent: FC<AccountContentProps> = ({}) => {
	const router = useRouter();
	const subscribeModal = useSubscribeModal();
	const { user, subscription, isLoading } = useUser();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!isLoading && !user) {
			router.replace("/");
		}
	}, [isLoading, user, router]);

	const redirectToCustomerPortal = async () => {
		setLoading(true);
		try {
			const { url, error } = await postData({
				url: "/api/create-portal-link",
			});
			window.location.assign(url);
		} catch (error) {
			toast.error((error as Error).message);
		}
		setLoading(false);
	};
	console.log(subscription);
	return (
		<div className="mb-7 px-6">
			{!subscription && (
				<div className="flex flex-col gap-y-4">
					<p>No Active Subscription</p>
					<Button onClick={subscribeModal.onOpen} className="w-[300px]">
						Subscribe
					</Button>
				</div>
			)}

			{subscription && (
				<div className="flex flex-col gap-y-4">
					<p>
						You are currently on the {/* @ts-ignore */}
						<b>{subscription?.prices?.products?.name}</b> plan.
					</p>
					<Button
						disabled={loading || isLoading}
						onClick={redirectToCustomerPortal}
						className="w-[300px]"
					>
						Open Customer Portal
					</Button>
				</div>
			)}
		</div>
	);
};

export default AccountContent;
