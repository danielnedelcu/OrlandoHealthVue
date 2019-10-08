import Vue from 'vue/dist/vue.js';
import { store } from '../store'
import * as Constants from '../services/constants'
import VueMixins from "../mixins/mixins"
import Multiselect from 'vue-multiselect'

export default Vue.component('Facets', {
    template: '#FacetsTemplate',
    mixins: [VueMixins],
    store,

    data () {
        return {         
        }
    },

    computed : {
        /**
         * State object
         */
        facetList () {
            return this.$store.getters.getFacetList
        }
    },

    methods : {
        /**
         * Remove selected facet from UI
         * Update state
         */
        removeFacet (item) {        
            this.removeFacetFromView(item);     
        }
    } 
});             
 