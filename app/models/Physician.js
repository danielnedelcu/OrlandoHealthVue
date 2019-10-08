export default class Physician {
    /**
     * Physician Class abstraction which provides a wrapper for each
     * physician object. Makes updating properties easier by defining
     * complexity here, instead of the template.
     * @param {obj} rawData - JSON representation of each provider
     */
    constructor ( rawData = {} ) {   
        // Properties that may contain null || undefined          
        this.physicianImage = (rawData.background.photoUrl === "" || rawData.background.photoUrl === null || rawData.background.photoUrl[0] === "")                            
            ? null             
            : rawData.background.photoUrl  
        this.fullName = (rawData.providerDetails.professionalTitle !== null || rawData.providerDetails.professionalTitle !== '') 
            ? rawData.providerDetails.name.fullName + ', ' + rawData.providerDetails.professionalTitle
            : rawData.providerDetails.name.fullName  
            
            
        this.practiceName = (rawData.addresses === void 0 || rawData.addresses === null)                        
            ? null             
            : rawData.addresses[0].practiceName         
        
        this.addresses = (rawData.addresses === void 0 || rawData.addresses === null)          
            ? null 
            : rawData.addresses[0]        
        
        this.phone = (rawData.customFields === void 0 || rawData.customFields === null)                    
            ? null                 
            : rawData.customFields[0].value   

        // Properties that always  contain a given value 
        this.id = rawData.id
        this.providerId = rawData.providerID
        this.npi = rawData.npi
        this.showSchedule = false
        
        // Computed properties
        this.specialty = (rawData.specialtyDomains.filter(e => e.specialties.filter(s => s.specialtyFullName.includes('Marketing Specialty Domain:').length > 0)))
            ? rawData.specialtyDomains.filter(e => e.specialties.filter(s => s.specialtyFullName.includes('Marketing Specialty Domain:')))[0].specialties[0].specialtyFullName.split(":").pop()    
            : '';              
        this.physicianNumber = (rawData.addresses.filter(e => e.addressType === 'Primary Practice Address')[0].contactPoints === null)
            ? null
            : rawData.addresses.filter(e => e.addressType === 'Primary Practice Address')[0].contactPoints[0].info;        
        this.hasLocation = rawData.customFields.filter(e => e.name === 'Has Location Override' && e.value === 'Yes');
        this.credentialedAt = rawData.customFields.filter(e => e.name === 'Credentialed At');
        // this.canonicalfield = [{ name: 'canonical', value: 'Arnold Palmer'}]; 
        this.canonicalfield = rawData.customFields.filter(e => e.name === 'canonical');
        this.youtube = rawData.customFields.filter(e => e.name === 'YouTube Has CC' && e.value === 'true');
        this.schedule = rawData.customFields.filter(e => e.name === 'Hide Request Appointment' && e.value === 'false');
        this.employed = rawData.customFields.filter(e => e.name === 'Organization Name' && e.value.toUpperCase() === 'EMPLOYED')
        this.affiliate = rawData.customFields.filter(e => e.name === 'Organization Name' 
                        && (e.value.toUpperCase() === 'EMPLOYED'
                        || e.value.toUpperCase() === 'HOSPITALIST'
                        || e.value.toUpperCase() === 'INTENSIVIST'))
        this.url = this.buildHost()             
                 + '/physician-finder/'         
                 + this.buildUrlString(rawData.providerDetails.name.fullName + ' ' + rawData.providerDetails.professionalTitle)
                 + '?npi=' + rawData.npi        
    }

    /**
     * Getter - URL
     */    
    get getPhysicianURL () {
        return this.url
    }

    /**
     * Getter - address
     */    
    get getAddress () {
        return this.addresses.address1
    }

    /**
     * Getter - location
     */
    get getLocation () {
        return this.addresses.city + ' ' + this.addresses.state + ' ' + this.addresses.zip
    }    

    /**
     * Builds host based on the Credentialed At value and object matrix
     */
    buildHost() {
        // Grabs JSON object from cshtml
        let obj =  JSON.parse(document.getElementById('PhysiciansVariables').innerHTML);
        let hospital = '';

        //Checks if array has the key/value pair for credentials
        if(this.credentialedAt.length) {
            this.credentialedAt.forEach(( item, index ) => obj.forEach((item2) => {                         
                let firstItem = item.value.split(',')
                //if contains current domaina 
                if(item2.Hostname === window.location.hostname) {       
                    hospital = '//' + item2.Hostname
                } else {
                    if(firstItem[0] === item2.Location ) {              
                        hospital = '//' + item2.Hostname
                    }                    
                }              
            }))
        } else {
            if(!this.canonicalfield.length) {
                let host = obj.filter(e => e.Location === 'Orlando Health'); 
                hospital = '//' + host[0].Hostname       
            } else {
                obj.forEach((item2) => {
                    if(this.canonicalfield[0].value === item2.Location ) { 
                        hospital = '//' + item2.Hostname
                    }
                })
            }
        }
        return hospital
    }    

    /**
     * Removes (.) and adds (-)
     * 
     * @param {string} str 
     */
    buildUrlString (str) {
        return str.replace(/\./g,' ').replace(/\s+/g, '-').toLowerCase();
    }
}