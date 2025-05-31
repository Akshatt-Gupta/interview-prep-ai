import axiosInstance from "./axiosInstance";

export const uploadImage = async (image) => {
    const formData = new FormData();
    formData.append("image", image);
    try{
        const response = await axiosInstance.post(API_PATHS.UPLOAD.IMAGE, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Image upload error:", error);
        throw error;
    }
};

export default uploadImage;