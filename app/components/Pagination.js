import Vue from 'vue/dist/vue.js';
import { store } from '../store'
import * as Constants from '../services/constants'
import VueMixins from "../mixins/mixins"
import { Pagination } from 'bootstrap-vue/es/components';

Vue.use(Pagination);

/**
 * Pagination component
 */
export default Vue.component('Pagination', {
    template: '#PaginationTemplate',
    store,
    mixins: [VueMixins],

    data () {
        return {
            name : '',
            page : 1    
        }
    },

    computed : {
        /**
         * Gets current page index
         */
        currentPage : {
            get : function() {
                return this.$store.getters.getCurrentPage
            },

            set : function(index) {
                this.$store.dispatch('AssignLoadingStatus', true)            
                this.$store.dispatch('AssignPage', index)                 
                
                /**
                 * State : POST
                 */
                this.$store.dispatch('PostFacets', {                    
                    'access_token' : window.access_token,
                    'data' : this.$store.getters.getGlobalObject                    
                });     
            }
        },

        /**
         * Total number of physicians per query
         */
        resultsTotal () {
            const total = this.$store.getters.getResultsTotal;
            return total;
        },       
        
        /**
         * Physicians to show per page
         */
        itemsPerPage () {
            return parseInt(this.$store.getters.getViewCount);
        },

        /**
         * Loading status
         */
        loading () {
            return this.$store.getters.getLoadingStatus
        }
    },

    methods : {

        /**
         * On pagination change
         * 
         * @param {*} index 
         */
        onChange (index) {  
            setTimeout(function () {
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;   
            },250)            
        },

        /**
         * Sets current pagination index
         * @param {*} index 
         */
        setCurrentPage (index){}
    }  
});       