import Vue from 'vue/dist/vue.js';
import { store } from '../store'
import * as Constants from '../services/constants'
import VueMixins from "../mixins/mixins"
import Multiselect from 'vue-multiselect'

/**
 * Insurance facet component
 */
export default Vue.component('Insurance', {
    template: '#InsuranceTemplate',
    store,
    mixins: [VueMixins],

    data () {
        return {
            selectedInsurance : ''            
        }
    },

    components: {
        Multiselect
    },             

    watch : {          
        /**
         * Event handling for dropdown selection
         */
        selectedInsurance () {
            if(this.selectedInsurance !== null) { 
                /**
                 * Builds the query params object
                 */                
                this.onCreteQuery({ 'Field' : 'Insurance', 'Value' : this.selectedInsurance.key });

                /**
                 * Builds the Global Data object to POST 
                 * Updates State
                 */
                const obj = {
                    "Field": Constants.PROVIDER_INSURANCE,                                  
                    "Value": [this.selectedInsurance.key],                 
                    "Operation": "MatchAnd"                       
                }    
                this.centralGlobalObjectControl(obj)     

                if(!window.isInitialScreen) { 
                    this.setStateChange(this.selectedInsurance);     
                }       
            }
        }
    }, 

    computed : {
        /**
         * State object
         */
        insurance () {            
            return this.$store.getters.getInsurance
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
 