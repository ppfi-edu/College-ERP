import React, { useState, useEffect } from 'react'
import { Container, Table, Button, Form, Alert, Modal } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import Sidebar from './AdminSideBar'


export default function LibraryManagementSystem() {
  const [books, setBooks] = useState([])
  const [alert, setAlert] = useState({ show: false, variant: '', message: '' })
  const [showAddModal, setShowAddModal] = useState(false)
  const [showIssueModal, setShowIssueModal] = useState(false)
  const [showReturnModal, setShowReturnModal] = useState(false)
  const [newBook, setNewBook] = useState({ book_name: '', book_id: '', topic: '', author_name: '' })
  const [issueBook, setIssueBook] = useState({ id: '', issued_to: '', issued_date: '', issued_return_date: '' })
  const [returnBook, setReturnBook] = useState({ id: '' })
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchAllBooks()
  }, [])

  const showAlert = (variant, message) => {
    setAlert({ show: true, variant, message })
    setTimeout(() => setAlert({ show: false, variant: '', message: '' }), 3000)
  }

  const fetchAllBooks = async () => {
    try {
      const response = await fetch('https://college-erp-3sin.onrender.com/api/lib')
      if (!response.ok) throw new Error('Failed to fetch books')
      const data = await response.json()
      setBooks(data)
    } catch (error) {
      showAlert('danger', 'Failed to fetch books')
    }
  }

  const handleAddBook = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('https://college-erp-3sin.onrender.com/api/lib/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBook)
      })
      if (!response.ok) throw new Error('Failed to add book')
      showAlert('success', 'Book added successfully')
      setShowAddModal(false)
      setNewBook({ book_name: '', book_id: '', topic: '', author_name: '' })
      fetchAllBooks()
    } catch (error) {
      showAlert('danger', 'Failed to add book')
    }
  }

  const handleIssueBook = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`https://college-erp-3sin.onrender.com/api/lib/IssueBook/${issueBook.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(issueBook)
      })
      if (!response.ok) throw new Error('Failed to issue book')
      showAlert('success', 'Book issued successfully')
      setShowIssueModal(false)
      setIssueBook({ id: '', issued_to: '', issued_date: '', issued_return_date: '' })
      fetchAllBooks()
    } catch (error) {
      showAlert('danger', 'Failed to issue book')
    }
  }

  const handleReturnBook = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`https://college-erp-3sin.onrender.com/api/lib/return/${returnBook.id}`, {
        method: 'POST'
      })
      if (!response.ok) throw new Error('Failed to return book')
      const data = await response.json()
      showAlert('success', `Book returned successfully. ${data.lateFee > 0 ? `Late fee: $${data.lateFee}` : ''}`)
      setShowReturnModal(false)
      setReturnBook({ id: '' })
      fetchAllBooks()
    } catch (error) {
      showAlert('danger', 'Failed to return book')
    }
  }

  const handleDeleteBook = async (id) => {
    try {
      const response = await fetch(`https://college-erp-3sin.onrender.com/api/lib/remove/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete book')
      showAlert('success', 'Book deleted successfully')
      fetchAllBooks()
    } catch (error) {
      showAlert('danger', 'Failed to delete book')
    }
  }

// useEffect(() => {
    const filteredBooks = books.filter(book => 
        book.book_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.book_id.toLowerCase().includes(searchTerm.toLowerCase())
    )
//     setBooks(filteredBooks)
// }, [searchTerm, books])

  return (
    <div className="d-flex">
    <Sidebar />
    <div className="flex-grow-1">
      <Container className="mt-4">
        <h1 className="mb-4">Library Management System</h1>
        <Form className="mb-4">
          <Form.Group controlId="searchBook">
            <Form.Control
              type="text"
              placeholder="Search by book name or ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>
        </Form>
        {alert.show && (
          <Alert variant={alert.variant}>
            {alert.message}
          </Alert>
        )}

          <Button variant="primary" onClick={() => setShowAddModal(true)} className="mb-3">
            Add New Book
          </Button>

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Book Name</th>
                <th>Book ID</th>
                <th>Topic</th>
                <th>Author</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book) => (
                <tr key={book.id}>
                  <td>{book.book_name}</td>
                  <td>{book.book_id}</td>
                  <td>{book.topic}</td>
                  <td>{book.author_name}</td>
                  <td>{book.issued ? `Issued to ${book.issued_to}` : 'Available'}</td>
                  <td>
                    {!book.issued && (
                      <>
                        <Button 
                          variant="primary" 
                          size="sm" 
                          onClick={() => {
                            setIssueBook({ ...issueBook, id: book.id.toString() })
                            setShowIssueModal(true)
                          }}
                          className="me-2"
                        >
                          Issue
                        </Button>
                        <Button 
                          variant="danger" 
                          size="sm"
                          onClick={() => handleDeleteBook(book.id)}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                    {book.issued && (
                      <Button 
                        variant="success" 
                        size="sm"
                        onClick={() => {
                          setReturnBook({ id: book.id.toString() })
                          setShowReturnModal(true)
                        }}
                      >
                        Return
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Add Book Modal */}
          <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Add New Book</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleAddBook}>
                <Form.Group className="mb-3">
                  <Form.Label>Book Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={newBook.book_name} 
                    onChange={(e) => setNewBook({...newBook, book_name: e.target.value})}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Book ID</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={newBook.book_id} 
                    onChange={(e) => setNewBook({...newBook, book_id: e.target.value})}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Topic</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={newBook.topic} 
                    onChange={(e) => setNewBook({...newBook, topic: e.target.value})}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Author Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={newBook.author_name} 
                    onChange={(e) => setNewBook({...newBook, author_name: e.target.value})}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Add Book
                </Button>
              </Form>
            </Modal.Body>
          </Modal>

          {/* Issue Book Modal */}
          <Modal show={showIssueModal} onHide={() => setShowIssueModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Issue Book</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleIssueBook}>
                <Form.Group className="mb-3">
                  <Form.Label>Issued To</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={issueBook.issued_to} 
                    onChange={(e) => setIssueBook({...issueBook, issued_to: e.target.value})}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Issue Date</Form.Label>
                  <Form.Control 
                    type="date" 
                    value={issueBook.issued_date} 
                    onChange={(e) => setIssueBook({...issueBook, issued_date: e.target.value})}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Return Date</Form.Label>
                  <Form.Control 
                    type="date" 
                    value={issueBook.issued_return_date} 
                    onChange={(e) => setIssueBook({...issueBook, issued_return_date: e.target.value})}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Issue Book
                </Button>
              </Form>
            </Modal.Body>
          </Modal>

          {/* Return Book Modal */}
          <Modal show={showReturnModal} onHide={() => setShowReturnModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Return Book</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Are you sure you want to return this book?</p>
              <Button variant="primary" onClick={handleReturnBook}>
                Confirm Return
              </Button>
            </Modal.Body>
          </Modal>
        </Container>
      </div>
    </div>
  )
}