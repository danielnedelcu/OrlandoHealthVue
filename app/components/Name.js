import Vue from 'vue/dist/vue.js';
import { store } from '../store'
import * as Constants from '../services/constants'
import VueMixins from "../mixins/mixins"

/**
 * Name facet component
 */
export default Vue.component('Name', {
    template: '#NameTemplate',
    store,
    mixins: [VueMixins],

    data () {
        return {
            name : '',
            label: (window.isInitialScreen) ? 'Find a Physician' : 'Search by Physician Name',
            showButton : window.isInitialScreen
        }
    },

    watch : {
        /**
         * State object
         */
        name () {
            return this.$store.getters.getName
        }
    }, 

    methods : {
        onSearchClick () {
            if(!window.isInitialScreen) {  
                if(this.isValidName(this.name)) {
                    this.onNameChange(this.name);
                }
            } else {
                this.onNameChange(this.name);
            }                
        },     

        /**
         * Keyboard:enter event
         */
        submit () {
            if(!window.isInitialScreen) {   
                if(this.isValidName(this.name)) {
                    this.onNameChange(this.name);
                }
            } 
        },

        /**
         * Blur event
         */
        onBlur (e) {
            this.onSearchClick ()
         },

        /**
         * Enter event
         */
        onNameChange (name) {
            /**
             * Builds the query params object
             */
            this.onCreteQuery({ 'Field' : 'Name', 'Value' : name });   
            
            /**
             * Resets page count to 1
             */            
            this.$store.dispatch('AssignPage', 1)             

            /**
             * Builds the Global Data object to POST 
             * Updates State
             */
            const obj = {
                "Field": Constants.FULLNAME,                                     
                "Value": [name],                 
                "Operation": "MatchOr"                        
            }
            this.centralGlobalObjectControl(obj)   

            if(!window.isInitialScreen) {        
                this.setName(name);                   
                this.name = '';
            } else {
                this.onSearchActivate()
            }
        },
        
        /**
         * Validates for proper name
         */
        isValidName (name) {
            return /^[A-Za-z\s]+$/.test(name)
        }         
    }      
});             
 