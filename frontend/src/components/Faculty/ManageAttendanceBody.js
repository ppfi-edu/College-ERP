import React, { useState, useEffect } from 'react';
import Card from "react-bootstrap/Card";
import { Col, Row } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import ManageAttendanceImage from "../../assets/ManageAttendanceImage.png";
import TotalLectureImage from "../../assets/TotalLectureImage.png";
import MarkAttendanceModal from './modals/MarkAttendanceModal';
import NotificationToast from '../NotificationToast';
import {jwtDecode} from 'jwt-decode';

function ManageAttendanceBody() {
    const [searchStudentId, setSearchStudentId] = useState('');
    const [filteredAttendance, setFilteredAttendance] = useState([]);
    const [modalUpdated, setModalUpdated] = useState(false);
    const [message, setMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [faculty_id, setFacultyId] = useState('');
    const [studentAttendance, setStudentAttendance] = useState([]);
    const [showMarkAttendanceModal, setShowMarkAttendanceModal] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("jwt");
        if (token) {
            const decodedToken = jwtDecode(token);
            console.log(decodedToken);
            setFacultyId(decodedToken.id); // Adjust based on your token structure
        }
    }, []);

    const handleShowToast = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleShowMarkAttendanceModal = () => { setShowMarkAttendanceModal(true); };
    const handleCloseMarkAttendanceModal = () => {
        setShowMarkAttendanceModal(false);
        setModalUpdated(!modalUpdated);
    };

    const handleSearchChange = (e) => {
        setSearchStudentId(e.target.value);
    };

    useEffect(() => {
        console.log(faculty_id);
        const fetchStudentsAttendance = async () => {
            try {
                const response = await fetch("http://localhost:5173/api/students/total-attendance", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ faculty_id : faculty_id }),
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch students attendance');
                }
                const data = await response.json();
                console.log(data);
                setStudentAttendance(data);
            } catch (error) {
                console.error(error);
                setStudentAttendance([]);
            }
        };
        if (faculty_id) {
            fetchStudentsAttendance();
        }
    }, [modalUpdated, faculty_id]);

    useEffect(() => {
        const filtered = studentAttendance.filter(student =>
            student.student_id?.toLowerCase().includes(searchStudentId.toLowerCase())
        );
        console.log(filtered);
        setFilteredAttendance(filtered);
    }, [searchStudentId, studentAttendance]);

    return (
        <div className="d-flex justify-content-center">
            <div>
                <div className="d-flex mx-5">
                    <Card
                        className="m-3 p-3 shadow align-items-center pe-auto"
                        style={{ width: "18rem" }}
                        onMouseEnter={(e) => e.target.classList.add('shadow-lg')}
                        onMouseLeave={(e) => e.target.classList.remove('shadow-lg')}
                        onClick={handleShowMarkAttendanceModal}
                        role="button"
                    >
                        <Card.Img
                            className="p-0"
                            variant="top"
                            src={ManageAttendanceImage}
                            style={{ width: "5rem", height: "5rem" }}
                        />
                        <Card.Body className="d-flex align-items-center">
                            <div>
                                <Card.Title>Mark Attendance</Card.Title>
                            </div>
                        </Card.Body>
                    </Card>

                    <Card
                        className="m-3 mx-5 p-3 shadow align-items-center pe-auto"
                        style={{ width: "18rem" }}
                        onMouseEnter={(e) => e.target.classList.add('shadow-lg')}
                        onMouseLeave={(e) => e.target.classList.remove('shadow-lg')}
                    >
                        <Card.Img
                            className="p-0"
                            variant="top"
                            src={TotalLectureImage}
                            style={{ width: "5rem", height: "5rem" }}
                        />
                        <Card.Body className="d-flex align-items-center">
                            <div>
                                <Card.Title>Total Lectures: {studentAttendance[0]?.total_classes || 0}</Card.Title>
                            </div>
                        </Card.Body>
                    </Card>
                </div>

                <div className="mt-4 mx-5 p-4 pt-3 border border-3 border-success rounded-4 shadow" style={{ width: "62rem" }}>
                    <Form>
                        <Form.Group controlId="searchStudentId">
                            <Form.Label>Search by Student ID</Form.Label>
                            <div className="input-group">
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Student ID"
                                    value={searchStudentId}
                                    onChange={handleSearchChange}
                                />
                                <button className="btn btn-success" type="button">Search</button>
                            </div>
                        </Form.Group>
                    </Form>
                    <div className="mt-3 border border-2 rounded-2">
                        <div className="d-flex w-100">
                            <Col xs={3} className="p-3 fw-bold">Student ID</Col>
                            <Col xs={3} className="p-3 fw-bold">Student Email</Col>
                            <Col xs={3} className="p-3 fw-bold">Total Attendance</Col>
                            <Col xs={4} className="p-3 fw-bold">Attendance Percentage</Col>
                        </div>
                        <hr className="text-black m-0" />
                        <div className="scrollable-container" style={{ height: '360px', overflowY: 'auto' }}>
                            {filteredAttendance.map(student => (
                                <div
                                    className="d-flex bg-hover-div"
                                    key={student.student_id}
                                    role="button"
                                >
                                    <Row className="w-100">
                                        <Col xs={3} className="p-4">{student.student_id || 'N/A'}</Col>
                                        <Col xs={3} className="p-4">{student.email || 'N/A'}</Col>
                                        <Col xs={3} className="p-4">{student.total_attendance || 'N/A'}</Col>
                                        <Col xs={3} className="p-4">{student.att_percentage || 'N/A'}%</Col>
                                    </Row>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <MarkAttendanceModal
                    show={showMarkAttendanceModal}
                    handleClose={handleCloseMarkAttendanceModal}
                    students={studentAttendance}
                    totalAttendance={studentAttendance[0]?.total_classes || 0}
                    setMessage={setMessage}
                    handleShowToast={handleShowToast}
                />
                <NotificationToast show={showToast} setShow={setShowToast} message={message} />
            </div>
        </div>
    );
}

export default ManageAttendanceBody;
