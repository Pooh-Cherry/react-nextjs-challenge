import React, { useState, useEffect } from 'react'
import { Container, Row, Table, InputGroup, Pagination, Button, Modal, Form } from 'react-bootstrap'
import BounceLoader from 'react-spinners/BounceLoader'

import 'bootstrap/dist/css/bootstrap.min.css'
import searchIcon from './assets/imgs/search.png'

function App() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchKey, setSearchKey] = useState('')
  const [pageCount, setPageCount] = useState(0)
  const [activePage, setActivePage] = useState(1)

  const [updateModalVisible, setUpdateModalVisible] = useState(false)
  const [activeContact, setActiveContact] = useState({})
  const [refreshFlag, setRefreshFlag] = useState(false)

  const baseUri = "http://localhost:5000/contacts"

  useEffect(() => {
    let mounted = true
    const fetchData = async () => {
      const res = await fetch(`${baseUri}?page=${activePage}&search=${searchKey}`)
      const response = await res.json()
      if (mounted) {
        setLoading(false)
        setPageCount(response.last_page)
        setContacts(response.data)
      }
    }

    setLoading(true)
    fetchData()
    return () => mounted = false
  }, [activePage, searchKey, refreshFlag])

  const pagination = (pageSize, active) => {
    let items = [];
    for (let number = 1; number <= pageSize; number++) {
      items.push(
        <Pagination.Item key={number} active={number === active} onClick={() => setActivePage(number)}>
          {number}
        </Pagination.Item>,
      );
    }
    return items
  }

  const onClickSubmit = async () => {
    setLoading(true)

    const res = await fetch(`${baseUri}/${activeContact.id}`, {
      method: 'post',
      body: JSON.stringify({
        name: activeContact.name,
        phone: activeContact.phone
      })
    })
    const response = await res.json()
    console.log(response)
    setLoading(false)

    setUpdateModalVisible(false)
    setActiveContact({})
    setRefreshFlag(!refreshFlag)
  }

  const openUpdate = (contact) => {
    setActiveContact(contact)
    setUpdateModalVisible(true)
  }

  return (
    <>
      <Container>
        <Row className="d-flex justify-content-between align-items-center my-2">
          <div className="d-flex justify-content-start align-items-center">
            <h1 className="display-5 text-center mr-4">Contacts</h1>
            <BounceLoader size={24} loading={loading} />
          </div>
          <div className="d-flex align-items-center col-sm-4">
            <InputGroup className="rounded-circle" id="search-box">
              <InputGroup.Prepend>
                <InputGroup.Text id="searchIcon"><img src={searchIcon} alt="search" width="24" height="24" /></InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                id="input-search"
                type="text"
                className="text-center"
                placeholder="Search"
                value={searchKey}
                onChange = { (e) => {
                  setSearchKey(e.target.value)
                  setActivePage(1)
                }}
                />
            </InputGroup>
          </div>
        </Row>
        <Row>
          <Table striped hover id="tbl-contacts">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              { contacts.map((contact, id) => (
                  <tr key={id}>
                    <td>{ contact.id }</td>
                    <td>{ contact.name }</td>
                    <td>{ contact.phone }</td>
                    <td><Button variant="primary" size="sm" onClick={() => openUpdate(contact)} id={`btn-update-${contact.id}`}>Update</Button></td>
                  </tr>
                ))
              }
            </tbody>
          </Table>
        </Row>
        <Row className="d-flex justify-content-center mt-4">
          <Pagination>
            { pagination(pageCount, activePage) }
          </Pagination>
        </Row>
      </Container>

      <Modal show={updateModalVisible} onHide={() => setUpdateModalVisible(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update contact</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>ID: {activeContact.id}</Form.Label>
            </Form.Group>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Name" value={activeContact.name || ''} onChange={(e) => setActiveContact({...activeContact, name: e.target.value})}/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Phone</Form.Label>
              <Form.Control type="text" placeholder="Phone" value={activeContact.phone || ''} onChange={(e) => setActiveContact({...activeContact, phone: e.target.value})}/>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setUpdateModalVisible(false)}>Cancel</Button>
          <Button variant="primary" onClick={onClickSubmit} disabled={activeContact.name === '' || activeContact.phone === ''}>Submit</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default App;
