import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://abbtakknewswebsite-production.up.railway.app/api/news";

const AdminNewsManager = () => {
    const [newsList, setNewsList] = useState([]);
    const [form, setForm] = useState({
        title: "",
        content: "",
        category: "",
        image: null,
        isPinned: false,
        isMostPopular: false,
    });

    const token = localStorage.getItem("adminToken");

    const fetchNews = async () => {
        try {
            const res = await axios.get(API_URL);
            setNewsList(res.data);
        } catch (err) {
            console.error("Error fetching news:", err);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === "checkbox") {
            setForm({ ...form, [name]: checked });
        } else if (type === "file") {
            setForm({ ...form, image: files[0] });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.isPinned && !form.isMostPopular) {
            alert("If 'Pinned' is selected, 'Most Popular' must also be selected.");
            return;
        }

        try {
            const formData = new FormData();
            Object.entries(form).forEach(([key, value]) => {
                formData.append(key, value);
            });

            await axios.post(API_URL, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            setForm({
                title: "",
                content: "",
                category: "",
                image: null,
                isPinned: false,
                isMostPopular: false,
            });

            fetchNews();
        } catch (err) {
            console.error("Submit error:", err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchNews();
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    const isCategoryFilled = form.category.trim() !== "";

    const categories = [
        "Headlines",
        "Breaking",
        "Pakistan",
        "World",
        "Business",
        "Abbtakk special",
        "Entertainment",
        "Sports",
        "Programs",
        "Big stories",
        "Accidents",
        "Crime and corruption",
        "Courts and cases",
        "Health and environment",
        "Technology"
    ];

    return (
        <div className="max-w-5xl mx-auto p-8 mt-10 bg-white rounded-lg shadow-2xl border border-gray-200">
            <h2 className="text-3xl font-bold mb-8 text-[#dd3333] tracking-wide">📝 Upload News</h2>

            {/* Form */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {/* Title */}
                <div className="relative">
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="News Title"
                        required
                        className="peer p-3 border rounded w-full outline-none focus:border-[#dd3333]"
                    />
                </div>

                {/* File Upload - Styled */}
                <div className="relative">
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#dd3333] file:text-white hover:file:bg-red-700"
                    />
                </div>

                {/* Content */}
                <div className="md:col-span-2">
                    <textarea
                        name="content"
                        value={form.content}
                        onChange={handleChange}
                        placeholder="Write full news content..."
                        required
                        className="w-full p-3 border rounded h-32 outline-none focus:border-[#dd3333]"
                    />
                </div>

                {/* Category - Hidden if MostPopular */}
                {!form.isMostPopular && (
                    <div className="relative">
                        <select
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            disabled={form.isMostPopular} // ✅ corrected
                            className="w-full p-2 border rounded bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat, index) => (
                                <option key={index} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Checkboxes */}
                <div className="flex flex-col justify-center gap-4 text-sm text-gray-700">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="isMostPopular"
                            checked={form.isMostPopular}
                            onChange={handleChange}
                            disabled={isCategoryFilled}
                        />
                        Mark as Most Popular
                    </label>

                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="isPinned"
                            checked={form.isPinned}
                            onChange={handleChange}
                            disabled={isCategoryFilled}
                        />
                        Mark as Pinned
                    </label>
                </div>

                <div className="md:col-span-2">
                    <button
                        type="submit"
                        className="bg-[#dd3333] w-full text-white py-3 rounded-md font-semibold hover:bg-red-700 transition"
                    >
                        ✅ Publish News
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminNewsManager;
