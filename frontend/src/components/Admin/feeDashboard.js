import { useState, useEffect } from 'react'
import { Container, Row, Col, Form, Button, Table, Card, Alert } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import Sidebar from './AdminSideBar'

export default function FeeManagementSystem() {
  const [fees, setFees] = useState([])
  const [studentId, setStudentId] = useState('')
  const [amount, setAmount] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [reason, setReason] = useState('')
  const [alert, setAlert] = useState({ show: false, variant: '', message: '' })
  const [student_email, setStudent_email] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editedAmount, setEditedAmount] = useState('')
  const [editedReason, setEditedReason] = useState('')

  useEffect(() => {
    fetchAllFees()
  }, [])

  const showAlert = (variant, message) => {
    setAlert({ show: true, variant, message })
    setTimeout(() => setAlert({ show: false, variant: '', message: '' }), 3000)
  }

  const fetchAllFees = async () => {
    try {
        console.log("Fetching all fees")
      const response = await fetch('https://college-erp-3sin.onrender.com/api/fee/Fee')
      if (!response.ok) throw new Error('Failed to fetch fees')
      const data = await response.json()
      setFees(data)
      console.log(data)
    } catch (error) {
      showAlert('danger', 'Failed to fetch fees')
    }
  }

  const handleSearch = async () => {
    try {
      const response = await fetch(`https://college-erp-3sin.onrender.com/api/fee/${searchTerm}`)
      if (!response.ok) throw new Error('Failed to fetch fee')
      const data = await response.json()
      setFees([data])
    } catch (error) {
      showAlert('danger', 'Failed to fetch fee')
    }
  }

  const handleCreateFee = async (e) => {
    e.preventDefault()
    try {
        console.log("Creating fee")
        console.log("student_email : ", student_email);
      const url = 'https://college-erp-3sin.onrender.com/api/fee/create-fee'
      const method = 'POST'
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, student_email : student_email, amount: Number(amount), reason : reason })
      })
      if (!response.ok) throw new Error('Failed to create/update fee')
      showAlert('success', `Fee ${studentId ? 'updated' : 'created'} successfully`)
      fetchAllFees()
      setStudentId('')
      setAmount('')
    } catch (error) {
      showAlert('danger', `Failed to ${studentId ? 'update' : 'create'} fee`)
    }
  }

  const handleUpdateFee = async (id) => {
    try {
        const url = `https://college-erp-3sin.onrender.com/api/fee/update`
        const method = 'PUT'
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: Number(editedAmount), reason: editedReason, id })
        })
        if (!response.ok) throw new Error('Failed to update fee')
        showAlert('success', 'Fee updated successfully')
        fetchAllFees()
        setStudentId('')
        setAmount('')
    } catch (error) {
        showAlert('danger', 'Failed to update fee')
    }
}

  const handleAddFeeForAll = async (reason, amount) => {
    try {
        const response = await fetch('https://college-erp-3sin.onrender.com/api/fee/AddFee', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ reason, amount })
        });
        if (!response.ok) throw new Error('Failed to add fee for all students');
        showAlert('success', 'Fee added for all students');
        fetchAllFees();
    } catch (error) {
        showAlert('danger', 'Failed to add fee for all students');
    }
};

const handleDeleteFee = async (id) => {
    try {
        const response = await fetch(`https://college-erp-3sin.onrender.com/api/fee/delete/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete fee');
        showAlert('success', 'Fee deleted successfully');
        fetchAllFees();
    } catch (error) {
        showAlert('danger', 'Failed to delete fee');
    }
};

  const handleEdit = (fee) => {
    setEditingId(fee.id)
    setEditedAmount(fee.amount.toString())
    setEditedReason(fee.reason)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditedAmount('')
    setEditedReason('')
  }


  return (
    <div className="d-flex">
    <Sidebar />
    <div className="flex-grow-1">
      <Container className="mt-4">
        <h1 className="mb-4">College Fee Management System</h1>
        
        {alert.show && (
          <Alert variant={alert.variant}>
            {alert.message}
          </Alert>
        )}

        <Card className="mb-4">
          <Card.Header>Search Fee</Card.Header>
          <Card.Body>
            <Form className="d-flex">
              <Form.Control 
                type="text"
                placeholder="Enter student ID or email" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                className="me-2"
              />
              <Button variant="primary" onClick={handleSearch}>Search</Button>
            </Form>
          </Card.Body>
        </Card>

        <Card className="mb-4">
          <Card.Header>Add a new fee for a student</Card.Header>
          <Card.Body>
            <Form onSubmit={handleCreateFee}>
              <Row className="align-items-end">
                <Col>
                  <Form.Group>
                    <Form.Label>Student ID</Form.Label>
                    <Form.Control 
                      type="text"
                      value={studentId} 
                      onChange={(e) => setStudentId(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Student Email</Form.Label>
                    <Form.Control 
                      type="text"
                      value={student_email} 
                      onChange={(e) => setStudent_email(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Amount</Form.Label>
                    <Form.Control 
                      type="number" 
                      value={amount} 
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Reason</Form.Label>
                    <Form.Control 
                      type="text"
                      value={reason} 
                      onChange={(e) => setReason(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Button type="submit" variant="primary">
                    {'Create'} Fee
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>

       <Card className="mb-4">
         <Card.Header>Add Fee for all students</Card.Header>
         <Card.Body>
           <Form onSubmit={handleAddFeeForAll}>
             <Row className="align-items-end">
               <Col>
                 <Form.Group>
                   <Form.Label>Reason</Form.Label>
                   <Form.Control 
                    type="text"
                    value={reason} 
                    onChange={(e) => setReason(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Amount</Form.Label>
                  <Form.Control 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Button type="submit" variant="primary">
                  {studentId ? 'Update' : 'Create'} Fee
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <Button variant="secondary" onClick={fetchAllFees} className="mb-4">
            Fetch all fees
    </Button>


    <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Reason</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
            {fees.map((fee) => (
                    <tr key={fee.id}>
                        <td>{fee.student_id}</td>
                        <td>
                        {editingId === fee.id ? (
                            <Form.Control
                            type="number"
                            value={editedAmount}
                            onChange={(e) => setEditedAmount(e.target.value)}
                            />
                        ) : (
                            <span onClick={() => handleEdit(fee)}>{fee.amount}</span>
                        )}
                        </td>
                        <td>{fee.created_at}</td>
                        <td>
                        {editingId === fee.id ? (
                            <Form.Control
                            type="text"
                            value={editedReason}
                            onChange={(e) => setEditedReason(e.target.value)}
                            />
                        ) : (
                            <span onClick={() => handleEdit(fee)}>{fee.reason}</span>
                        )}
                        </td>
                        <td>
                        {editingId === fee.id ? (
                            <>
                            <Button 
                                variant="success" 
                                size="sm"
                                onClick={() => handleUpdateFee(fee.id)} // Use database id here
                                className="me-2"
                            >
                                Save
                            </Button>
                            <Button 
                                variant="secondary" 
                                size="sm"
                                onClick={handleCancelEdit}
                            >
                                Cancel
                            </Button>
                            </>
                        ) : (
                            <>
                            <Button 
                                variant="primary" 
                                size="sm"
                                onClick={() => handleEdit(fee)}
                                className="me-2"
                            >
                                Edit
                            </Button>
                            <Button 
                                variant="danger" 
                                size="sm"
                                onClick={() => handleDeleteFee(fee.id)} // Use database id here
                            >
                                Delete
                            </Button>
                            </>
                        )}
                        </td>
                    </tr>
                    ))}

            </tbody>
          </Table>
      </Container>
    </div>
  </div>
)
}