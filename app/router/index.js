import Vue from 'vue/dist/vue.js';
import Router from 'vue-router'
import { store } from '../store'
import Home from '../views/home'
import Search from '../views/search'

Vue.use(Router)

/**
 * Determine which UI state to show depending on the presence of a
 * dom element
 */
window.view = (document.getElementById('PhysiciansVariables') === void 0
						  || document.getElementById('PhysiciansVariables') === null)
						  ? Search 
						  : Home;

/**
 * Vue router
 */
export default new Router({    
    mode: 'history',
	routes: [
		{
			path: '/physician-finder-phynd',
			name: 'search',
			component: window.view,
			props: route => ({ query: route.query.q })
		}		
	]
})
