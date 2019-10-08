import Vue from 'vue/dist/vue.js';
import { store } from '../store'
import * as Constants from '../services/constants'
import PhysicianCard from './PhysicianCard'

/**
 * Search results doctors count component
 */
export default Vue.component('SearchResultsMobile', {
    template: '#SearchResultsTemplateMobile',
    store,

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
         * State object
         */        
        totalPhysicians () {
            return this.$store.getters.getResultsTotal
        }            
    }
});             
 