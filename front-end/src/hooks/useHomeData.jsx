import { useCallback, useEffect, useState, useMemo } from "react";
import { getList } from "@/config/apiService";
import api from "@/config/apiConfig";

export const useHomeData = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [courses, setCourses] = useState([]);
    const [blogs, setBlogs] = useState([]);

    // Tối ưu fetch courses với AbortController
    const fetchCourses = useCallback(async () => {
        const controller = new AbortController();
        setIsLoading(true);

        try {
            const res = await getList({
                controller: "Course",
                page: 1,
                pageSize: 100, // Lấy nhiều hơn để có thể sort và filter
                signal: controller.signal
            });

            const coursePopular = res.data
                ?.filter(c => c.enrollCount >= 0 && c.status === 1)
                ?.sort((a, b) => b.enrollCount - a.enrollCount) // Sort theo enrollCount giảm dần
                ?.slice(0, 4) || []; // Lấy 4 course có enroll cao nhất

            setCourses(coursePopular);
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.log("Không có dữ liệu khóa học");
            }
        } finally {
            setIsLoading(false);
        }

        return () => controller.abort();
    }, []);
    // Tối ưu fetch blogs
    const fetchBlogs = useCallback(async () => {
        const controller = new AbortController();
        setIsLoading(true);

        try {
            const res = await api.get(`/Blog?pinHome=1&limit=5`, {
                signal: controller.signal
            });

            if (res.status === 200) {
                setBlogs(Array.isArray(res.data.data) ? res.data.data : []);
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.log("Không có dữ liệu blog");
            }
        } finally {
            setIsLoading(false);
        }

        return () => controller.abort();
    }, []);

    // Memoize top pinned blogs
    const topPinnedBlogs = useMemo(() => {
        if (!Array.isArray(blogs)) return [];

        return blogs
            .filter(b => b.pinHome === 1 && typeof b.viewCount === 'number')
            .sort((a, b) => b.viewCount - a.viewCount)
            .slice(0, 5);
    }, [blogs]);

    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([fetchCourses(), fetchBlogs()]);
        };
        fetchData();
    }, [fetchCourses, fetchBlogs]);

    return {
        courses,
        blogs: topPinnedBlogs,
        isLoading
    };
};
