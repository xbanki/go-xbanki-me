import { DateTime }        from 'luxon';
import { mapState }        from 'vuex';
import { defineComponent } from 'vue';

/**
 * Comonent internal state.
 */
interface ComponentState {

    /**
     * Current moment in time.
     * @type {string}
     */
    active_time_data?: string;

    /**
     * Current date.
     */
    active_date_data?: string;
}

/**
 * Component data internal description interface.
 */
interface ComponentData {

    /**
     * Timer function that automatically updates date & time data.
     * @type {NodeJS.Timer}
     */
    timer_updater?: NodeJS.Timer;
}

export default defineComponent({

    mounted() { this.$nextTick(() => this.set_up_date_time_data()); },

    data() {
        const state: ComponentState = { active_time_data: undefined, active_date_data: undefined };

        const data: ComponentData = { timer_updater: undefined };

        return { state, data };
    },

    methods: {
        set_up_date_time_data() {

            this.data.timer_updater = setInterval(() => {
                this.state.active_time_data = DateTime.now().toFormat(this.settingsStore.time_display_format);
                this.state.active_date_data = DateTime.now().toFormat(this.settingsStore.date_display_format);
            }, 1000);
        }
    },

    computed: mapState(['settingsStore'])
});