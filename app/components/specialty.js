import Vue from 'vue/dist/vue.js';
import { store } from '../store'
import * as Constants from '../services/constants'
import VueMixins from "../mixins/mixins"
import Multiselect from 'vue-multiselect'

/**
 * Specialty facet component
 */
export default Vue.component('Specialty', {
    template: '#SpecialtyTemplate',
    store,
    mixins: [VueMixins],

    data () {
        return {
            Remove : '',
            value : '',    
            selectedSpecialty : '',
            label: (window.isInitialScreen) ? 'Search by:' : 'Specialty',
            isInitial : window.isInitialScreen
        }
    },

    components: {
        Multiselect
    },           

    watch : {
        options() {        
            return this.$store.getters.getSpecialty
        },           

        /**
         * Event handling for dropdown selection
         */
        selectedSpecialty () {

            if(this.selectedSpecialty !== null) {                
                /**
                 * Builds the query params object
                 */                
                this.onCreteQuery({ 'Field' : 'Specialty', 'Value' : this.selectedSpecialty.key });
                /**
                 * Builds the Global Data object to POST 
                 * Updates State
                 */
                const obj = {
                    "Field": Constants.SPECIALITY_DOMAINS,                                  
                    "Value": ['Marketing Specialty Domain:' + this.selectedSpecialty.key],                 
                    "Operation": "MatchAnd"                       
                }
                this.centralGlobalObjectControl(obj)       
                
                if(!window.isInitialScreen) { 
                    this.setStateChange(this.selectedSpecialty);     
                }       
            }
        }        
    }, 

    computed : {
        /**
         * State object
         */
        specialty () {
            /**
             * Create a new array just with the proper specialty names,
             * removing any traces of the taxonomy.
             */
            let filteredArr = this.$store.getters.getSpecialty.map(item => item.key.replace("Marketing Specialty Domain:", ""))
            let finalArr = [];

            /**
             * Iterate through all array elements and assign the filtered array 
             * value to the old array.
             */
            this.$store.getters.getSpecialty.forEach((item, i) => {
               item.key = filteredArr[i];
               finalArr.push(item);
            });            
            return finalArr;
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
        },

        /**
         * First screen, search button click
         */
        onGenerateSearch () {
            this.onSearchActivate()
        }
    } 
});             
 