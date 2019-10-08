import Vue from 'vue/dist/vue.js';
import { store } from '../store'
import * as Constants from '../services/constants'
import VueMixins from "../mixins/mixins"
import Multiselect from 'vue-multiselect'

/**
 * Zipcode facet component
 */
export default Vue.component('Zip', {
    template: '#ZipcodeTemplate',
    store,
    mixins: [VueMixins],    

    data () {
        return {
            isDisabled: false,
            name: 'Zip',
            defaultZip : document.getElementById('ZipLocal').getAttribute('data-value'),
            selectedRadius : '',     
            label: (window.isInitialScreen) ? 'Search by:' : 'Zip Code',
            options : [
                {'key' : '5', 'value' : '5', 'Category': "Zipcode"},
                {'key' : '10', 'value' : '10', 'Category': "Zipcode"},
                {'key' : '20', 'value' : '20', 'Category': "Zipcode"},
                {'key' : '30', 'value' : '30', 'Category': "Zipcode"},
                {'key' : '40', 'value' : '40', 'Category': "Zipcode"}
            ]                    
        }
    },

    components: {
            Multiselect
    },        
    
    watch : { 
        selectedRadius () {              
            if(this.selectedRadius !== null) {
                if(!this.isValidUSZip(this.zipcode) || this.zipcode === '') {
                    this.$store.dispatch('AssignZipcode', this.defaultZip)   
                }
            
                /**
                 * Builds the query params object
                 */
                this.onCreteQuery({ 'Field' : 'Zipcode', 'Value' : this.zipcode });    
                
                /**
                 * Builds the query params object
                 */
                this.onCreteQuery({ 'Field' : 'Radius', 'Value' : this.selectedRadius.value });                 
                
                /**
                 * Assigns radius to State
                 */
                this.$store.dispatch('AssignRadius', this.selectedRadius.value + 'mi')
                                       
                /**
                 * Assigns geography items to state
                 */
                this.setGeography({                 
                    "ZipCode": this.zipcode,                     
                    "Distance": this.selectedRadius.value                
                })        
            }            
        },

        // zipcode () {
        //    return this.isDisabled = !this.isValidUSZip(this.zipcode)
        // }
    }, 

    computed : {
        zipcode : {            
            get : function() {
                return this.$store.getters.getZipcode
            },

            set : function(index) {
                this.$store.dispatch('AssignZipcode', index)   
            }
        },
        /**
         * State object
         */
        radius () {            
            return this.$store.getters.getRadius
        }
    },

    methods : {

        /**
         * Validates for proper zipcode
         */
        isValidUSZip (zip) {
            return /^\d{5}(-\d{4})?$/.test(zip);
        },            

        /**
         * Keyboard:enter event
         */
        submit() {
            if (this.isValidUSZip(this.zipcode) || this.zipcode === '') {
                this.$store.dispatch('AssignZipcode', this.zipcode)

                /**
                 * Builds the query params object
                 */
                if (window.isInitialScreen) {
                    this.onCreteQuery({ 'Field': 'Zipcode', 'Value': this.zipcode });
                }
            }
            this.onSearchActivate();
        },

        nameWithLang ({ key, docCount }) {
           return `${key}`
        },            
        
        /**
         * Blur event
         */
        onBlur (e) {
            
            if(this.isValidUSZip(this.zipcode) || this.zipcode === '' ) {       
                this.$store.dispatch('AssignZipcode', this.zipcode)
                /**
                 * Builds the query params object
                 */
                if(window.isInitialScreen) {
                    this.onCreteQuery({ 'Field' : 'Zipcode', 'Value' : this.zipcode });                                    
                }
            }
        }
    } 
});     