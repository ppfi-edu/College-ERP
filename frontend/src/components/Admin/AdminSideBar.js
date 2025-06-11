import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";

import "bootstrap-icons/font/bootstrap-icons.css";
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../../styles/AdminSidebar.css";

const Sidebar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (token) {
      const decodedToken = jwtDecode(token);
      const { id } = decodedToken;
      fetchAdminData(id);
    }
  }, []);


  const fetchAdminData = async (id) => {
    try {
      const response = await fetch(`https://server.ppfi.site/api/admin/${id}`);
      if (response.ok) {
        const adminData = await response.json();
        setUserName(adminData.name);
      } else {
        console.error('Failed to fetch admin data');
      }
    } catch (error) {
      console.error('Error fetching admin data:', error.message);
    }
  };


  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('isAdmin');
    window.location.href = "/";
  };

  return (
    <div className="sidebar d-flex flex-column justify-content-between border-end p-3 vh-100" style={{ width: "18rem" }}>
      <div>
        <p
          style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          className="user-select-none d-flex align-items-center text-black text-decoration-none"
        >
          <i className="bi bi-person-circle fs-4 me-2"></i>
          <span className="fs-4">Welcome {userName}</span>
        </p>
        <hr className="text-black mt-2" />
        <ul className="nav nav-pills flex-column p-0 m-0">
          <li className="nav-item p-1">
            <Link to="/admin/dashboard" className="nav-link text-black">
              <i className="bi bi-speedometer me-2 fs-5"></i>
              <span className="fs-5">Dashboard</span>
            </Link>
          </li>

          <li className="nav-item p-1">
            <Link to="/admin/dashboard/manage-faculty" className="nav-link text-black">
              <i className="bi bi-person-fill-gear me-2 fs-5"></i>
              <span className="fs-5">Manage Faculties</span>
            </Link>
          </li>

          <li className="nav-item p-1">
            <Link to="/admin/dashboard/manage-students" className="nav-link text-black">
              <i className="bi bi-people me-2 fs-5"></i>
              <span className="fs-5">Manage Students</span>
            </Link>
          </li>

          <li className="nav-item p-1">
            <Link to="/admin/dashboard/manage-courses" className="nav-link text-black">
              <i className="bi bi-book me-2 fs-5"></i>
              <span className="fs-5">Manage Course</span>
            </Link>
          </li>
          <li className="nav-item p-1">
            <Link to="/admin/dashboard/manage-fee" className="nav-link text-black">
              <i className="bi bi-book me-2 fs-5"></i>
              <span className="fs-5">Manage Fees</span>
            </Link>
          </li>

          <li className="nav-item p-1">
            <Link to="/admin/dashboard/manage-library" className="nav-link text-black">
              <i className="bi bi-book me-2 fs-5"></i>
              <span className="fs-5">Manage Library</span>
            </Link>
          </li>

          <li className="nav-item p-1">
            <Link to="/admin/help-support" className="nav-link text-black">
              <i className="bi bi-info-circle-fill me-2 fs-5"></i>
              <span className="fs-5">Help & Support</span>
            </Link>
          </li>
        </ul>
      </div>

      <div>
        <hr className="text-black" />
        <Dropdown
          show={showDropdown}
          onToggle={handleDropdownToggle}
          align="end"
        >
          <Dropdown.Toggle className="your-profile d-flex align-items-center border-0 text-black" variant="light" id="dropdown-basic">
            <span
              className="fs-5"
              style={{
                paddingLeft: "20px",
                paddingRight: "60px"
              }}
            >
              <i className="bi bi-person-circle me-2 fs-5" />
              Your Profile
            </span>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={handleLogout} >
              <span
                style={{
                  paddingLeft: "80px",
                  paddingRight: "85px"
                }}
              >
                Logout
              </span>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};

export default Sidebar;
