import React, { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { Col } from 'react-bootstrap';
import Card from "react-bootstrap/Card";
import NotificationToast from '../NotificationToast';
import StudentFeesImage from "../../assets/StudentFeesImage.png";

function ViewFeeDetails() {
    const [fees, setFees] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [message, setMessage] = useState('');
    const [totalFees, setTotalFees] = useState(20000);

    const handleShowToast = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const isPending = (createdAt) => {
        const createdDate = new Date(createdAt);
        const today = new Date();
        const timeDiff = today - createdDate;
        const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
        return dayDiff > 10;
    };

    const calculateLastPayDate = (createdAt) => {
        const createdDate = new Date(createdAt);
        createdDate.setDate(createdDate.getDate() + 10); // Add 10 days
        return createdDate.toLocaleDateString();
    };

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("jwt");

            if (token) {
                const decodedToken = jwtDecode(token);
                const id = decodedToken.id;
                try {
                    const response = await fetch(`https://college-erp-3sin.onrender.com/api/fee/${id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    });
                    if (response.ok) {
                        const feeData = await response.json();
                        // const totalFeeAmount = feeData.reduce((total, fee) => total + fee.amount, 0);

                        const totalFeeAmount = feeData.reduce((total, fee) => {
                            return total + parseFloat(fee.amount); // Convert fee.amount to float and sum
                        }, 0);

                        setTotalFees(totalFeeAmount);

                        if (feeData.length === 0) {
                            setMessage("No fee records found.");
                            handleShowToast();
                            return;
                        }

                        setFees(feeData);
                    } else {
                        setMessage('Failed to fetch fee data');
                        handleShowToast();
                    }
                } catch (error) {
                    setMessage("Something went wrong");
                    handleShowToast();
                    console.error('Error fetching fee data:', error);
                }
            }
        };
        fetchData();
    }, []);

    return (
        <div className="d-flex flex-column align-items-center">
            {/* Total Fees Card */}
            <div className="d-flex mx-5 justify-content-center">
                <Card className="m-3 p-3 shadow align-items-center pe-auto" style={{ width: "28rem" }}>
                    <Card.Img
                        variant="top"
                        src={StudentFeesImage}
                        style={{ width: "5rem", height: "5rem" }}
                    />
                    <Card.Body className="text-center">
                        <Card.Title>Total Fees</Card.Title>
                        <Card.Text>{totalFees !== null ? `${totalFees}` : 'No Data'}</Card.Text>
                    </Card.Body>
                </Card>
            </div>

            {/* Fee Details */}
            <div className="mt-4 mx-5 p-4 border border-3 border-success rounded-4 shadow" style={{ width: "70rem" }}>
                <div className="border border-2 rounded-2">
                    <div className="d-flex w-100">
                        <Col xs={2} className="p-3 fw-bold text-center">Student ID</Col>
                        <Col xs={3} className="p-3 fw-bold text-center">Email</Col>
                        <Col xs={3} className="p-3 fw-bold text-center">Reason</Col>
                        <Col xs={2} className="p-3 fw-bold text-center">Amount</Col>
                        <Col xs={2} className="p-3 fw-bold text-center">Status/Last date</Col>
                    </div>
                    <hr className="text-black m-0" />
                    <div className="scrollable-container" style={{ height: '200px', overflowY: 'auto' }}>
                        {fees.length > 0 ? (
                            fees.map((fee) => (
                                <div className="d-flex bg-light border-bottom" key={fee.id}>
                                    <Col xs={2} className="p-3 text-center">{fee.student_id}</Col>
                                    <Col xs={3} className="p-3 text-center">{fee.student_email}</Col>
                                    <Col xs={3} className="p-3 text-center">{fee.reason}</Col>
                                    <Col xs={2} className="p-3 text-center">{fee.amount}</Col>
                                    <Col xs={2} className="p-3 text-center">
                                        {isPending(fee.created_at) ? (
                                            <span style={{ color: 'red' }}>Pending</span>
                                        ) : (
                                            <span>{calculateLastPayDate(fee.created_at)}</span>
                                        )}
                                    </Col>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-3">No fee records available.</div>
                        )}
                    </div>
                </div>
            </div>
            <NotificationToast show={showToast} setShow={setShowToast} message={message} />
        </div>
    );
}

export default ViewFeeDetails;
