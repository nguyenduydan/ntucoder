import api from './apiConfig';

// @function: getList
// @desc: Fetches a paginated list of items from the specified controller in the API
export const getList = async ({
    controller,
    page = 1,
    pageSize = 10,
    ascending = true,
    sortField = "id",
}) => {
    if (!controller) {
        throw new Error("Controller không được xác định.");
    }

    try {
        const response = await api.get(`/${controller}`, {
            params: { Page: page, PageSize: pageSize, ascending, sortField },
        });

        const data = response.data;

        // ✅ Nếu API trả về error trong body, thì ném lỗi
        if (!data || data.error || data.success === false) {
            throw new Error(data.message || "Lỗi từ phía server");
        }

        return {
            data: data?.data || [],
            totalPages: data?.totalPages || 0,
            totalCount: data?.totalCount || 0,
        };
    } catch (error) {
        // Kiểm tra nếu lỗi liên quan đến kết nối hoặc timeout
        if (error.response) {
            // Lỗi có phản hồi từ API (mã lỗi HTTP không phải 2xx)
            throw new Error(`Lỗi từ API: ${error.response.status} - ${error.response.statusText}`);
        } else if (error.request) {
            // Lỗi nếu không có phản hồi từ API (kết nối hoặc timeout)
            throw new Error("Không thể kết nối tới API. Vui lòng kiểm tra lại kết nối mạng.");
        } else {
            // Lỗi khác (ví dụ: lỗi cấu hình)
            throw new Error(`Lỗi khi thực thi yêu cầu: ${error.message}`);
        }
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
        const res = await api.post(`/${controller}`, data);
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
        const currentDataResponse = await api.get(`/${controller}/${id}`);
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
