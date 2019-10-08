// ==========================================================================
// Find a doctor - Phynd implementation by Daniel Nedelcu
// Author:  Daniel Nedelcu
// Email:   dnedelcu@rightpoint.com
// Date:    12/4/18
// ==========================================================================

import Vue from 'vue/dist/vue.js';
import App from './App.js'
import router from './router/index.js'
import store from './store'
import "babel-polyfill";
import Multiselect from 'vue-multiselect'

Vue.component('multiselect', Multiselect)
window.isInitialScreen = (document.getElementById('PhysiciansVariables') === null) ? true : false;

var Application = (function(app, document) {   
    app.init = function () {    
        // Vue.js instance        
        new Vue({                           
            router,                    
            el: '#app',
            store,
            render: h => h(App)                                     
            })          
    }

    /**
     * Public API
     */    
    return {
        init : app.init
    } 
})(Application || {}, document, window);

document.addEventListener("DOMContentLoaded", () => {
    let tokenURL = '/-/ajax/phynd/getaccesstoken';

    /**
     * Get access token
     */
    function getAccessToken() {
            jQuery.ajax({
                url: tokenURL,
                dataType: 'script',
                cache: false,
                async: false        
            }).always(function(e) {
                if(e.status === "401") {
                    /**
                     * If token is expired
                     */
                    tokenURL = '/-/ajax/phynd/getaccesstoken?refresh=true';
                    getAccessToken();
                } else {                   
                    window.access_token = JSON.parse(e.responseText).access_token;
                    Application.init();
                }
            });            
    }
    getAccessToken()
});
    