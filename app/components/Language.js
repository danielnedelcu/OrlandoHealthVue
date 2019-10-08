import Vue from 'vue/dist/vue.js';
import { store } from '../store'
import * as Constants from '../services/constants'
import VueMixins from "../mixins/mixins"
import Multiselect from 'vue-multiselect'

/**
 * Language facet component
 */
export default Vue.component('Language', {
    template: '#LanguageTemplate',
    store,
    mixins: [VueMixins],

    data () {
        return {
            selectedLanguage : ''
        }
    },

    components: {
        Multiselect
    },        

    watch : {
        /**
         * Event handling for dropdown selection
         */
        selectedLanguage () {  
            if(this.selectedLanguage !== null) { 
                /**
                 * Builds the query params object
                 */
                this.onCreteQuery({ 'Field' : 'Languages', 'Value' : this.selectedLanguage.key });                                 
            
                /**
                 * Builds the Global Data object to POST 
                 * Updates State
                 */
                const obj = {
                    "Field": Constants.PROVIDER_LANGUAGE,                                     
                    "Value": [this.selectedLanguage.key],                 
                    "Operation": "Exact"                       
                }
                this.centralGlobalObjectControl(obj)

                if(!window.isInitialScreen) { 
                    this.setStateChange(this.selectedLanguage);     
                }   
            }                 
        }
    }, 

    computed : {
        /**
         * State object
         */
        languages () {
            return this.$store.getters.getLanguages
        },

        /**
         * State object
         */
        GlobalObj () {
            return this.$store.getters.getGlobalObject
        }
    },

    methods: {
        nameWithLang ({ key, docCount }) {
           return `${key} (${docCount})`
        }
    }
});             
 