import Vue from 'vue/dist/vue.js';
import { store } from '../store'
import * as Constants from '../services/constants'
import PhysicianCard from './PhysicianCard'

/**
 * Search results component
 */
export default Vue.component('SearchResults', {
    template: '#SearchResultsTemplate',
    store,
    components : {
        PhysicianCard
    },

    data () {
        return {}
    },
    computed : {
        /**
         * State object
         */
        physicians () {
            return this.$store.getters.getPhysicians
        },

        /**
         * State Object
         */
        loading () {
            return this.$store.getters.getLoadingStatus
        },

        /**
         * State object
         */        
        totalPhysicians () {
            return this.$store.getters.getResultsTotal
        }            
    }
});             
 