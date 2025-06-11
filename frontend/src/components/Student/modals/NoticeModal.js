import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

function NoticeModal({ show, handleClose }) {
    const [notice, setNotice] = useState([]); // Initialize as an empty array

    const fetchNotice = async () => {
        try {
            const response = await fetch("https://college-erp-3sin.onrender.com/api/notice");
            const data = await response.json();

            // Ensure 'data' is an array
            if(data != null || data != undefined || data.length !== 0){
                setNotice(data);}
                else{
                    setNotice([]);
                }

            if (!response.ok) {
                handleClose();
            }
        } catch (error) {
            console.error(error);
            setNotice([]); // Set to empty array on error as well
        }
    }

    useEffect(() => {
        fetchNotice();
    }, []); // Add dependency array to run effect only once on mount

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title className="px-2">Notice</Modal.Title>
            </Modal.Header>
            <Modal.Body className='p-4 mb-3'>
                <div className='mt-3 border border-2 rounded-2 '>
                    <div className="d-flex w-100">
                        <Col xs={8} className="p-3 px-4 fw-bold">Notice Description</Col>
                        <Col xs={4} className="p-3 px-2 fw-bold">Notice Title</Col>
                    </div>
                    <hr className="text-black m-0" />
                    <div className="scrollable-container" style={{ height: '250px', overflowY: 'auto' }}>
                        {notice.length === 0 ? ( // Check for empty notices
                            <p className="text-center">No notices available</p>
                        ) : (
                            notice
                                .sort((a, b) => b.id - a.id)
                                .map(notice => (
                                    <div
                                        className='d-flex bg-hover-div'
                                        key={notice.id}
                                        role='button'
                                    >
                                        <Row className="w-100">
                                            <Col xs={8} className="p-4">
                                                <p className="px-3 mb-0 fw-bold" style={{ overflow: 'auto', whiteSpace: 'nowrap' }}>{notice.noticedescription}</p>
                                            </Col>

                                            <Col xs={4} className="p-4">
                                                <p className="mb-0 text-muted" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{notice.noticetitle}</p>
                                            </Col>
                                        </Row>
                                    </div>
                                ))
                        )}
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default NoticeModal;
