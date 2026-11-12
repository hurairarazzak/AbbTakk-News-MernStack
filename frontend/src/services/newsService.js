import axios from 'axios';

const API_URL = 'http://localhost:5000/api/news'; // adjust if needed

export const loginAdmin = async (email, password) => {
  const res = await axios.post('http://localhost:5000/api/admin/login', {
    email,
    password,
  });
  return res.data;
};

export const fetchAllNews = async () => {
    const res = await axios.get(API_URL);
    const sortedNews = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setNewsList(sortedNews);
};


export const fetchHeadlines = async () => {
  const res = await axios.get(`${API_URL}/category/Headlines`);
  return res.data; // default
};

export const fetchCategoryNews = async (category) => {
  const res = await axios.get(`${API_URL}/category/${category}`);
  return res.data;
};

export const fetchPopularNews = async () => {
  const res = await axios.get(`${API_URL}/popular`);
  return res.data;
};

export const fetchNewsBySlug = async (slug) => {
  const res = await axios.get(`${API_URL}/slug/${slug}`);
  return res.data;
};

export const searchNews = async (query) => {
  const res = await axios.get(`${API_URL}/search?q=${query}`);
  return res.data;
};