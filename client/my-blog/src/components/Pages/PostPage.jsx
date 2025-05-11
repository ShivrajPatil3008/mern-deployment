import { formatISO9075 } from "date-fns";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { UserContext } from "../UserContext/UserContext";
import edit from "../../assets/edit_icon.png";
import { BASE_URL } from "../../config";
const PostPage = () => {
  const [postInfo, setPostInfo] = useState(null);
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    fetch(`${BASE_URL}/post/${id}`).then((respose) => {
      respose.json().then((postInfo) => {
        setPostInfo(postInfo);
      });
    });
  }, []);
  async function deletePost() {
    const confirmDelete = window.confirm("Are you sure you want to delete?"); // ✅ Ask for confirmation
    if (!confirmDelete) return;

    const response = await fetch(`${BASE_URL}/post/${id}`, {
      method: "DELETE",
      credentials: "include", // ✅ Include credentials for authentication
    });

    if (response.status === 200) {
      navigate("/"); // ✅ Redirect to homepage after successful deletion
    } else {
      alert("Failed to delete the post"); // ✅ Show an alert if deletion fails
    }
  }

  if (!postInfo) return "";
  return (
    <div className="post-page">
      <h1>{postInfo.title}</h1>
      <time> {formatISO9075(new Date(postInfo.createdAt))}</time>
      <div className="author">by @{postInfo.author.username}</div>
      {userInfo.id === postInfo.author._id && (
        <div className="edit-row">
          <div className="edit-btn-div">
            <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
              <img className="edit-icon" src={edit} alt="edit icon" />
              Edit this post
            </Link>

            {/* ✅ Added delete button */}
            <button className="delete-btn" onClick={deletePost}>
              Delete
            </button>
          </div>
        </div>
      )}
      <div className="image">
        <img src={`${BASE_URL}/${postInfo.cover}`} alt="" />
      </div>
      {/* paste raw html without any formatting */}
      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: postInfo.content }}
      />
    </div>
  );
};

export default PostPage;
