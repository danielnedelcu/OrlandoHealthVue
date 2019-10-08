import Vue from 'vue/dist/vue.js';
import { store } from '../store'
import VueMixins from "../mixins/mixins"

/**
 * Specialty facet component
 */
export default Vue.component('SearchButton', {
    template: '#SearchButtonTemplate',
    store,
    mixins: [VueMixins],

    data () {
        return {
            label: (window.isInitialScreen) ? 'Search by:' : 'Specialty',
            showButton : window.isInitialScreen
        }
    },
      
     methods : {
        /**
         * First screen, search button click
         */
        onGenerateSearch () {
            this.onSearchActivate()
        }
    } 
});             
 