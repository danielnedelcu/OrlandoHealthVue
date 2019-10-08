import Vue from 'vue/dist/vue.js';
import { store } from '../store'
import * as Constants from '../services/constants'
import Facets from '../components/Facets'
import Zip from '../components/Zip'
import Specialty from '../components/Specialty'
import Gender from '../components/Gender'
import City from '../components/City'
import Name from '../components/Name'
import Language from '../components/Language'
import Insurance from '../components/Insurance'
import SearchResults from '../components/SearchResults'
import SearchResultsMobile from '../components/SearchResultsMobile'
import Pagination from '../components/Pagination'

export default Vue.component('Home', {
    template: '#HomeTemplate',
    store,
    data() {
        return {
            showFilters : 0,
            filtersLabel : 'MORE FILTERS'
        }
    },

    watch : {
        showFilters () {
            this.filtersLabel = (this.showFilters) ? 'LESS FILTERS' : 'MORE FILTERS'
        }
    },    

    components: {
        'Facets' : Facets,
        'Zip' : Zip,
        'Specialty' : Specialty,
        'Gender' : Gender,
        'City' : City,
        'Name' : Name,    
        'Language' : Language,
        'Insurance' : Insurance,
        'SearchResults' : SearchResults,
        'SearchResultsMobile': SearchResultsMobile,
        'Pagination' : Pagination
    },

    methods : {
        /**
         * Modal toggle
         */
        onShowFilters() {
            this.showFilters ^= 1;
        },        
    }    
});             
 