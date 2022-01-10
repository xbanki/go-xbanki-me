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
     * Timer function that automatically updates time data every milisecond.
     * @type {NodeJS.Timer}
     */
    timer_updater_milisecond?: NodeJS.Timer;

    /**
     * Timer function that automatically updates date data every minute.
     * @type {NodeJS.Timer}
     */
     timer_updater_minute?: NodeJS.Timer;
}

export default defineComponent({

    mounted() { this.$nextTick(() => this.set_up_date_time_data()); },

    data() {
        const state: ComponentState = { active_time_data: undefined, active_date_data: undefined };

        const data: ComponentData = { timer_updater_milisecond: undefined, timer_updater_minute: undefined };

        return { state, data };
    },

    methods: {
        set_up_date_time_data() {

            let minute_timer_align: undefined | NodeJS.Timer;

            this.data.timer_updater_milisecond = setInterval(() => this.state.active_time_data = DateTime.now().toFormat(this.settingsStore.time_display_format), 1);
            this.state.active_date_data = DateTime.now().toFormat(this.settingsStore.date_display_format);

            minute_timer_align = setTimeout(() => {
                this.data.timer_updater_minute = setInterval(() => this.state.active_date_data = DateTime.now().toFormat(this.settingsStore.date_display_format), 60000);

                minute_timer_align = undefined;

            }, DateTime.fromObject({ minute: DateTime.now().minute + 1 }).toMillis() - DateTime.now().toMillis());
        }
    },

    computed: mapState(['settingsStore'])
});