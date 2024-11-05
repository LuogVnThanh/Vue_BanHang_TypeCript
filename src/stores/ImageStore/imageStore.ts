import axiosInstance from "@/axios/axiosInstance";
import type { Images } from "@/interface/image/image";
import { defineStore } from "pinia";

export const useImageStore = defineStore("imageStore", {
  state: () => ({
    images: [] as Images[],
  }),
  getters: {},
  actions: {
    // Get All Image
    async getAllImages() {
      try {
        const response = await axiosInstance.get<Images[]>("image/getall");
        this.images = response.data;
      } catch (error) {
        console.log("Có lỗi khi lấy toàn bộ ảnh");
      }
    },
    // Tạo===============
    async createImage(id: number, file: File) {
      try {
        const formData = new FormData();
        formData.append("id", id.toString()); // Thêm id vào FormData
        formData.append("image", file); // Thêm file vào FormData

        // Gửi yêu cầu POST với FormData
        const response = await axiosInstance.post("/image/create", formData);
        this.images.push(response.data); // Thêm ảnh mới vào state
      } catch (error) {
        console.error("Có lỗi khi tạo ảnh:", error);
      }
    },
    // Update Ảnh================
    async updateImage(id: number) {
      try {
        const response = await axiosInstance.put<Images>(`/image/update/${id}`);
        this.images = this.images.map((item) =>
          item.id === id ? response.data : item
        );
      } catch (error) {
        console.log("Có lỗi khi cập nhật ảnh", error);
      }
    },
    async deleteImage(id: number) {
      try {
        await axiosInstance.delete(`/image/delete/${id}`);
        this.images = this.images.filter((image) => image.id !== id);
      } catch (error) {
        console.log("Có lỗi khi xóa ảnh", error);
      }
    },
  },
});
