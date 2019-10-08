import Vue from 'vue'
import {store} from '../store'
import * as Constants from '../services/constants'
import URI from 'urijs'

/**
 * Global Mixin
 */
export default Vue.mixin({
    methods : {
        /**
         * Checks if null
         * @returns boolean
         * @param {*} element 
         */
        isNull (element) {
            return element === null;
        },

        /**
         * Checks if undefined
         * @returns boolean
         * @param {*} element 
         */
        isUndefined (element) {
            return element === void 0;
        },        

        /**
         * Compares selected dropdown to items in finalArray
         *
         * @param { arr } finalArray
         * @param { obj } dropdown
         */
        contains ( arr, obj ) {
            return arr.some((item) =>                        
                item === obj )
        },         

        /**
         * Updated UI and state for every UI interaction
         * 
         * @param {*} obj 
         */
        setStateChange (obj ) {       
            /**
             * Removes facet data - State
             */
            this.$store.dispatch('RemoveFacet', obj)

            /**
             * Adds facet data - State
             */
            this.$store.dispatch('AddFacet', obj)

            /**
             * Resets page count to 1
             */            
            this.$store.dispatch('AssignPage', 1) 
            
            /**
             * State : POST
             */
            this.$store.dispatch('PostFacets', {            
                'access_token' : window.access_token,
                'data' : this.$store.getters.getGlobalObject            
            });    
        },

        /**
         * Initiates search on first screen
         */
        onSearchActivate() {
            /**
             * URL request
             */       
            window.location = this.$store.getters.getUrlQuery;          
        },

        /**
         * Remove selected facet
         * 
         * @param {*} obj 
         */
        removeFacetFromView (obj ) {
            this.$store.dispatch('UpdateObject', obj);

            /**
             * Removes facet data
             */            
            this.$store.dispatch('RemoveFacet', obj)
            
            /**
             * Builds the query params object
             */
            this.onCreteQuery({ 'Field' : obj.Value, 'Value' : '' }); 

            /**
             * Zipcode and radius are unique so it requires one off logic
             * If Zipcode is removed, remove both.
             */
            if(obj.Category === Constants.ZIPCODE) {
                 /**
                 * Assigns zipcode to State
                 */
                this.$store.dispatch('AssignZipcode', '')

                /**
                 * Assigns radius to State
                 */
                this.$store.dispatch('AssignRadius', '')                

                /**
                 * Remove zipcode/radius
                 */
                this.$store.dispatch('RemoveGeography')

    
                /**
                 * Creates radius facet object to be removed
                 */
                const radiusFacetObj = {
                    Category: "Radius",
                    Value: "Radius",
                    key: ""
                }                

                this.$store.dispatch('RemoveFacet', radiusFacetObj)                 

                /**
                 * Builds the query params object
                 */
                this.onCreteQuery({ 'Field' : 'Radius', 'Value' : '' });                       
            }

            /**
             * IF only Radius is removed, remove only radius and default to 10 miles
             */
            if(obj.Category === Constants.RADIUS) {
                /**
                 * Since we need a zipcode, it checks to see it its located in State.
                 * If not, it uses default.
                 */
                this.$store.dispatch('AssignZipcode', this.$store.getters.getZipcode || document.getElementById('ZipLocal').getAttribute('data-value'))

                /**
                 * Assigns radius to State
                 */
                this.$store.dispatch('AssignRadius', '10mi')     
                
                /**
                 * Sets Geography State
                 */
                this.$store.dispatch('AssignGeography', {             
                    "ZipCode": this.$store.getters.getZipcode,             
                    "Distance": '10mi'            
                })

                /**
                 * Builds the query params object
                 */
                this.onCreteQuery({ 'Field' : 'Radius', 'Value' : '10' });                    
            }

            /**
             * Resets page count to 1
             */
            this.$store.dispatch('AssignPage', 1)                    
            /**
             * State : POST
             */
            this.$store.dispatch('PostFacets', {                
                'access_token' : window.access_token,
                'data' : this.$store.getters.getGlobalObject                
            });                                            
        },

        /**
         * Centralized geography State call
         * 
         * @param {*} obj 
         */
        setGeography(obj) {
            /**
             * Creates zipcode facet object
             */
            const facetObj = {
                Category: "Zipcode",
                Value: "Zipcode",
                key: obj.ZipCode 
            }

            /**
             * Creates radius facet object
             */
            const radiusFacetObj = {
                Category: "Radius",
                Value: "Radius",
                key: obj.Distance 
            }

            /**
             * Resets page count to 1
             */
            this.$store.dispatch('AssignPage', 1) 
            /**
             * Sets Geography State
             */
            this.$store.dispatch('AssignGeography', {             
                "ZipCode": obj.ZipCode,             
                "Distance": obj.Distance + 'mi'            
            })

            if(!window.isInitialScreen) { 
                /**
                 * Checks for existing facet and removes it
                 */
                this.$store.dispatch('RemoveFacet', facetObj)

                /**
                 * Checks for existing facet and removes it
                 */
                this.$store.dispatch('RemoveFacet', radiusFacetObj)                

                /**
                 * Updates zipcode facet data - State
                 */
                this.$store.dispatch('AddFacet', facetObj)

                /**
                 * Updates radius facet data - State
                 */
                this.$store.dispatch('AddFacet', radiusFacetObj)                

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
         * Centralized name State call
         * 
         * @param {*} obj 
         */
        setName(obj) {
            /**
             * Creates facet object
             */
            const facetObj = {
                Category: Constants.FULLNAME,
                Value: "Name",
                key: obj
            }

            if(!window.isInitialScreen) { 
                /**
                 * Checks for existing facet and removes it
                 */
                this.$store.dispatch('RemoveFacet', facetObj)

                /**
                 * Updates facet data - State
                 */
                this.$store.dispatch('AddFacet', facetObj)

                /**
                 * Sets Geography State
                 */
                this.$store.dispatch('AssignName', obj)

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
         * Centralized query to State call
         * 
         * @param {*} obj 
         */
        centralGlobalObjectControl(obj) {
            //if
            this.$store.dispatch('AddGlobalObject', {                    
                "Field": obj.Field,                 
                "Weight": 1,                 
                "Value": obj.Value,                 
                "Operation": obj.Operation,                 
                "FuzzyEnabled": false,                 
                "Required": "true"})        
        },

        /**
         * 
         * @param {*} obj 
         */
        centralGLobalQueryControl(obj) {            
           this.$store.dispatch('AddGlobalQuery', obj)            
        },

        /**
         * 
         * @param {*} obj 
         */
        onCreteQuery(obj) {
            const self = this;
            /**
             * Remove Any duplicate items that match the new object
             * 
             */
            this.$store.getters.getGlobalQuery.QueryParams = this.$store.getters.getGlobalQuery.QueryParams.filter(e => e.Field !== obj.Field);
  
            /**
             * Add new object to array
             */
            this.$store.getters.getGlobalQuery.QueryParams.push(obj);
            
            /**
             * Builds query
             */
            let parsedQuery = this.onBuildQuery()   
            
            if(!window.isInitialScreen) {
                self.$router.push({ path: '/physician-finder-phynd', query: parsedQuery})
            }
        },
        
        onBuildQuery() {
            /**
             * Builds query
             */
            var uri = new URI(window.location.href);
            for(var i = 0; i < this.$store.getters.getGlobalQuery.QueryParams.length; ++i ) {                
                uri.setSearch(this.$store.getters.getGlobalQuery.QueryParams[i].Field, this.$store.getters.getGlobalQuery.QueryParams[i].Value);                
            }                        
            var uriSearch = uri.search()     
            // State ( urlQuery ) defined        
            this.$store.dispatch('AddUrlQuery', uriSearch)               
            return URI.parseQuery(uriSearch);  
        }
    }

})