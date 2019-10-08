import Vue from 'vue/dist/vue.js';
import { store } from './store'
import * as Constants from './services/constants'
import URI from 'urijs'
import VueMixins from "./mixins/mixins"
import {URIMixin} from './mixins/URI'

export default Vue.component('App', {
    template: '#AppTemplate',
    store,
    mixins: [URIMixin, VueMixins],

    data () {
      return {}
    },

    props: {
      query: {
        type: String,
        default: '',
      },
    },   

    created () {
      // Parse all query params
      const query = this.getURI(window.location.href);
      // Loop through and build global facet object based on key/value
      for (const [key, value] of Object.entries(query)) {          
          this.$store.dispatch('AddGlobalQuery', {'Field' : `${key}`,'Value' :`${value}`}) 
          if(`${value}` !== '') {
            switch(key) {
              case 'City':                                     
                  this.centralGlobalObjectControl({ "Field": Constants.ADDRESS_CITY, "Value": [value], "Operation": "MatchAnd" })
                  this.setStateChange({
                    Category: Constants.ADDRESS_CITY,
                    key: value,
                    Value: 'City'
                  })
                  break;                     
              case 'Gender':                   
                  this.centralGlobalObjectControl({ "Field": Constants.PROVIDER_GENDER, "Value": [value], "Operation": "Exact" })
                  this.setStateChange({
                    Category: Constants.PROVIDER_GENDER,
                    key: value,
                    Value: 'Gender'
                  })
                  break;                         
              case 'Specialty':                   
                  this.centralGlobalObjectControl({ "Field": Constants.SPECIALITY_DOMAINS, "Value": ['Marketing Specialty Domain:' + value], "Operation": "MatchAnd" })                  
                  this.setStateChange({
                    Category: Constants.SPECIALITY_DOMAINS,
                    key: value,
                    Value: 'Specialty'
                  })
                  break;                     
              case 'Languages':                   
                  this.centralGlobalObjectControl({ "Field": Constants.PROVIDER_LANGUAGE, "Value": [value], "Operation": "MatchAnd" })
                  this.setStateChange({
                    Category: Constants.PROVIDER_LANGUAGE,
                    key: value,
                    Value: 'Languages'
                  })
                  break;                       
              case 'Insurance':                 
                  this.centralGlobalObjectControl({ "Field": Constants.PROVIDER_INSURANCE, "Value": [value], "Operation": "MatchAnd" })
                  this.setStateChange({
                    Category: Constants.PROVIDER_INSURANCE,
                    key: value,
                    Value: 'Insurance'
                  })
                  break; 
              case 'Name':                 
                  this.centralGlobalObjectControl({ "Field": Constants.FULLNAME, "Value": [value], "Operation": "MatchOr" })
                  this.setStateChange({
                    Category: Constants.FULLNAME,
                    key: value,
                    Value: 'Name'
                  })
                  break;                                                             
              case 'Zipcode':      
                  this.$store.dispatch('AssignZipcode', value)                    
                  this.setGeography({                     
                    ZipCode: value,                     
                    Distance: (this.uri.hasQuery("Radius"))                       
                      ?  (query.Radius !== '')                           
                          ? query.Radius                           
                          :  '40'                       
                      : '40',
                    Value: 'Zipcode'                    
                  });
                  break;                   
            }
          }
      }       
      // Builds Query
      this.onBuildQuery();

      /**
       * Defined and calls the Phynd API on page load
       */
      let obj = {
        'access_token' : window.access_token,
        'data' : this.$store.getters.getGlobalObject          
      }
      this.$store.dispatch('PostFacets', obj);
    }
} )   