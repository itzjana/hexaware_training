import { Routes, Route } from "react-router-dom";
import AddUserPage from "./pages/AddUserPage.jsx";
import UserListPage from "./pages/UserListPage.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<UserListPage />} />
      <Route path="/add" element={<AddUserPage />} />
    </Routes>
  );
}

export default App