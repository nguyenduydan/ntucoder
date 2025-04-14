import { status } from 'nprogress';
import api from './apiConfig';


// @function: getList
// @desc: Fetches a paginated list of items from the specified controller in the API
export const getList = async ({ controller, page, pageSize, ascending, sortField }) => {
    if (!controller) {
        throw new Error("Controller không được xác định.");
    }

    try {
        const res = await api.get(`/${controller}`, {
            params: { Page: page, PageSize: pageSize, ascending, sortField },
        });

        const dataWithStatus = res.data.data?.map(item => ({
            ...item,
        })) ?? [];

        return {
            data: dataWithStatus,
            totalPages: res.data.totalPages || 0,
            totalCount: res.data.totalCount || 0,
        };
    } catch (error) {
        console.error("❌ Error fetching data:", error);
        return {
            data: [],
            totalPages: 0,
            totalCount: 0,
        };
    }
};



// @function: getDetail
// @desc: Fetches the details of a specific item from the specified controller in the API
export const getDetail = async ({ controller, id }) => {
    if (!id || !controller) {
        throw new Error("ID and controller name are required to fetch details.");
    }

    try {
        const res = await api.get(`/${controller}/${id}`);
        return res.data;
    } catch (error) {
        console.error("❌ Error fetching detail:", error);
        throw error; // Rethrow the error to be handled by the calling function
    }
};

// @function: createItem
// @desc: Sends a request to create a new item in the specified controller in the API
export const createItem = async ({ controller, data }) => {
    try {
        const res = await api.post(`/${controller}`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return res.data;
    } catch (error) {
        console.error("❌ Error creating item:", error);
        throw error; // Rethrow the error to be handled by the calling function
    }
};

// @function: updateItem
// @desc: Sends a request to update an existing item in the specified controller in the API
export const updateItem = async ({ controller, id, data }) => {
    if (!id) {
        console.error("LỖI: ID không hợp lệ!", id);
        return;
    }
    try {
        const res = await api.put(`/${controller}/${id}`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return res.data;
    } catch (error) {
        console.error("❌ Error updating item:", error);
        throw error; // Rethrow the error to be handled by the calling function
    }
};

// @function: updateStatus
// @desc: Sends a request to update the status of an item in the specified controller in the API
export const updateStatus = async ({ controller, id, newStatus }) => {
    if (!id) {
        console.error("LỖI: ID không hợp lệ!", id);
        return;
    }
    try {
        // 1. Lấy dữ liệu hiện tại của khóa học
        const currentDataResponse = await api.get(`/Course/${id}`);
        const currentData = currentDataResponse.data;

        // 2. Cập nhật trạng thái mới
        const updatedData = { ...currentData, status: newStatus };

        // 3. Gửi toàn bộ dữ liệu lên server
        const response = await api.put(`/${controller}/${id}`, updatedData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    } catch (error) {
        console.error("❌ Error updating status:", error);
        throw error; // Rethrow the error to be handled by the calling function
    }
};

// @function: deleteItem
// @desc: Sends a request to delete an item from the specified controller in the API
export const deleteItem = async ({ controller, id }) => {
    if (!id) {
        console.error("LỖI: ID không hợp lệ!", id);
        return;
    }
    try {
        const res = await api.delete(`/${controller}/${id}`);
        return res.data;
    } catch (error) {
        console.error("❌ Error deleting item:", error);
        throw error; // Rethrow the error to be handled by the calling function
    }
};
