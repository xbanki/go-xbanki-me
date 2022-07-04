import { defineComponent } from 'vue';

/**
 * Currently active tab.
 */
export enum CurrentTab {
    DEFAULT  = 'MISC_TAB_DEFAULT',
    COOKIES  = 'MISC_TAB_COOKIE_USAGE',
    LICENSES = 'MISC_TAB_FOSS_LICENSES'
}

export default defineComponent({

    methods: {

        /**
         * Handles click for navigating to cookie usage page.
         */
        navigate_cookies() { this.$emit('clicked', CurrentTab.COOKIES); },

        /**
         * Handles click navigation for all FOSS licenses list.
         */
        navigate_licenses() { this.$emit('clicked', CurrentTab.LICENSES); }
    },

    emits: ['clicked']
});