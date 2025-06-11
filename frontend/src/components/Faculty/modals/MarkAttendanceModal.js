import { useState, useEffect } from 'react';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import { jwtDecode } from 'jwt-decode';

function MarkAttendanceModal({ show, handleClose, students, totalAttendance, setMessage, handleShowToast }) {
    const [loading, setLoading] = useState(false);
    const [searchEmail, setSearchEmail] = useState('');
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]); 
    const [facultyId, setFacultyId] = useState('');

    useEffect(() => {
        const token = localStorage.getItem("jwt");
    
        if (token) {
            const decodedToken = jwtDecode(token);
            setFacultyId(decodedToken.id);
        }
    }, []);

    const handleSearchChange = (e) => {
        setSearchEmail(e.target.value);
    };

    const handleCheckboxChange = (studentId) => {
        setSelectedStudents((prevSelected) => {
            if (prevSelected.includes(studentId)) {
                return prevSelected.filter((id) => id !== studentId);
            } else {
                return [...prevSelected, studentId];
            }
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`https://server.ppfi.site/api/students/update-attendance`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    faculty_id: facultyId, // Replace facultyId with the actual value
                    student_ids: selectedStudents, // Array of student IDs
                }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to update attendance');
            }

            setMessage("Attendance marked successfully");
            handleShowToast();
            setSelectedStudents([]);
            setLoading(false);
            handleClose();
        } catch (error) {
            console.error(error);
            setMessage("failed to update attendance");
            handleShowToast();
            setLoading(false);
            handleClose();
        }
    };

    useEffect(() => {
        const filtered = students.filter(student => student.email.includes(searchEmail));
        setFilteredStudents(filtered.map(student => ({
            ...student,
        })));
    }, [searchEmail, students]);

    return (
        <Modal show={show} onHide={handleClose} size="xl"> {/* Increased Modal Size */}
            <Modal.Header closeButton>
                <Modal.Title>Mark Attendance</Modal.Title>
            </Modal.Header>
            <Form noValidate onSubmit={handleSubmit}>
                <Modal.Body className='px-4 py-4'> {/* Increased padding for larger modal */}
                    <div className="m-3 p-5">
                        <Form>
                            <Form.Group controlId="searchEmail">
                                <Form.Label>Search by Email</Form.Label>
                                <div className="input-group">
                                    <Form.Control
                                        className='form-control-lg' 
                                        type="email"
                                        placeholder="Enter student's email"
                                        value={searchEmail}
                                        onChange={handleSearchChange}
                                    />
                                    <button className="btn btn-success" type="button">Search</button>
                                </div>
                            </Form.Group>
                        </Form>
                        <div className="lg-3 border border-2 rounded-2 scrollable-container" style={{ height: "45rem", overflowY: 'auto' }}> 
    <div className="d-flex w-100 border-bottom">
        <Col xs={1} className="p-3 fw-bold">Select</Col>
        <Col xs={4} className="p-3 fw-bold">Name</Col>
        <Col xs={4} className="p-3 fw-bold">Email</Col>
        <Col xs={3} className="p-3 fw-bold">Attendance %</Col>
    </div>
    {filteredStudents
        .sort((a, b) => a.email.localeCompare(b.email))
        .map(student => (
            <div
                className={`d-flex bg-hover-div ${selectedStudents.includes(student.student_id)}`} 
                key={student.student_id}
                role='button'
            >
                <Row className="w-100" onClick={() => handleCheckboxChange(student.student_id)}>
                    <Col xs={1} className="pt-4">
                        <Form.Check
                            className='px-3'
                            type="checkbox"
                            id={student.student_id}
                            onChange={() => handleCheckboxChange(student.student_id)}
                            checked={selectedStudents.includes(student.student_id)}
                            style={{ backgroundColor: selectedStudents.includes(student.student_id) ? '#28a745' : 'transparent' }} 
                        ></Form.Check>
                    </Col>
                    <Col xs={4} className="p-4">
                        <p className="px-3 mb-0 fw-bold" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{student.name}</p>
                    </Col>
                    <Col xs={4} className="pt-3">
                        <p className="mb-0 text-muted overflow-auto">{student.email}</p>
                    </Col>
                    <Col xs={3} className="pt-3">
                        <p className="mb-0 text-muted overflow-auto">{student.att_percentage}</p>
                    </Col>
                </Row>
            </div>
        ))}
</div>

                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="success" type="submit" disabled={loading}>
                        {loading ? <Spinner animation="border" size="sm" /> : 'Mark Attendance'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default MarkAttendanceModal;
