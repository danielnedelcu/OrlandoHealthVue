import URI from 'urijs'
import { store } from '../store'

export const URIMixin = {
    data () {
      return {
        uri : {}
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
        GlobalQuery () {
            return this.$store.getters.getGlobalQuery
        }        
    },

    methods : {
      /**
       * Takes a string representation of the url and
       * converts it to object
       * @param string*} url 
       * @returns object
       */
      getURI (url) {
        var self = this;
        this.uri = new URI(url);
        var uriSearch = self.uri.search()       
        var parsedQuery = URI.parseQuery(uriSearch);         
        return parsedQuery;
      },

      /**
       * Host
       * @param {string} url 
       */
      getENV(url) {
        let uri = new URI(url);
        let hostname = uri.host();
        return hostname;
      },

      /**
       * Retrieves host name based on the predefined key/value pairs
       * found in the cshtml.
       * @param {string} url 
       */
      getHOST(url) {
        let obj =  JSON.parse(document.getElementById('PhysiciansVariables').innerHTML);
        let hostname;
        obj.forEach((item2) => {  
            let tempString = item2.hostname.replace(/\//g, '')
            if(tempString === url) {                
                hostname = tempString
            }
        })
        return hostname
      }
    }
}