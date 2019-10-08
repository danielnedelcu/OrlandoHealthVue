// ==========================================================================
// (AXIOS) - Promise based HTTP client for the browser.
// Implements Bearer (token) authentication
// Author:  Daniel Nedelcu
// ==========================================================================

import axios from 'axios'

export default() => {
    return axios.create({
        baseURL: `https://tst-providersearch-int-api.phynd.com`,
        withCredentials: false,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + window.access_token
        }
    })
}