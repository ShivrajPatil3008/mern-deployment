import React, { useState } from "react";
import Post from "../Posts/Post";
import { useEffect } from "react";
import { BASE_URL } from "../../config";
const IndexPage = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch(`${BASE_URL}/post`).then((response) => {
      response.json().then((posts) => {
        setPosts(posts);
      });
    });
  }, []);
  return (
    <div>{posts.length > 0 && posts.map((post) => <Post {...post} />)}</div>
  );
};

export default IndexPage;
