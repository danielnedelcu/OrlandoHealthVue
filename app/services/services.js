import Api from './api'
import RatingsApi from './ratingsApi'
import SchedulingApi from './schedulingApi'
import ProviderDetailApi from './providerDetailApi'

/**
 * API abstraction for all services used in the application
 */
export default {
    /**
     * API for retrieving session token
     * 
     * @type GET
     * @param {*} params 
     */
    getToken (params) {
        return Api().get('/token?username=' + params.username + '&password=' + params.password)
    },

    /**
     * API for retrieving search filters
     * 
     * @type POST
     * @param {*} params 
     */
    // getFacetData (token, params){    
    //     return Api().post('/api/search', params);
    // },

    getFacetData (token, params){    
        return Api().post('/api/search', params).then(
            (response) => { return response },
        ).catch(
            error => {
                return error.response.status
            }
        );
    },    

    /**
     * API for retrieving physician rating
     * 
     * @type GET
     * @param {*} params 
     */
    getRatingsData (params){        
        return RatingsApi().get('/GetRatingFromNPI?NPI=' + params);    
    },

    /**
     * API for retrieving physician details
     * 
     * @type GET
     * @param {*} params 
     */
    getProviderData (params){        
        return ProviderDetailApi().get('/LocationOverrides?NPI=' + params);    
    },    
    
    /**
     * API for retrieving physician scheduling
     * 
     * @type GET
     * @param {string} params - NPI number
     */
    getSchedulingData (params){   
        return SchedulingApi().get('/embed.js?doctor_id=npi-' + params + '&widget_theme=v4&_=1546437871900 ');    
    }       
}