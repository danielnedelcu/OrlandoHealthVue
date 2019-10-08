import Vue from 'vue/dist/vue.js';
import { store } from '../store'
import * as Constants from '../services/constants'
import Services from '../services/services'
import Physician from '../models/Physician'

/**
 * PhysicianCard component
 */
export default Vue.component('PhysicianCard', {
    template: '#PhysicianCardTemplate',
    store,
    props : {
        physician : { type : Physician, required : true }
    },

    data () {
        return {
            ratingsData : '',
            scheduleData : '',
            locationAddress :  '',
            locationHours : '',
            locationName : '',
            locationPhone : ''
        }
    },    

    /**
     * Lifecycle hook
     * Called initially only
     */
    created () {
        this.onLoad()
    },
    
    /**
     * Lifecycle hook
     * Called after every rerender
     */
    updated () {
       //this.onLoad()
    },

    computed : {
        npi () {
            return this.physician.npi
        },

        hoursCondition () {
            return this.locationHours !== '';
        },

        phoneCondition () {
            return this.locationPhone.toString().replace(/[^\w\s]/gi, '').replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
        },

        phoneConditionAlt () {
            return this.physician.physicianNumber.toString().replace(/[^\w\s]/gi, '').replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
        }        
    },

    methods : {
        onLoad() {
            /**
             * Fetch ratings and schedule
             */            
            this.FetchRatings(this.npi)
            this.FetchSchedule(this.npi)       
            
            /**
             * Only fetch provider data from Sitecore if the flag is set to Yes.
             * If its set to No, it will simply use properties from Phynd.
             */
            if(this.physician.hasLocation.length) this.FetchProviderData(this.npi)
        },
        /**
         * POST - Fetches ratings data
         * 
         * @param {string} payload 
         */
        async FetchRatings(payload) {
            if(this.physician.employed.length) {
                const response = await Services.getRatingsData(payload);    
                this.ratingsData = response.data;
            }
        },

        /**
         * POST - Fetches schedule data
         * 
         * @param {string} payload 
         */
        async FetchSchedule(payload) {
            if(this.physician.schedule.length) {
                try {
                    const response = await Services.getSchedulingData(payload);    
                    if(response.status === 200) this.physician.showSchedule = true;
                } catch(error) {
                    
                }
            }
        },      
        

        /**
         * POST - Fetches physician data
         * 
         * @param {string} payload 
         */        
        async FetchProviderData(payload) {            
            const response = await Services.getProviderData(payload);    
            this.providerData = response.data;
            this.locationAddress =  this.providerData.LocationAddress;
            this.locationHours = this.providerData.LocationHours;
            this.locationName = this.providerData.LocationName;
            this.locationPhone = this.providerData.LocationPhone;
        }
    }  
});             
 