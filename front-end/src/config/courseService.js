// src/api/CourseService.js
import api from "./apiConfig";

/**
 * Lấy danh sách Course với phân trang, sắp xếp.
 *
 * @param {Object} params - Các tham số query.
 * @param {number} params.page - Số trang cần lấy.
 * @param {number} params.pageSize - Số dòng mỗi trang.
 * @param {boolean} params.ascending - Thứ tự sắp xếp.
 * @param {string} params.sortField - Trường sắp xếp.
 * @returns {Promise<Object>} - Chứa data, totalPages và totalCount.
 */

export const getList = async ({ page, pageSize, ascending, sortField, totalCount }) => {
    const dynamicTimeout = (totalCount - pageSize + 1) * 1000;
    try {
        const response = await api.get("/Course", {
            params: {
                Page: page,
                PageSize: pageSize,
                ascending,
                sortField,
            },
            timeout: dynamicTimeout
        });
        const dataWithStatus = Array.isArray(response.data.data)
            ? response.data.data.map(item => ({ ...item, status: item.status }))
            : [];
        return {
            data: dataWithStatus,
            totalPages: response.data.totalPages || 0,
            totalCount: response.data.totalCount || 0,
        };
    } catch (error) {
        console.error("Error fetching Course data:", error);
        throw error;
    }
};

/**
 * Lấy thông tin Course theo id.
 *
 * @param {string|number} id - ID của Course.
 * @returns {Promise<Object>} - Dữ liệu của Course.
 */
export const getById = async (id) => {
    try {
        const response = await api.get(`/Course/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching Course by id:", error);
        throw error;
    }
};

/**
 * Gửi yêu cầu tạo mới người dùng (Course).
 *
 * @param {Object} CourseData - Dữ liệu người dùng cần tạo.
 * @returns {Promise<Object>} - Dữ liệu phản hồi từ API.
 */
export const create = async (CourseData) => {
    try {
        const response = await api.post('/Course', CourseData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error creating Course:', error);
        throw error;
    }
};

/**
 * Cập nhật thông tin Course.
 *
 * @param {string|number} id - ID của Course cần cập nhật.
 * @param {Object} updateData - Dữ liệu cập nhật.
 * @returns {Promise<Object>} - Dữ liệu của Course sau khi cập nhật.
 */
export const update = async (id, updateData) => {
    try {
        const response = await api.put(`/Course/${id}/`, updateData, {
            headers: {
                "Content-Type": "multipart/form-data",  // Đảm bảo gửi dưới dạng form-data
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating Course:", error);
        throw error;
    }
};

export const updateStatus = async (id, newStatus) => {
    try {
        // 1. Lấy dữ liệu hiện tại của khóa học
        const currentDataResponse = await api.get(`/Course/${id}`);
        const currentData = currentDataResponse.data;

        // 2. Cập nhật trạng thái mới
        const updatedData = { ...currentData, status: newStatus };

        // 3. Gửi toàn bộ dữ liệu lên server
        const response = await api.put(`/Course/${id}/`, updatedData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    } catch (error) {
        console.error("Lỗi cập nhật trạng thái khóa học:", error);
        throw error;
    }
};



/**
 * Xóa Course theo id.
 *
 * @param {Object} params - Các tham số cần thiết.
 * @param {string|number} params.id - ID của Course cần xóa.
 * @param {string|function} [params.deleteEndpoint] - Endpoint tùy chỉnh. Nếu là function, nó sẽ được gọi với tham số row.
 * @param {Object} [params.row] - Dữ liệu row, được truyền vào nếu deleteEndpoint là function.
 * @returns {Promise<Object>} - Kết quả xóa.
 */
export const deleteCourse = async ({ id }) => {
    if (!id) {
        console.error("LỖI: ID không hợp lệ!", id);
        return;
    }

    const endpoint = `/Course/${id}`;

    try {
        const response = await api.delete(endpoint);
        return response.data;
    } catch (error) {
        console.error("Error deleting:", error.response?.data || error.message);
        throw error;
    }
};
export const search = async ({ keyword, page = 1, pageSize = 10 }) => {
    if (!keyword || keyword.trim() === "") {
        console.error("❌ Lỗi: keyword không hợp lệ");
        return [];
    }

    try {
        const response = await api.get("/Course/search", {
            params: { keyword, page, pageSize },
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi tìm kiếm khóa học:", error.response?.data || error);
        throw error;
    }
};

