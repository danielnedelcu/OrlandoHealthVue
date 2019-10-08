import Vue from 'vue/dist/vue.js';
import { store } from '../store'
import Zip from '../components/Zip'
import Specialty from '../components/Specialty'
import Gender from '../components/Gender'
import City from '../components/City'
import Name from '../components/Name'
import Language from '../components/Language'
import Insurance from '../components/Insurance'
import SearchButton from '../components/SearchButton'

export default Vue.component('Search', {
    template: '#InitialSearchTemplate',
    store,
    data() {
        return {
            showFilters : 0,
            filtersLabel : 'MORE FILTERS'
        }
    },

    components: {
        'Zip' : Zip,
        'Specialty' : Specialty,
        'Gender' : Gender,
        'City' : City,
        'Name' : Name,    
        'Language' : Language,
        'Insurance' : Insurance,
        'SearchButton' : SearchButton
    },                         
    watch : {
        showFilters () {
            this.filtersLabel = (this.showFilters) ? 'LESS FILTERS' : 'MORE FILTERS'
        }
    },

    computed : {
        /**
         * State Object
         */
        loading () {
            return this.$store.getters.getLoadingStatus
        },        
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
 