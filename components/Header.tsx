"use client";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import React from "react";
import { FC } from "react";
import { ReactNode } from "react";
import { FaUserAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import { twMerge } from "tailwind-merge";

import Button from "./Button";
import { useAuthModal } from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import usePlayer from "@/hooks/usePlayer";

interface HeaderProps {
	children: ReactNode;
	className?: string;
}

export const Header: FC<HeaderProps> = ({ children, className }) => {
	const router = useRouter();
	const authModal = useAuthModal();
	const supabaseClient = useSupabaseClient();
	const player = usePlayer();
	const { user } = useUser();
	//////////////////////
	const handleLogout = async () => {
		const { error } = await supabaseClient.auth.signOut();
		player.reset();
		router.refresh();

		if (error) {
			toast.error(error.message);
		} else {
			toast.success("Logged out!");
		}
	};

	return (
		<div
			className={twMerge(
				`h-fit bg-gradient-to-b from-emerald-800 p-6`,
				className
			)}
		>
			<div className="w-full mb-4 flex items-center justify-between">
				<div className="hidden md:flex gap-x-2 items-center">
					<button
						className="bg-black rounded-full flex items-center justify-center hover:opacity-75 transition"
						onClick={router.back}
					>
						<RxCaretLeft size={35} className="text-white" />
					</button>
					<button
						className="bg-black rounded-full flex items-center justify-center hover:opacity-75 transition"
						onClick={router.forward}
					>
						<RxCaretRight size={35} className="text-white" />
					</button>
				</div>
				<div className="flex md:hidden gap-x-2 items-center">
					<button className="rounded-full p-2 bg-white flex items-center justify-center hover:opacity-75 transition">
						<HiHome className="text-black" size={20} />
					</button>
					<button className="rounded-full p-2 bg-white flex items-center justify-center hover:opacity-75 transition">
						<BiSearch className="text-black" size={20} />
					</button>
				</div>
				<div className="flex justify-between items-center gap-x-4">
					{user ? (
						<div className="flex gap-x-4 items-center">
							<Button onClick={handleLogout} className="bg-white px-6 py-2">
								Logout
							</Button>
							<Button
								onClick={() => router.push("/account")}
								className="bg-white"
							>
								<FaUserAlt />
							</Button>
						</div>
					) : (
						<>
							<div>
								<Button
									onClick={authModal.onOpen}
									className="bg-transparent text-neutral-300 font-medium"
								>
									Sign up
								</Button>
							</div>
							<div>
								<Button
									onClick={authModal.onOpen}
									className="bg-white px-6 py-2"
								>
									Login
								</Button>
							</div>
						</>
					)}
				</div>
			</div>
			{children}
		</div>
	);
};
