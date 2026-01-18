import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const parseResume = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(
    `${API}/api/resume/parse`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  return res.data;
};