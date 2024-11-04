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

  useEffect(() => {
    fetchAllFees()
  }, [])

  const showAlert = (variant, message) => {
    setAlert({ show: true, variant, message })
    setTimeout(() => setAlert({ show: false, variant: '', message: '' }), 3000)
  }

  const fetchAllFees = async () => {
    try {
      const response = await fetch('api/fee/Fee')
      if (!response.ok) throw new Error('Failed to fetch fees')
      const data = await response.json()
      setFees(data)
    } catch (error) {
      showAlert('danger', 'Failed to fetch fees')
    }
  }

  const handleSearch = async () => {
    try {
      const response = await fetch(`api/fee/${searchTerm}`)
      if (!response.ok) throw new Error('Failed to fetch fee')
      const data = await response.json()
      setFees([data])
    } catch (error) {
      showAlert('danger', 'Failed to fetch fee')
    }
  }

  const handleCreateOrUpdateFee = async (e) => {
    e.preventDefault()
    try {
      const url = studentId ? `api/fee/update/${studentId}` : 'api/fee/create-fee'
      const method = studentId ? 'PUT' : 'POST'
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, amount: Number(amount) })
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

  const handleAddFeeForAll = async (reason, amount) => {
    try {
        const response = await fetch('/api/fee/AddFee', {
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
      const response = await fetch(`api/fee/delete/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete fee')
      showAlert('success', 'Fee deleted successfully')
      fetchAllFees()
    } catch (error) {
      showAlert('danger', 'Failed to delete fee')
    }
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
          <Card.Header>Create/Update Fee</Card.Header>
          <Card.Body>
            <Form onSubmit={handleCreateOrUpdateFee}>
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

       <Card className="mb-4">
         <Card.Header>Add Fee for all students</Card.Header>
         <Card.Body>
           <Form onSubmit={handleCreateOrUpdateFee}>
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

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Reason</th>
          </tr>
        </thead>
        <tbody>
          {fees.map((fee) => (
            <tr key={fee.student_id}>
              <td>{fee.amount}</td>
              <td>{fee.created_at}</td>
              <td>{fee.reason}</td>
              <td>
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => handleDeleteFee(fee.student.id)}
                >
                  Delete
                </Button>
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