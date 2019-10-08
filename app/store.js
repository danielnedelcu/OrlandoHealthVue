import Vue from 'vue/dist/vue.js';

import Vuex from 'vuex';
// import router from './router'
import Services from './services/services'
import * as Constants from './services/constants'
import Physician from './models/Physician'
import Sort from "./mixins/sort"
import Capitalize from "./mixins/capitalize"
import "babel-polyfill";

Vue.use(Vuex)

export const store = new Vuex.Store({
	/**
	 * Defines the properties of our state
	 */
	state: {
		token : {},
		zipcode : '',
		radius : "40mi",
		city : [],
		specialty: [],
		languages: [],
		gender : [],
		insurance : [],
		center: {},
		name : {},
		physicians : [],
		facetList: [],
		resultsTotal: 0,
		currentPage: 1,
		viewCount : 0, 
		loading: false,
		urlQuery : '',
		
		GlobalObj : {            
			"Start": 0,
			"Limit": 12,
			"ResultScope": "Enrolled",
			"SearchParams": [
				{"Field":"group.name", "Weight": 1, "Value": [document.getElementById('ProviderGroup').getAttribute('data-group-value')], "Operation": "exact", "FuzzyEnabled": false, "Required":"true"},
				{"Field":"providerDetails.active", "Value": ["true"], "Operation": "Exact", "Required" : "true"}
			],
			"FacetParams":[
					{"Name":"taxonomy|specialty","Field": Constants.SPECIALITY_DOMAINS},
					{"Name":"providerAttributes|gender","Field":"providerAttributes.gender"},
					{"Name":"language|name","Field":"language.name"},
					{"Name":"address|city","Field":"address.city"},
					{"Name":"healthPlans|HealthPlanName","Field":"healthPlans.HealthPlanName"}
			],
			"GeoDistance" :
			[			
			],						
			"ReturnParams":
			[
				"ProviderDetails",
				"addresses",
				"background",
				Constants.SPECIALITY_DOMAINS,
				"customFields"
			]							
		},
		
		GlobalQuery : {
			'QueryParams': [
				{'Field' : 'Zipcode', 'Value' : ''},				
				{'Field' : 'City', 'Value' : ''},				
				{'Field' : 'Languages', 'Value' : ''},				
				{'Field' : 'Gender', 'Value' : ''},				
				{'Field' : 'Name', 'Value' : ''},				
				{'Field' : 'Insurance', 'Value' : ''},				
				{'Field' : 'q', 'Value' : ''},				
				{'Field' : 'Specialty', 'Value' : ''},
				{'Field' : 'Radius', 'Value' : '40'}
			]
		}
	},

	/**
	 * Getter methods that are called from our application
	 */
	getters: {
		getToken : (state) => state.token,
		getZipcode : (state) => state.zipcode,
		getRadius : (state) => state.radius,
		getCity : (state) => state.city,
		getSpecialty : (state) => state.specialty,
		getLanguages : (state) => state.languages,
		getGender : (state) => state.gender,
		getInsurance : (state) => state.insurance,
		getCenter : (state) => state.center,
		getName : (state) => state.name,
		getPhysicians : (state) => state.physicians,
		getFacetList : (state) => state.facetList,
		getAllItems : (state) => state,
		getGlobalObject : (state) => state.GlobalObj,
		getGlobalQuery : (state) => state.GlobalQuery,
		getResultsTotal : (state) => state.resultsTotal,
		getViewCount : (state) => state.viewCount,
		getCurrentPage : (state) => state.currentPage,
		getLoadingStatus : (state) => state.loading,
		getUrlQuery : (state) => state.urlQuery
	},

	/**
	 * Mutations set the state
	 */
	mutations : {
		assignUrlQuery (state, obj) {
			state.urlQuery = obj
		},
		assignLoadingStatus (state, obj) {
			state.loading = obj
		},
		assignResultsTotal ( state, obj) {
			state.resultsTotal = obj
		},
		assignViewCount ( state, obj) {
			state.viewCount = obj
		},		
		assignToken (state, obj) {			
			state.token = obj;
    	},
		assignZipcode (state, obj) {			
			state.zipcode = obj;
    	},    
		assignRadius (state, obj) {			
			state.radius = obj;
    	},  
		assignCity (state, obj) {		
			/**
			 * Augment facet with category context
			 */
			for(var i = 0; i < obj.length; ++i ) {
				Object.defineProperty(obj[i], 'Category', {
					value: Constants.ADDRESS_CITY,
					writable: true,
					enumerable: true,
					configurable: true
				});
				Object.defineProperty(obj[i], 'Value', {
					value: 'City',
					writable: true,
					enumerable: true,
					configurable: true
				});					
			}	
			state.city = Sort.sortAlpha(obj);
    	},  
		assignSpecialty (state, obj) {
			/**
			 * Augment facet with category context
			 */
			for(var i = 0; i < obj.length; ++i ) {
				Object.defineProperty(obj[i], 'Category', {
					value: Constants.SPECIALITY_DOMAINS,
					writable: true,
					enumerable: true,
					configurable: true
				});
				Object.defineProperty(obj[i], 'Value', {
					value: 'Specialty',
					writable: true,
					enumerable: true,
					configurable: true
				});					
			}		

			/**
			 * A bit of a hack since specialtyies values come with a 
			 * taxonomy name appended.
			 */
			const newArr =  obj.filter(e => e.key.includes("Marketing Specialty Domain:"));	
			state.specialty = Sort.sortAlpha(newArr);
    	},  
		assignLanguages (state, obj) {
			for(var i = 0; i < obj.length; ++i ) {
				Object.defineProperty(obj[i], 'Category', {
					value: Constants.PROVIDER_LANGUAGE,
					writable: true,
					enumerable: true,
					configurable: true
				});			
				Object.defineProperty(obj[i], 'Value', {
					value: 'Languages',
					writable: true,
					enumerable: true,
					configurable: true
				});							
			}			
			state.languages = Sort.sortAlpha(obj);
    	},  
		assignGender (state, obj) {
			/**
			 * Augment facet with category context
			 */
			for(var i = 0; i < obj.length; ++i ) {
				Object.defineProperty(obj[i], 'Category', {
					value: Constants.PROVIDER_GENDER,
					writable: true,
					enumerable: true,
					configurable: true
				});
				Object.defineProperty(obj[i], 'Value', {
					value: 'Gender',
					writable: true,
					enumerable: true,
					configurable: true
				});									
			}		
			state.gender = Sort.sortAlpha(obj);
    	},    
		assignInsurance (state, obj) {
			/**
			 * Augment facet with category context
			 */
			for(var i = 0; i < obj.length; ++i ) {
				Object.defineProperty(obj[i], 'Category', {
					value: Constants.PROVIDER_INSURANCE,
					writable: true,
					enumerable: true,
					configurable: true
				});
				Object.defineProperty(obj[i], 'Value', {
					value: 'Insurance',
					writable: true,
					enumerable: true,
					configurable: true
				});					
			}	
			state.insurance = Sort.sortAlpha(obj);
    	},  
		assignCenter (state, obj) {			
			state.center = obj;
    	},  
		assignName (state, obj) {				
			state.name = obj;
    	},     
		assignPhysicians (state, obj) {		
			const newCollection = [];
			for (const physician of obj ) {				
				newCollection.push( new Physician(physician.provider))
			}
			state.physicians = newCollection;
		},
		assignFacetList (state, obj) {
			state.facetList.push(obj)
		},
		assignCurrentPage(state, obj){
			state.currentPage = obj;
		 	state.GlobalObj.Start = parseInt((state.currentPage - 1) * state.viewCount) ;
		},

		/**
		 * Removes selected facet from the facets object
		 * 
		 * @param {*} state 
		 * @param {*} obj 
		 */
		removeFacet ( state, obj ) {
			switch (obj.Category) {
				case Constants.SPECIALITY_DOMAINS:				  
					if(state.facetList.some((item, index, arr) => item.Category === Constants.SPECIALITY_DOMAINS )) {					
						state.facetList = state.facetList.filter(e => e.Category !== Constants.SPECIALITY_DOMAINS);		
					}
					break;					  
				case Constants.ADDRESS_CITY:
					if(state.facetList.some((item, index, arr) => item.Category === Constants.ADDRESS_CITY )) {						
						state.facetList = state.facetList.filter(e => e.Category !== Constants.ADDRESS_CITY);		
					}
					break;				
				case Constants.PROVIDER_GENDER:
					if(state.facetList.some((item, index, arr) => item.Category === Constants.PROVIDER_GENDER )) {						
						state.facetList = state.facetList.filter(e => e.Category !== Constants.PROVIDER_GENDER);		
					}
					break;						
				case Constants.PROVIDER_LANGUAGE:
					if(state.facetList.some((item, index, arr) => item.Category === Constants.PROVIDER_LANGUAGE )) {						
						state.facetList = state.facetList.filter(e => e.Category !== Constants.PROVIDER_LANGUAGE);		
					}
					break;								
				case Constants.PROVIDER_INSURANCE:
					if(state.facetList.some((item, index, arr) => item.Category === Constants.PROVIDER_INSURANCE )) {						
						state.facetList = state.facetList.filter(e => e.Category !== Constants.PROVIDER_INSURANCE);		
					}
					break;							
				case Constants.ZIPCODE:
					if(state.facetList.some((item, index, arr) => item.Category === Constants.ZIPCODE )) {						
						state.facetList = state.facetList.filter(e => e.Category !== Constants.ZIPCODE);
					}
					break;							
				case Constants.RADIUS:
					if(state.facetList.some((item, index, arr) => item.Category === Constants.RADIUS )) {						
						state.facetList = state.facetList.filter(e => e.Category !== Constants.RADIUS);
					}
					break;						
				case Constants.FULLNAME:
					if(state.facetList.some((item, index, arr) => item.Category === Constants.FULLNAME )) {						
						state.facetList = state.facetList.filter(e => e.Category !== Constants.FULLNAME);		
					}
					break;										  
				default:					
			}
		},
		assignGeography (state, obj) {

			/**
			 * Remove Any duplicate items that match the new object
			 */
			state.GlobalObj.GeoDistance = state.GlobalObj.GeoDistance.filter(e => e.Field !== obj.Field);
			
			/**
			 * Add new object to array
			 */
			state.GlobalObj.GeoDistance.push(obj);
		},

		/**
		 * Removes all objects from the Geography array
		 * 
		 * @param {*} state 
		 */
		removeGeography (state) {
			state.GlobalObj.GeoDistance.splice(0, state.GlobalObj.GeoDistance.length)
		},

		/**
		 * Builds the global phynd object for POST
		 * 
		 * @param {*} state 
		 * @param {*} obj 
		 */
		assignGlobalObject (state, obj) {

			if(!Array.isArray(obj)) {
				/**
				 * Remove Any duplicate items that match the new object
				 */
				state.GlobalObj.SearchParams = state.GlobalObj.SearchParams.filter(e => e.Field !== obj.Field);
							
				/**
				 * Add new object to array
				 */
				state.GlobalObj.SearchParams.push(obj);
			} else {
				/**
				 * Remove Any duplicate Array items
				 */	
				state.GlobalObj.SearchParams = state.GlobalObj.SearchParams.filter(e => e.Field !== "addresses.city");

				for (var i=state.GlobalObj.SearchParams.length-1; i>=0; i--) {			
					if (state.GlobalObj.SearchParams[i].Field === 'addresses.addressType') {						
						state.GlobalObj.SearchParams.splice(i, 1);
					}
				}

				/**
				 * City section is the only selection that adds add
				 * array instead of an object.
				 */				
				for (const arrItem of obj ) {				
					state.GlobalObj.SearchParams.push( arrItem )
				}				
			}
		},

		/**
		 * Updates the global phynd object for POST
		 * 
		 * @param {*} state 
		 * @param {*} obj 
		 */
		updateGlobalObject (state, obj) {
			/**
			 * Remove facet from global object.
			 * HACK!!! City uses an array instead of object so we need
			 * to loop through.
			 */				
			if(obj.Category === "addresses.city") {
				state.GlobalObj.SearchParams = state.GlobalObj.SearchParams.filter(item => item.Field !== "addresses.city");

				for (var i=state.GlobalObj.SearchParams.length-1; i>=0; i--) {			
					if (state.GlobalObj.SearchParams[i].Field === 'addresses.addressType') {						
						state.GlobalObj.SearchParams.splice(i, 1);
					}
				}
			} else {	 
				state.GlobalObj.SearchParams = state.GlobalObj.SearchParams.filter(e => e.Field !== obj.Category);
			}
		},

		/**
		 * Sets query params
		 * 
		 * @param {*} state 
		 * @param {*} obj 
		 */
		setGlobalQuery (state, obj) {

			/**
			 * Remove Any duplicate items that match the new object
			 */
			state.GlobalQuery.QueryParams = state.GlobalQuery.QueryParams.filter(e => e.Field !== obj.Field);

			/**
			 * Add new object to array
			 */
			state.GlobalQuery.QueryParams.push(obj);			
		}
	},

	/**
	Actions dispatched from our applications are captured here
	*/
	actions : {	
		/**
		 * Assigns Geograph (zipcode / radius)
		 * 
		 * @param {*} payload 
		 */		
		async AssignGeography({commit}, payload) {
			commit('assignGeography', payload)
		},

		/**
		 * Removes Geograph (zipcode / radius)
		 * 
		 * @param {*} payload 
		 */
		async RemoveGeography({commit}) {
			commit('removeGeography')
		},

		/**
		 * Adds Zipcode to State
		 * 
		 * @param {commit} context 
		 * @param {*} payload 
		 */
		async AssignZipcode({commit}, payload) {
			commit('assignZipcode', payload)
		},

		/**
		 * Adds Radius to State
		 * 
		 * @param {commit} context 
		 * @param {*} payload 
		 */
		async AssignRadius({commit}, payload) {
			commit('assignRadius', payload)
		},		

		/**
		 * Adds Name to State
		 * 
		 * @param {commit} context 
		 * @param {*} payload 
		 */		
		async AssignName({commit}, payload) {
			commit('assignName', payload)
		},

		/**
		 * Adds Page number to State
		 * 
		 * @param {commit} context 
		 * @param {*} payload 
		 */			
		async AssignPage({commit}, payload) {
			commit('assignCurrentPage', payload)
		},

		/**
		 * Adds Loading status to State
		 * 
		 * @param {commit} context 
		 * @param {*} payload 
		 */			
		async AssignLoadingStatus({commit}, payload) {
			commit('assignLoadingStatus', payload)
		},	

		/**
		 * Adds facet to State
		 * 
		 * @param {commit} context 
		 * @param {*} payload 
		 */
		async AddFacet ({commit}, payload) {			
			commit('assignFacetList', payload)
		},

		/**
		 * Removes facet to State
		 * 
		 * @param {commit} context 
		 * @param {*} payload 
		 */
		async RemoveFacet ({commit}, payload) {			
			commit('removeFacet', payload)
		},		
		
		/**
		 * Adds facet to State
		 * 
		 * @param {commit} context 
		 * @param {*} payload 
		 */
		async AddGlobalObject({commit}, payload) {
			commit('assignGlobalObject', payload)
		},

		/**
		 * Updates state when facet is manually removed from UI
		 * 
		 * @param {commit} context 
		 * @param {*} payload 
		 */
		async UpdateObject({commit}, payload) {
			commit('updateGlobalObject', payload);
		},

		/**
		 * Adds query state
		 * 
		 * @param {commit} context 
		 * @param {*} payload 
		 */
		async AddGlobalQuery({commit}, payload) {
			commit('setGlobalQuery', payload)
		},		

		/**
		 * 
		 * @param {commit} context 
		 * @param {String} payload 
		 */
		async AddUrlQuery({commit}, payload) {
			commit('assignUrlQuery', payload)
		},
		
		/**
		 * POST call to Phynd API
		 * Distributes facet data to all facets
		 * 
		 * @param {commit} context 
		 * @param {payload} array 
		 */
		async PostFacets ({commit}, payload) {		
			commit('assignLoadingStatus', true)
			let data;

			try {
				let response = await Services.getFacetData(payload.access_token, payload.data);			
				data = response.data;	

				commit('assignResultsTotal', data.total);
				commit('assignViewCount', "12");
				commit('assignCity', data.aggregation['address|city'].items);	
				commit('assignLanguages', data.aggregation['language|name'].items);	
				commit('assignInsurance', data.aggregation['healthPlans|HealthPlanName'].items);	
				commit('assignGender', data.aggregation['providerAttributes|gender'].items);	
				commit('assignSpecialty', data.aggregation['taxonomy|specialty'].items);	
				/**
				 * Dont need to build physicians data on first screen
				 */
				if (!isInitialScreen) {
					commit('assignPhysicians', data.results);
				}					
				commit('assignLoadingStatus', false)	
			} catch (e) {
				commit('assignResultsTotal', 0);
			}									
		}				
	}
})