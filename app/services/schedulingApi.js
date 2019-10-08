// ==========================================================================
// (AXIOS) - Promise based HTTP client for the browser.
// Purpose: To get scheduling availability
// Author:  Daniel Nedelcu
// ==========================================================================

import axios from 'axios'

export default() => {
    return axios.create({
        baseURL: `//orlando-health-system.healthpost.com`,
        withCredentials: false,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
}