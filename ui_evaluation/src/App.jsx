import { Routes, Route } from "react-router-dom";
import AddUserPage from "./pages/AddUserPage.jsx";
import UserListPage from "./pages/UserListPage.jsx";
import PaginationPage from "./pages/Pagination.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<UserListPage />} />
      <Route path="/add" element={<AddUserPage />} />
      <Route path="/dataList" element={<PaginationPage />} />
    </Routes>
  );
}

export default App