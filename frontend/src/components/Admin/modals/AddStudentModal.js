import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';

function AddStudentModal({ show, handleClose, setMessage, handleShowToast }) {
    const [validated, setValidated] = useState(false);
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [enrollmentYear, setEnrollmentYear] = useState(null);
    const [branch, setBranch] = useState(null);
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState([]);

    const handleNameChange = (e) => setName(e.target.value);
    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handleEnrollmentYearChange = (e) => setEnrollmentYear(e.target.value);
    const handleBranchChange = (e) => setBranch(e.target.value);
    
    const handleCourseChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setSelectedCourses(selectedOptions);
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await fetch("https://server.ppfi.site/api/courses");
            if (!response.ok) throw new Error('Failed to fetch courses');
            const data = await response.json();
            console.log(data);
            setCourses(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
            setValidated(true);
            return;
        }

        setLoading(true);
        console.log({ name, email, password, selectedCourses, enrollmentYear, branch });
        const response = await fetch("https://server.ppfi.site/api/students/", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name, email, password, courses: selectedCourses, 
                enrollmentYear, branch
            })
        });
        setLoading(false);

        if (!response.ok) {
            setMessage("Failed to add student: Email already exists");
            handleShowToast();
            handleClose();
        } else {
            setMessage("Student added successfully");
            handleShowToast();
            handleClose();
        }
        setValidated(false);
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Student</Modal.Title>
            </Modal.Header>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Modal.Body className='px-5 py-4'>
                    <Row className="mb-3">
                        <Form.Group as={Col} md="6">
                            <Form.Label style={{ color: 'black' }}>Full name</Form.Label>
                            <Form.Control
                                required type="text"
                                placeholder="Enter student's name"
                                onChange={handleNameChange}
                            />
                        </Form.Group>
                        <Form.Group as={Col} md="6">
                            <Form.Label style={{ color: 'black' }}>Email</Form.Label>
                            <Form.Control
                                type="email" required
                                placeholder="Enter student's email address"
                                onChange={handleEmailChange}
                            />
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} md="6">
                            <Form.Label style={{ color: 'black' }}>Password</Form.Label>
                            <Form.Control
                                type="password" required
                                placeholder="Enter student's password"
                                onChange={handlePasswordChange}
                            />
                        </Form.Group>
                        <Form.Group as={Col} md="6">
                            <Form.Label style={{ color: 'black' }}>Enrollment Year</Form.Label>
                            <Form.Control
                                type="number" required
                                placeholder="Enter enrollment year (e.g., 2022)"
                                onChange={handleEnrollmentYearChange}
                            />
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} md="6">
                            <Form.Label style={{ color: 'black' }}>Branch</Form.Label>
                            <Form.Select required onChange={handleBranchChange}>
                                <option value="">Select branch...</option>
                                <option value="CSE">CSE</option>
                                <option value="ECE">ECE</option>
                                {/* Add other branches as needed */}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group as={Col} md="6">
                            <Form.Label style={{ color: 'black' }}>Courses</Form.Label>
                            <Form.Select
                                multiple required
                                onChange={handleCourseChange}
                            >
                                {courses.map(course => (
                                    <option key={course.id} value={course.course_code}>{course.course_name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                    <Button variant="success" type="submit">
                        {loading ? <Spinner animation="border" size="sm" /> : 'Add Student'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default AddStudentModal;
