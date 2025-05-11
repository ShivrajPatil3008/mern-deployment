import Layout from "./components/Layout/Layout";
import IndexPage from "./components/Pages/IndexPage";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./components/Pages/LoginPage";
import RegisterPage from "./components/Pages/RegisterPage";
import { UserContextProvider } from "./components/UserContext/UserContext";
import CreatePostPage from "./components/Pages/CreatePostPage";
import PostPage from "./components/Pages/PostPage";
import EditPostPage from "./components/Pages/EditPostPage";

function App() {
  return (
    <UserContextProvider>
      <Routes>
        {/* parent route */}
        <Route path="/" element={<Layout />}>
          {/* child routes */}
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/create" element={<CreatePostPage />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/edit/:id" element={<EditPostPage />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
