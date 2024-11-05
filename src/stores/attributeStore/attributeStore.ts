import axiosInstance from "@/axios/axiosInstance";
import type { IAttributes1,IAttributesCreate,IAttributesEdit,IValues } from "@/interface/attribute/attribute";
import { defineStore } from "pinia";

export const useAttributeStore = defineStore("AttributeStore", {
  state: () => ({
    attributes: [] as IAttributes1[],
    attributes_value: [],
  }),
  getters: {},
  actions: {
    // Get All Attributes
    async getAllAttributes() {
      try {
        const response = await axiosInstance.get<IAttributes1[]>(
          "attribute/getall"
        );
        this.attributes = response.data;
      } catch (error) {
        console.log("Có lỗi khi lấy attributes", error);
      }
    },
    // create attribute======================
    async CreateAttribute(attribute: IAttributes1) {
      try {
        const response = await axiosInstance.post<IAttributes1>(
          "attribute/create",
          attribute
        );
        this.attributes.push(response.data);
      } catch (error) {
        console.log("Có lỗi khi tạo Attribute", error);
      }
    },
      // create attribute-value=======================
      async CreateAttribute_Value(attribute: IAttributesCreate) {
        try {
          const response = await axiosInstance.post<IAttributes1>(
            "attribute/create_value",
            attribute
          );
          this.attributes.push(response.data);
        } catch (error) {
          console.log("Có lỗi khi tạo Attribute-value", error);
        }
      },
    // Edit attribute=====================================
    async EditAttribute(attribute: IAttributes1, id: number) {
      try {
        const response = await axiosInstance.put<IAttributes1>(
          `attribute/update/${id}`,
          attribute
        );
        this.attributes = this.attributes.map((item) =>
          item.id === id ? response.data : item
        );
      } catch (error) {
        console.log("Có lỗi khi chỉnh sửa attribute", error);
      }
      finally{
        await this.getAllAttributes();
      }
    },
   // Edit attribute-value=====================================
   async EditAttribute_Value(attribute_value: IValues, id: number) {
    try {
      const response = await axiosInstance.put<IAttributes1>(
        `attribute-value/update/${id}`,
        attribute_value
      );
      this.attributes = this.attributes.map((item) =>
        item.id === id ? response.data : item
      );
    } catch (error) {
      console.log("Có lỗi khi chỉnh sửa attribute", error);
    }
  },




    // Delete attribute
    async DeleteAttribute(id: number) {
      try {
        await axiosInstance.delete(`/attribute/delete/${id}`);
        this.attributes = this.attributes.filter((item) => item.id !== id);
      } catch (error) {
        console.log("Có lỗi khi xóa attribute", error);
      }
    },
  },
});
