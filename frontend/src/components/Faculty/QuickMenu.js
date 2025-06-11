import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import NotificationToast from '../NotificationToast';
import MarkAttendanceModal from "./modals/MarkAttendanceModal";
import {jwtDecode} from 'jwt-decode';

function QuickMenu() {
    const [showMarkAttendanceModal, setShowMarkAttendanceModal] = useState(false);
    const [students, setStudents] = useState([]);
    const [totalAttendance, setTotalAttendance] = useState(0);
    const [showToast, setShowToast] = useState(false);
    const [message, setMessage] = useState('');
    const [facultyId, setFacultyId] = useState('');

    useEffect(() => {
            const token = localStorage.getItem("jwt");
            if (token) {
                const decodedToken = jwtDecode(token);
                setFacultyId(decodedToken.id); // Adjust based on your token structure
            }
    }, [setFacultyId]);

    const handleShowToast = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleShowMarkAttendanceModal = () => { setShowMarkAttendanceModal(true); };
    const handleCloseMarkAttendanceModal = () => { setShowMarkAttendanceModal(false); };

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch("https://server.ppfi.site/api/students/total-attendance", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ faculty_id : facultyId })
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch students');
                }
                const data = await response.json();
                setStudents(data);
                setTotalAttendance(7);
            } catch (error) {
                console.error(error);
            }
        };
        if (facultyId) {
            fetchStudents();
        }
    }, [facultyId]);

    return (
        <div className="quick-access ">
            <div className="p-3">
                <h4 className="m-3 mt-1 mb-0 text-success">Quick Menu</h4>
            </div>

            <div className='m-3 mb-0 border-bottom border-3 rounded-5' />

            <div className="d-flex flex-column justify-content-between p-3">
                <ul className="nav nav-pills flex-column p-0 m-0 w-100">
                    <li className="nav-item p-2 mb-2 w-100 nav-link text-black px-4 rounded-5" data-mdb-tooltip-init title="Click to mark attendance" onClick={handleShowMarkAttendanceModal} role="button">
                        <i className="bi bi-speedometer me-2 fs-5"></i>
                        <span className="fs-5">Mark Attendace</span>
                    </li>

                    <Link
                        to="/faculty/dashboard/manage-profile"
                        className="text-decoration-none"
                    >
                        <li className="nav-item p-2 mb-2 nav-link text-black px-4 rounded-5" data-mdb-tooltip-init title="Change Password" role="button">
                            <i className="bi bi-person-fill-gear me-2 fs-5"></i>
                            <span className="fs-5">Change Password</span>
                        </li>
                    </Link>
                </ul>
            </div>

            <MarkAttendanceModal show={showMarkAttendanceModal} handleClose={handleCloseMarkAttendanceModal} students={students} totalAttendance={totalAttendance} setMessage={setMessage} handleShowToast={handleShowToast} />
            <NotificationToast show={showToast} setShow={setShowToast} message={message} />
        </div>
    )
}

export default QuickMenu;