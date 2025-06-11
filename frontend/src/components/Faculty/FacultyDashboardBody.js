import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Card from "react-bootstrap/Card";
import StudentImage from "../../assets/StudentImage.png";
import ManageProfileImage from "../../assets/ManageProfileImage.png";
import ManageAttendanceImage from "../../assets/ManageAttendanceImage.png";
import SalaryImage from "../../assets/SalaryImage.png";
import {jwtDecode} from "jwt-decode"; // Ensure this is correctly imported

function FacultyBody() {
    const [totalStudents, setTotalStudents] = useState(0);
    const [averageAttendance, setAverageAttendance] = useState(0);

    // useEffect(() => {
    //     // Decode the token once on component mount
    //     const token = localStorage.getItem("jwt");
    //     if (token) {
    //         const decodedToken = jwtDecode(token);
    //         setFacultyId(decodedToken);
    //     }
    // }, []);

    //     // Fetch attendance data only when facultyId is available
    //     const fetchAttendanceData = async () => {
    //         try {
    //             console.log("sending request!!")
    //             const response = await fetch(`https://server.ppfi.site/api/student/avg/${facultyId}`);
    //             const data = await response.json();
    //             setTotalStudents(data.totalStudents);
    //             setAverageAttendance(data.totalAttendance);
    //             console.log("all set!!")
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     };

    useEffect(() => {
        const fetchAttendanceData = async () => {
            const token = localStorage.getItem("jwt");
            if (!token) {
                console.error("Token not found!");
                return;
            }

            try {
                // Decode the token to extract facultyId
                const decodedToken = jwtDecode(token);
                const faculty_id = decodedToken.id; // Update this based on your token structure

                console.log("Sending request with facultyId!");

                const response = await fetch("https://server.ppfi.site/api/students/avg", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ faculty_id }),
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }

                const data = await response.json();
                setTotalStudents(data.totalStudents);
                setAverageAttendance(data.averageAttendance);
                console.log("Data fetched successfully!");
                console.log(totalStudents);
                console.log(averageAttendance);
            } catch (error) {
                console.error("Error fetching attendance data:", error);
            }
        };

        fetchAttendanceData(); // Invoke the fetch function
    }, [totalStudents, averageAttendance]); // Empty dependency array ensures it runs only once on mount


    return (
        <div className="d-flex justify-content-center">
            <div>
                <div className="d-flex mt-5 mx-5">
                    <Link
                        to={"/faculty/dashboard/manage-profile"}
                        data-mdb-tooltip-init
                        title="Click to edit your profile"
                        className="text-decoration-none"
                    >
                        <Card
                            className="m-3 p-4 shadow"
                            style={{ width: "18rem" }}
                            onMouseEnter={(e) => e.target.classList.add("shadow-lg")}
                            onMouseLeave={(e) => e.target.classList.remove("shadow-lg")}
                        >
                            <div className="d-flex">
                                <Card.Img
                                    className="p-0"
                                    variant="top"
                                    src={ManageProfileImage}
                                    style={{ width: "7rem", height: "7rem", borderRadius: "50%" }}
                                />
                                <Card.Body className="d-flex align-items-center">
                                    <div>
                                        <Card.Title>Profile</Card.Title>
                                    </div>
                                </Card.Body>
                            </div>
                        </Card>
                    </Link>

                    <Link
                        to={"/faculty/dashboard/manage-attendance"}
                        data-mdb-tooltip-init
                        title="Manage Attendance"
                        className="text-decoration-none"
                    >
                        <Card
                            className="m-3 p-4 shadow"
                            style={{ width: "18rem" }}
                            onMouseEnter={(e) => e.target.classList.add("shadow-lg")}
                            onMouseLeave={(e) => e.target.classList.remove("shadow-lg")}
                        >
                            <div className="d-flex">
                                <Card.Img
                                    className="p-0"
                                    variant="top"
                                    src={ManageAttendanceImage}
                                    style={{ width: "7rem", height: "7rem", borderRadius: "50%" }}
                                />
                                <Card.Body className="d-flex align-items-center">
                                    <div>
                                        <Card.Title>Attendance</Card.Title>
                                        <Card.Text>Average {averageAttendance}</Card.Text>
                                    </div>
                                </Card.Body>
                            </div>
                        </Card>
                    </Link>
                </div>

                <div className="d-flex mx-5">
                    <Link data-mdb-tooltip-init title="Current Salary" className="text-decoration-none">
                        <Card
                            className="m-3 p-4 shadow"
                            style={{ width: "18rem" }}
                            onMouseEnter={(e) => e.target.classList.add("shadow-lg")}
                            onMouseLeave={(e) => e.target.classList.remove("shadow-lg")}
                        >
                            <div className="d-flex">
                                <Card.Img
                                    className="p-0"
                                    variant="top"
                                    src={SalaryImage}
                                    style={{ width: "7rem", height: "7rem", borderRadius: "50%" }}
                                />
                                <Card.Body className="d-flex align-items-center">
                                    <div>
                                        <Card.Title>Salary</Card.Title>
                                        <Card.Text>400$</Card.Text>
                                    </div>
                                </Card.Body>
                            </div>
                        </Card>
                    </Link>

                    <Link
                        to={"/faculty/dashboard/view-students"}
                        data-mdb-tooltip-init
                        title="View Students"
                        className="text-decoration-none"
                    >
                        <Card
                            className="m-3 p-4 shadow"
                            style={{ width: "18rem" }}
                            onMouseEnter={(e) => e.target.classList.add("shadow-lg")}
                            onMouseLeave={(e) => e.target.classList.remove("shadow-lg")}
                        >
                            <div className="d-flex">
                                <Card.Img
                                    className="p-0"
                                    variant="top"
                                    src={StudentImage}
                                    style={{ width: "7rem", height: "7rem", borderRadius: "2%" }}
                                />
                                <Card.Body className="d-flex align-items-center">
                                    <div>
                                        <Card.Title>Students</Card.Title>
                                        <Card.Text>{totalStudents}</Card.Text>
                                    </div>
                                </Card.Body>
                            </div>
                        </Card>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default FacultyBody;
