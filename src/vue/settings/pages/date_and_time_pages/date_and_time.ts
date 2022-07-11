/* eslint-disable @typescript-eslint/ban-ts-comment */

import { DateTime }        from 'luxon';
import { mapState, Store } from 'vuex';
import { defineComponent } from 'vue';

import anime from 'animejs';

import { ModuleState } from '@/lib/store_settings';

import timeConventionPageComponent from '@/vue/settings/pages/date_and_time_pages/time_convention/time_convention.vue';
import dateDisplayPageComponent    from '@/vue/settings/pages/date_and_time_pages/date_display/date_display.vue';
import timeDisplayPageComponent    from '@/vue/settings/pages/date_and_time_pages/time_display/time_display.vue';
import store                       from '@/lib/store';

/**
 * Comonent internal state.
 */
interface ComponentState {

    /**
     * Current day in time rendered based on the format.
     * @type {string}
     */
    date: string;

    /**
     * Current moment in time rendered based on the format.
     * @type {string}
     */
    time: string;

    /**
     * Last build time in RFC2822 format.
     */
    build: string;
}

export default defineComponent({

    data() {
        const typed_store = store as Store<{ settingsStore: ModuleState }>;

        // State constants

        // @ts-ignore
        const build = LAST_BUILD_TIME;

        const time = DateTime.fromRFC2822(build).toFormat(typed_store.state.settingsStore.time_display_format);

        const date = DateTime.fromRFC2822(build).toFormat(typed_store.state.settingsStore.date_display_format);

        // Final object construction

        const state: ComponentState = {
            build,
            time,
            date
        };

        return { state };
    },

    mounted() { this.$nextTick(() => this.handle_category_click()); },

    methods: {
        handle_category_click() { this; },

        handle_critical_category(name :string): boolean {

            // @ts-ignore
            const critical: boolean = this.critical_only;

            if (critical)

                // @ts-ignore
                return this.critical_categories.includes(name);

            else
                return true;
        }
    },

    components: {
        timeConventionPageComponent,
        dateDisplayPageComponent,
        timeDisplayPageComponent
    },

    watch: {
        'settingsStore.time_display_format': {
            handler(state) { this.state.time = DateTime.fromRFC2822(this.state.build).toFormat(state); },
            deep: true
        },

        'settingsStore.date_display_format': {
            handler(state) { this.state.date = DateTime.fromRFC2822(this.state.build).toFormat(state); },
            deep: true
        },

        last_clicked_category() { this.handle_category_click(); }
    },

    inject: ['critical_only', 'critical_categories', 'last_clicked_category'],

    computed: mapState(['settingsStore'])
});