import Vue from 'vue/dist/vue.js';
import { store } from '../store'
import * as Constants from '../services/constants'
import VueMixins from "../mixins/mixins"
import Multiselect from 'vue-multiselect'

/**
 * City facet component
 */
export default Vue.component('City', {
    template: '#CityTemplate',
    store,
    mixins: [VueMixins],
    data () {
        return {
            selectedCity : ''        
        }
    },

    components: {
        Multiselect
    },     

    watch : {   
        /**
         * Event handling for dropdown selection
         */
        selectedCity () {
            if(this.selectedCity !== null) { 
                /**
                 * Builds the query params object
                 */
                this.onCreteQuery({ 'Field' : 'City', 'Value' : this.selectedCity.key });

                 /**
                 * Hack!!!!
                 * Not sending the Array to centralGlobalObjectControl() since that only
                 * takes in a single Object and we need to send it an Array of objects.
                 */

                this.$store.dispatch('AddGlobalObject', [{                    
                    "Field": Constants.ADDRESS_CITY,                 
                    "Weight": 1,                 
                    "Value": [this.selectedCity.key],                 
                    "Operation": "Exact",                 
                    "FuzzyEnabled": false,      
                    "ChildFilter" : true,               
                    "Required": "true"
                },
                {
                    "Field": Constants.ADDRESS_TYPE,                 
                    "Weight": 1,                 
                    "Value": ['Primary Practice Address'],                 
                    "Operation": "Exact",                 
                    "FuzzyEnabled": false,                 
                    "Required": "true"
                }])                     
                             
                if(!window.isInitialScreen) { 
                    this.setStateChange(this.selectedCity);     
                }     
            }               
        }
    }, 

    computed : {
        /**
         * State object
         */
        city () {            
            return this.$store.getters.getCity
        },

        /**
         * State object
         */
        GlobalObj () {
            return this.$store.getters.getGlobalObject
        }           
    },

    methods : {
        nameWithLang ({ key, docCount }) {
            return `${key} (${docCount})`
        }
    }  
});             
 