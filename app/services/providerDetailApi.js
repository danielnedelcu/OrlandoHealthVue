// ==========================================================================
// (AXIOS) - Promise based HTTP client for the browser.
// Purpose: To get physician information
// Author:  Daniel Nedelcu
// ==========================================================================

import axios from 'axios'

export default() => {
    return axios.create({
        baseURL: `/-/ajax/phynd`,
        withCredentials: false,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
}