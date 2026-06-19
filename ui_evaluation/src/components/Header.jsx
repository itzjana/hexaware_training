import { Link } from "react-router-dom";

const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3 justify-content-between">
      <Link className="navbar-brand" to="/">
        User Management
      </Link>

      <div className="navbar-nav justify-content-end">
        <Link className="nav-link" to="/">User List</Link>
        <Link className="nav-link" to="/add">Add User</Link>
        <Link className="nav-link" to="/dataList">DataList</Link>
      </div>
    </nav>
  );
};

export default Header;