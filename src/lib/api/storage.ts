import { getUrl, uploadData } from "aws-amplify/storage";

export const uploadImage = async ({
  id,
  image,
}: {
  id: string;
  image: File;
}) => {
  try {
    const uploadPath = `profile-images/${image.name}/${id}`;

    const res = uploadData({
      path: uploadPath,
      data: image,
    });

    const uploadedFilePath = (await res.result).path;

    if (!uploadedFilePath) throw new Error("No path to file found");

    return uploadedFilePath;
  } catch (error) {
    throw error;
  }
};

export const getImageUrl = async (path: string) => {
  try {
    const link = await getUrl({
      path,
    });

    return link.url.toString();
  } catch (error) {
    throw error;
  }
};
