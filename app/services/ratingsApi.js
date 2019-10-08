// ==========================================================================
// (AXIOS) - Promise based HTTP client for the browser.
// Purpose: To get physician star rating
// Author:  Daniel Nedelcu
// ==========================================================================

import axios from 'axios'

export default() => {
    return axios.create({
        baseURL: `/-/ajax/NPIRating`,
        withCredentials: false,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
}