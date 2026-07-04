import { useState } from "react";

export const useProfilePicture = () => {
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const uploadProfilePicture = async (file: File) => {
    setIsUploading(true);
    try {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
      return url;
    } finally {
      setIsUploading(false);
    }
  };

  return { avatarUrl, isUploading, uploadProfilePicture };
};

export default useProfilePicture;
