import React, { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";

import { Col } from 'react-bootstrap';
import ManageAttendanceImage from "../../assets/ManageAttendanceImage.png";
import TotalLectureImage from "../../assets/TotalLectureImage.png";
import Card from "react-bootstrap/Card";
import NotificationToast from '../NotificationToast';

function ViewAttendanceBody() {
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState('N/A');
    const [totalLecture, setTotalLecture] = useState('N/A');
    const [showToast, setShowToast] = useState(false);
    const [message, setMessage] = useState('');

    const handleShowToast = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("jwt");

            if (token) {
                const decodedToken = jwtDecode(token);
                const id = decodedToken.id;
                try {
                    const response = await fetch(`https://college-erp-3sin.onrender.com/api/students/attendance`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ id })
                    });
                    if (response.ok) {
                        const studentData = await response.json();

                        if (studentData.length === 0) {
                            setMessage("No attendance data found.");
                            handleShowToast();
                            return;
                        }

                        const totalAttendance = studentData.reduce((acc, curr) => acc + curr.att_percentage, 0);
                        const totalClasses = studentData.reduce((acc, curr) => acc + curr.total_classes, 0);

                        const averageAttendance = studentData.length > 1 
                            ? (totalAttendance / studentData.length).toFixed(2) 
                            : studentData[0].att_percentage;

                        const averageTotalClasses = studentData.length > 1 
                            ? (totalClasses / studentData.length).toFixed(2) 
                            : studentData[0].total_classes;

                        setAttendance(averageAttendance);
                        setTotalLecture(averageTotalClasses);
                        setStudents(studentData);
                    } else {
                        setMessage('Failed to fetch student data');
                        handleShowToast();
                    }
                } catch (error) {
                    setMessage("Something went wrong");
                    handleShowToast();
                    console.error('Error fetching student data:', error);
                }
            }
        };
        fetchData();
    }, []);

    return (
        <div className="d-flex flex-column align-items-center">
            {/* Attendance and Total Classes Cards */}
            <div className="d-flex mx-5 justify-content-center">
                <Card className="m-3 p-3 shadow align-items-center pe-auto" style={{ width: "28rem" }}>
                    <Card.Img
                        variant="top"
                        src={ManageAttendanceImage}
                        style={{ width: "5rem", height: "5rem" }}
                    />
                    <Card.Body className="text-center">
                        <Card.Title>Average Attendance</Card.Title>
                        <Card.Text>{attendance !== 'N/A' ? `${attendance}%` : 'No Data'}</Card.Text>
                    </Card.Body>
                </Card>

                <Card className="m-3 p-3 shadow align-items-center pe-auto" style={{ width: "28rem" }}>
                    <Card.Img
                        variant="top"
                        src={TotalLectureImage}
                        style={{ width: "5rem", height: "5rem" }}
                    />
                    <Card.Body className="text-center">
                        <Card.Title>Average Total Classes</Card.Title>
                        <Card.Text>{totalLecture !== 'N/A' ? totalLecture : 'No Data'}</Card.Text>
                    </Card.Body>
                </Card>
            </div>

            {/* Students List */}
            <div className="mt-4 mx-5 p-4 border border-3 border-success rounded-4 shadow" style={{ width: "70rem" }}>
                <div className="border border-2 rounded-2">
                    <div className="d-flex w-100">
                        <Col xs={2} className="p-3 fw-bold text-center">Student ID</Col>
                        <Col xs={2} className="p-3 fw-bold text-center">Faculty Name</Col>
                        <Col xs={2} className="p-3 fw-bold text-center">Total Attendance</Col>
                        <Col xs={2} className="p-3 fw-bold text-center">Attendance %</Col>
                        <Col xs={2} className="p-3 fw-bold text-center">Total Classes</Col>
                    </div>
                    <hr className="text-black m-0" />
                    <div className="scrollable-container" style={{ height: '200px', overflowY: 'auto' }}>
                        {students.length > 0 ? (
                            students.map((student) => (
                                <div className="d-flex bg-light border-bottom" key={student.id}>
                                    <Col xs={2} className="p-3 text-center">{student.student_id}</Col>
                                    <Col xs={2} className="p-3 text-center">{student.faculty_name}</Col>
                                    <Col xs={2} className="p-3 text-center">{student.total_attendance}</Col>
                                    <Col xs={2} className="p-3 text-center">{student.att_percentage}%</Col>
                                    <Col xs={2} className="p-3 text-center">{student.total_classes}</Col>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-3">No attendance records available.</div>
                        )}
                    </div>
                </div>
            </div>
            <NotificationToast show={showToast} setShow={setShowToast} message={message} />
        </div>
    );
}

export default ViewAttendanceBody;
