import { render, screen, queryByAttribute, fireEvent } from '@testing-library/react'
import faker from 'faker'
import App from './App'

function prepareMockData(count) {
  var data = []
  for(var i = 0; i < count; i++) {
    var contact = {
      name: faker.name.findName(),
      phone: faker.phone.phoneNumber(),
      id: i
    }
    data.push(contact)
  }
  return data
}
const pageData = prepareMockData(20)
const getById = queryByAttribute.bind(null, 'id')



describe('Contacts page', () => {
  test('should render title, search box and table component.', async () => {
    const dom = render(<App />)
    
    const titleElement = screen.getByText('Contacts')
    expect(titleElement).toBeInTheDocument()
  
    const searchElement = getById(dom.container, 'input-search')
    expect(searchElement).toBeInTheDocument()

    const tableElement = getById(dom.container, 'tbl-contacts')
    expect(tableElement).toBeInTheDocument()
  })
  
  describe('should render', () => {
    beforeEach(() => {
      global.fetch = window.fetch = jest.fn((req, res) => 
        Promise.resolve({
          json: () => Promise.resolve({
            total_count: 50,
            current_page: 1,
            per_page: 20,
            last_page: 3,
            data: pageData
          })
        })
      )
    })

    test('contents table and pagination.', async () => {
      const dom = render(<App />)
      expect(fetch).toBeCalled()

      expect(await dom.findByText(pageData[0].name)).toBeInTheDocument()
      expect(await dom.findByText(pageData[19].name)).toBeInTheDocument()

      const paginators = dom.container.querySelector('.pagination')
      expect(paginators).toBeInTheDocument()
  
      expect(document.querySelectorAll('.page-item').length).toBe(3)
      expect(document.querySelectorAll('.page-item')[0]).toHaveClass('active')
    })
  
    test('modal dialog if click update button.', async () => {
      const dom = render(<App />)
      expect(fetch).toBeCalled()

      const nameCell = await dom.findByText(pageData[0].name)
      expect(nameCell).toBeInTheDocument()

      const updateBtn = await document.getElementById('btn-update-0')
      expect(updateBtn).toBeInTheDocument()

      fireEvent.click(document.getElementById('btn-update-0'))
      expect(document.querySelector('.modal-dialog')).toBeVisible()
    })
  })
})
