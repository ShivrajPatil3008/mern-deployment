import React, { useEffect } from "react";
import { useState } from "react";

import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import Editor from "../Editor/Editor";
import { BASE_URL } from "../../config";

const EditPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState([]);
  useEffect(() => {
    fetch(`${BASE_URL}/post/${id}`).then((response) => {
      response.json().then((postInfo) => {
        setTitle(postInfo.title);
        setContent(postInfo.content);
        setSummary(postInfo.summary);
      });
    });
  }, []);

  async function updatePost(e) {
    e.preventDefault();
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("id", id);
    if (file?.[0]) {
      data.set("file", file?.[0]);
    }
    const response = await fetch(`${BASE_URL}/post/`, {
      method: "PUT",
      body: data,
      credentials: "include",
    });
    if (response.status === 200) navigate("/");
  }
  return (
    <form onSubmit={updatePost}>
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
      <Editor onChange={setContent} value={content} />
      <button style={{ marginTop: "5px" }}>Update Post</button>
    </form>
  );
};

export default EditPostPage;
