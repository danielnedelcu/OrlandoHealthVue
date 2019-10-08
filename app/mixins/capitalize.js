export default {
    /**
     * Mixin
     * Capitalizes first letter
     * @param {items} array 
     */
    capitalize ( str) {
        return str.charAt(0).toUpperCase() + str.slice(1)
    },
}