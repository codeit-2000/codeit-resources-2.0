import { uploadImage } from "@/lib/api/storage";
import { useMutation } from "@tanstack/react-query";

interface UploadImageParams {
  userId: string;
  imageFile: File;
}

const useUploadImage = () => {
  const uploadImageMutation = useMutation({
    mutationFn: async ({ userId, imageFile }: UploadImageParams) => {
      const imagePath = await uploadImage({
        id: userId,
        image: imageFile,
      });

      return imagePath;
    },
    onSuccess: async (imagePath) => imagePath,
    onError: () => {
      throw new Error("이미지 업로드에 실패했습니다.");
    },
  });

  return uploadImageMutation;
};

export default useUploadImage;
