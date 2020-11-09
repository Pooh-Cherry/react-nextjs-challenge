const BASE_URL = 'http://localhost:5000/contacts';
export default {
    list (params, cb, errCb) {
        fetch(BASE_URL + '?page=' + params.page + '&search=' + params.search)
        .then(response => response.json())
        .then((data) => {
            cb(data)
        })
        .catch((error) => {
            errCb(error)
        })
    },
    // create (params, cb, errCb) {

    // },
    update (id, params, cb, errCb) {
        fetch(BASE_URL + '/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
        .then(response => response.json())
        .then((data) => {
            cb(data)
        })
        .catch((error) => {
            errCb(error)
        })
    },
    // delete (params, cb, errCb) {
        
    // }
}