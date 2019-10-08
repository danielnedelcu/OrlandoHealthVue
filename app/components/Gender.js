import Vue from 'vue/dist/vue.js';
import { store } from '../store'
import * as Constants from '../services/constants'
import VueMixins from "../mixins/mixins"
import Multiselect from 'vue-multiselect'

/**
 * Gender facet component
 */
export default Vue.component('Gender', {
    template: '#GenderTemplate',
    store,
    mixins: [VueMixins],

    data () {
        return {
            selectedGender : '',            
        }        
    },

    components: {
        Multiselect
    },              

    watch : {
        /**
         * Event handling for dropdown selection
         */
        selectedGender () {  
            if(this.selectedGender !== null) { 
                /**
                 * Builds the query params object
                 */
                this.onCreteQuery({ 'Field' : 'Gender', 'Value' : this.selectedGender.key }); 

                /**
                 * Builds the Global Data object to POST 
                 * Updates State
                 */
                const obj = {
                    "Field": Constants.PROVIDER_GENDER,                                    
                    "Value": [this.selectedGender.key],             
                    "Operation": "Exact"                       
                }         
                this.centralGlobalObjectControl(obj) 

                if(!window.isInitialScreen) { 
                    this.setStateChange(this.selectedGender);     
                }                
            }                   
        }
    }, 

    computed : {
        /**
         * State object
         */
        facetList () {
            return this.$store.getters.getFacetList
        },

        /**
         * State object
         */
        gender () {
            return this.$store.getters.getGender
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
 