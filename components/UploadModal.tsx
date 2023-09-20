"use client";
import { FC, useState } from "react";
import Modal from "./Modal";
import { useUploadModal } from "@/hooks/useUploadModal";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import Input from "./Input";
import Button from "./Button";
import toast from "react-hot-toast/headless";
import { useUser } from "@/hooks/useUser";
import uniqid from "uniqid";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";

interface UploadModalProps {}

const UploadModal: FC<UploadModalProps> = ({}) => {
	const uploadModal = useUploadModal();
	const router = useRouter();
	const { user } = useUser();
	const supabaseClient = useSupabaseClient();
	const [isLoading, setIsLoading] = useState(false);
	const { register, handleSubmit, reset } = useForm<FieldValues>({
		defaultValues: {
			author: "",
			title: "",
			song: null,
			image: null,
		},
	});
	const onChange = (open: boolean) => {
		if (!open) {
			reset();
			uploadModal.onClose();
		}
	};

	const onSubmit: SubmitHandler<FieldValues> = async (values) => {
		//Upload to SUPABASE
		try {
			setIsLoading(true);
			const imageFile = values.image?.[0];
			const songFile = values.song?.[0];

			if (!user || !imageFile || !songFile) {
				toast.error("Missing Fields");
				return;
			}
			const uniqueID = uniqid();

			// UPLOAD SONG
			const { data: songData, error: songError } = await supabaseClient.storage
				.from("songs")
				.upload(`song-${values.title}-${uniqueID}`, songFile, {
					cacheControl: "3600",
					upsert: false,
				});
			if (songError) {
				setIsLoading(false);
				return toast.error("Failed song upload");
			}
			// UPLOAD Image
			const { data: imageData, error: imageError } =
				await supabaseClient.storage
					.from("images")
					.upload(`image-${values.title}-${uniqueID}`, imageFile, {
						cacheControl: "3600",
						upsert: false,
					});
			if (imageError) {
				setIsLoading(false);
				return toast.error("Failed image upload");
			}

			const { error: supabaseError } = await supabaseClient
				.from("songs")
				.insert({
					user_id: user.id,
					title: values.title,
					author: values.author,
					image_path: imageData.path,
					song_path: songData.path,
				});
			if (supabaseError) {
				setIsLoading(false);
				return toast.error(supabaseError.message);
			}

			router.refresh();
			setIsLoading(false);
			toast.success("Song Created!");
			reset();
			uploadModal.onClose();
		} catch (error) {
			toast.error("Something went wrong...");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Modal
			title="Add a song"
			description="Upload an MP3 File"
			isOpen={uploadModal.isOpen}
			onChange={onChange}
		>
			<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
				<Input
					id="title"
					disabled={isLoading}
					{...register("title", { required: true })}
					placeholder="Song Title"
				/>
				<Input
					id="author"
					disabled={isLoading}
					{...register("author", { required: true })}
					placeholder="Song Author"
				/>
				<div>
					<div className="pb-1">Song File</div>
					<Input
						id="song"
						type="file"
						disabled={isLoading}
						accept=".mp3"
						{...register("song", { required: true })}
						placeholder="Song Author"
					/>
				</div>
				<div>
					<div className="pb-1">Image File</div>
					<Input
						id="image"
						type="file"
						disabled={isLoading}
						accept="image/*"
						{...register("image", { required: true })}
						placeholder="Song Author"
					/>
				</div>
				<Button disabled={isLoading} type="submit">
					Create Song
				</Button>
			</form>
		</Modal>
	);
};

export default UploadModal;
