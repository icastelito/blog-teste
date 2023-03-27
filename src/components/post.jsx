import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { Container } from "react-bootstrap";

function PostList() {
  const [posts, setPosts] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [userDataMap, setUserDataMap] = useState({});

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/posts")
      .then((response) => setPosts(response.data))
      .catch((error) => console.log(error));

    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        const users = response.data;
        const userDataMap = {};
        users.forEach((user) => {
          userDataMap[user.id] = user;
        });
        setUserDataMap(userDataMap);
      })
      .catch((error) => console.error(error));
  }, []);

  const handlePostSelection = async (postId) => {
    if (selectedPostId === postId) {
      setSelectedPostId(null);
    } else {
      setSelectedPostId(postId);
      setCommentsLoaded(false);
      axios
        .get(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`)
        .then((response) => {
          setComments(response.data);
          setCommentsLoaded(true);
        })
        .catch((error) => console.error(error));
    }
  };

  return (
    <>
      <Container>
        {posts.map((post) => {
          const userData = userDataMap[post.userId] || {};
          return (
            <div className="post" key={post.id}>
              <h2 className="postTitle"> Title: {post.title}</h2>
              <h3 className="postUser">
                {" "}
                By: {userData.name} ({userData.email}) - phone: {userData.phone}
              </h3>
              <p> {post.body}</p>
              <Button
                type="button"
                className="btn btn-secondary btn-sm float-right userButton"
                onClick={() => handlePostSelection(post.id)}
              >
                View Comments
              </Button>
              {selectedPostId === post.id && commentsLoaded && (
                <div>
                  {comments.map((comment) => (
                    <div className="comment" key={comment.id}>
                      <h3 className="commentName">{comment.name}</h3>
                      <p>{comment.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </Container>
    </>
  );
}

export default PostList;