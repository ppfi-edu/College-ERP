import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import ViewAttendanceImage from "../../assets/ManageAttendanceImage.png";
import ManageProfileImage from "../../assets/ManageProfileImage.png";
import NoticeImage from "../../assets/NoticeImage.png";
import StudentFeesImage from "../../assets/StudentFeesImage.png";
import NoticeModal from "./modals/NoticeModal";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";



function StudentDashboardBody() {
    const [showNoticeModal, setShowNoticeModal] = useState(false);

    const handleShowNoticeModal = () => {setShowNoticeModal(true);};
    const handleCloseNoticeModal = () => {setShowNoticeModal(false);};
    const [totalFee, setTotalFee] = useState(0);
    const [showToast, setShowToast] = useState(false);
    const [averageAttendance, setAttendance] = useState(0);
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
                    const response = await fetch(`http://localhost:5173/api/students/attendance`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ id })
                    });
                    if (response.ok) {
                        const studentData = await response.json();

                        if (studentData.length === 0) {
                            return;
                        }

                        const totalAttendance = studentData.reduce((acc, curr) => acc + curr.att_percentage, 0);

                        const averageAttendance = studentData.length > 1 
                            ? (totalAttendance / studentData.length).toFixed(2) 
                            : studentData[0].att_percentage;

                        setAttendance(averageAttendance);

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



useEffect(() => {
    const fetchTotalFee = async () => {
        const token = localStorage.getItem("jwt");
        try {
        if (token) {
        const decodedToken = jwtDecode(token);
        const  id  = decodedToken.id;
          const response = await fetch('http://localhost:5173/api/fee/getFee', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ student_id: id })
          });
          if (!response.ok) throw new Error('Failed to fetch fee');
          const data = await response.json();
          console.log(data);
          if(data.sum === null){
            setTotalFee(20000);
            }else{
          setTotalFee(data.sum);
            }
        }
      }
        catch (error) {
            console.error(error);
        }
    };
    fetchTotalFee();
}, [totalFee]);

    return (
        <div className="d-flex flex-column align-items-center justify-content-center">
            <div className="d-flex flex-wrap justify-content-center mt-3 mx-5">
                <Link
                    to={"/student/dashboard/manage-profile"}
                    data-mdb-tooltip-init
                    title="Click to edit your profile"
                    className="text-decoration-none"
                >
                    <Card
                        className="m-3 p-4 shadow rounded-4 border-0"
                        style={{ width: "18rem", transition: "transform 0.3s, box-shadow 0.3s" }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.05)";
                            e.currentTarget.style.boxShadow = "0 0 15px rgba(0, 0, 0, 0.2)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)";
                        }}
                    >
                        <div className="d-flex align-items-center">
                            <Card.Img
                                className="rounded-circle"
                                variant="top"
                                src={ManageProfileImage}
                                style={{ width: "7rem", height: "7rem" }}
                            />
                            <Card.Body className="d-flex flex-column align-items-center">
                                <Card.Title>Profile</Card.Title>
                            </Card.Body>
                        </div>
                    </Card>
                </Link>

                <Link
                    to={"/student/dashboard/view-attendance"}
                    data-mdb-tooltip-init
                    title="View Attendance"
                    className="text-decoration-none"
                >
                    <Card
                        className="m-3 p-4 shadow rounded-4 border-0"
                        style={{ width: "18rem", transition: "transform 0.3s, box-shadow 0.3s" }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.05)";
                            e.currentTarget.style.boxShadow = "0 0 15px rgba(0, 0, 0, 0.2)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)";
                        }}
                    >
                        <div className="d-flex align-items-center">
                            <Card.Img
                                className="rounded-circle"
                                variant="top"
                                src={ViewAttendanceImage}
                                style={{ width: "7rem", height: "7rem" }}
                            />
                            <Card.Body className="d-flex flex-column align-items-center">
                                <Card.Title>Average Attendance</Card.Title>
                                <Card.Text>{averageAttendance}%</Card.Text>
                            </Card.Body>
                        </div>
                    </Card>
                </Link>

                <Link
                    data-mdb-tooltip-init
                    title="Current Fees"
                    className="text-decoration-none"
                >
                    <Card
                        className="m-3 p-4 shadow rounded-4 border-0"
                        style={{ width: "18rem", transition: "transform 0.3s, box-shadow 0.3s" }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.05)";
                            e.currentTarget.style.boxShadow = "0 0 15px rgba(0, 0, 0, 0.2)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)";
                        }}
                    >
                        <div className="d-flex align-items-center">
                            <Card.Img
                                className="rounded-circle"
                                variant="top"
                                src={StudentFeesImage}
                                style={{ width: "7rem", height: "7rem" }}
                            />
                            <Card.Body className="d-flex flex-column align-items-center">
                                <Card.Title>Fees</Card.Title>
                                <Card.Text> {totalFee}</Card.Text>
            
                            </Card.Body>
                        </div>
                    </Card>
                </Link>

                <Card
                    className="m-3 p-4 shadow rounded-4 border-0"
                    style={{ width: "18rem", transition: "transform 0.3s, box-shadow 0.3s" }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.05)";
                        e.currentTarget.style.boxShadow = "0 0 15px rgba(0, 0, 0, 0.2)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)";
                    }}
                    onClick={handleShowNoticeModal}
                    role="button"
                >
                    <div className="d-flex align-items-center">
                        <Card.Img
                            className="rounded-circle"
                            variant="top"
                            src={NoticeImage}
                            style={{ width: "7rem", height: "7rem" }}
                        />
                        <Card.Body className="d-flex flex-column align-items-center">
                            <Card.Title>Notices</Card.Title>
                        </Card.Body>
                    </div>
                </Card>
            </div>

            <NoticeModal show={showNoticeModal} handleClose={handleCloseNoticeModal} />
        </div>
    );
}

export default StudentDashboardBody;
