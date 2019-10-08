export default {
        /**
         * Mixin
         * Sorts facet array alphabetically
         * @param {items} array 
         */
        sortAlpha ( items) {
            var byName = items.slice(0);

            return byName.sort((a,b) => {
                let x = a.key.toLowerCase();
                let y = b.key.toLowerCase();
                return x < y ? -1 : x > y ? 1 : 0;
            })
        },
}