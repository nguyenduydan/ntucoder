import api from './apiConfig';

// @function: getList
export const getList = async ({
    controller,
    page = 1,
    pageSize = 10,
    ascending = true,
    sortField = "id",
    params = {}, // ✨ hỗ trợ truyền params tùy ý
}) => {
    if (!controller) throw new Error("Controller không được xác định.");

    try {
        const response = await api.get(`/${controller}`, {
            params: {
                Page: page,
                PageSize: pageSize,
                ascending,
                sortField,
                ...params, // ✨ merge thêm điều kiện lọc
            },
        });

        const data = response.data;
        if (!data || data.error || data.success === false) {
            throw new Error(data.message || "Lỗi từ phía server");
        }

        return {
            data: data?.data || [],
            totalPages: data?.totalPages || 0,
            totalCount: data?.totalCount || 0,
        };
    } catch (error) {
        console.error("Lỗi Axios:", error);

        let message = "Đã xảy ra lỗi.";
        if (error.response) {
            message = `Lỗi API: ${error.response.status} - ${error.response.statusText}`;
        } else if (error.request) {
            message = "Không thể kết nối tới server.";
        } else if (error.message) {
            message = error.message;
        }

        throw new Error(message);
    }
};

// @function: getListTestCase
export const getListTestCase = async ({
    problemId,
    page = 1,
    pageSize = 10,
    ascending = true,
    sortField = "id",
}) => {
    return await getList({
        controller: "TestCase",
        page,
        pageSize,
        ascending,
        sortField,
        params: { ProblemID: problemId },
    });
};

// @function: getDetail
export const getDetail = async ({ controller, id }) => {
    if (!id || !controller) throw new Error("ID và controller là bắt buộc.");

    try {
        const res = await api.get(`/${controller}/${id}`);
        return res.data;
    } catch (error) {
        console.error("❌ Error fetching detail:", error);
        throw error;
    }
};

// @function: createItem
export const createItem = async ({ controller, data }) => {
    try {
        const res = await api.post(`/${controller}`, data);
        return res.data;
    } catch (error) {
        console.error("❌ Error creating item:", error);
        throw error;
    }
};

// @function: updateItem
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
        throw error;
    }
};

// @function: updateStatus
export const updateStatus = async ({ controller, id, newStatus }) => {
    if (!id) {
        console.error("LỖI: ID không hợp lệ!", id);
        return;
    }
    try {
        const currentDataResponse = await api.get(`/${controller}/${id}`);
        const currentData = currentDataResponse.data;

        const updatedData = { ...currentData, status: newStatus };

        const response = await api.put(`/${controller}/${id}`, updatedData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    } catch (error) {
        console.error("❌ Error updating status:", error);
        throw error;
    }
};

// @function: deleteItem
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
        throw error;
    }
};

// @function: getTestCase (khác getListTestCase vì không phân trang)
export const getTestCase = async ({ controller, problemid }) => {
    if (!problemid || !controller) {
        throw new Error("ID và controller là bắt buộc.");
    }

    try {
        const res = await api.get(`/${controller}`, {
            params: { problemID: problemid },
        });
        return res.data;
    } catch (error) {
        console.error("❌ Error fetching detail:", error);
        throw error;
    }
};

// @function: login
export const login = async (data) => {
    try {
        const res = await api.post("/Auth/login", data);
        return res;
    } catch (error) {
        throw error;
    }
};

// @function: register
export const register = async (data) => {
    try {
        const res = await api.post("/Coder", { ...data, role: 2 });
        return res;
    } catch (error) {
        throw error;
    }
};
