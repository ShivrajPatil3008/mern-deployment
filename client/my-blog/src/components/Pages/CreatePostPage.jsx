import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import Editor from "../Editor/Editor";
import { BASE_URL } from "../../config";

const CreatePostPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState("");

  async function createNewPost(e) {
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    // gets uploaded file
    data.set("file", file[0]);
    e.preventDefault();
    console.log(file);
    const response = await fetch(`${BASE_URL}/post`, {
      method: "POST",
      body: data,
      credentials: "include",
    });
    if (response.status === 200) {
      navigate("/");
    }
  }

  return (
    <form onSubmit={createNewPost}>
      <input
        type="text"
        placeholder={"Title"}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="summary"
        placeholder={"Summary"}
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />
      <input type="file" onChange={(e) => setFile(e.target.files)} />

      <Editor value={content} onChange={setContent} />

      <button style={{ marginTop: "5px" }}>Create Post</button>
    </form>
  );
};

export default CreatePostPage;
