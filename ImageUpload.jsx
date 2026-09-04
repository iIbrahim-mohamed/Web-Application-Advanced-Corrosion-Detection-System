const handleUpload = async () => {
  if (!file) return alert("Please select an image first.");

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await axios.post(
      "http://localhost:5000/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // 🔥 مهم جدًا
        },
      }
    );

    console.log(res.data);
    onNewDetection(res.data);

    alert("Uploaded Successfully ✔");
  } catch (err) {
    console.log(err.response?.data || err);
    alert("Upload failed (check backend)");
  }
};