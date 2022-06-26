import { mapState }        from 'vuex';
import { defineComponent } from 'vue';

/**
 * Delete button labels.
 */
enum DeleteButtonLabel {
    INITIAL = 'Delete Saved Data',
    CONFIRM = 'Confirm?'
}

/**
 * Backup button labels.
 */
enum BackupButtonLabel {
    INITIAL = 'Backup Saved Data',
    CONFIRM = 'Confirm?'
}

/**
 * Display label states.
 */
interface ComponentStateDisplay {

    /**
     * Delete data button label.
     * @enum {DeleteButtonLabel}
     */
    remove: DeleteButtonLabel;

    /**
     * Backup saved data button label.
     * @enum {BackupButtonLabel}
     */
    backup: BackupButtonLabel;

    /**
     * Restore backed up data button label.
     * @type {string}
     */
    restore: string;
}

/**
 * Comonent internal state.
 */
interface ComponentState {

    /**
     * Button label state.
     * @type {ComponentStateDisplay}
     */
    display: ComponentStateDisplay;
}

export default defineComponent({

    data() {

        // Display state defaults

        const remove = DeleteButtonLabel.INITIAL;

        const backup = BackupButtonLabel.INITIAL;

        const restore = 'Restore Saved Data';

        // Final assembled state objects

        const display: ComponentStateDisplay = {
            restore,
            remove,
            backup
        };

        const state: ComponentState = {
            display
        };

        return { state };
    },

    methods: {

        /**
         * Handles deletion of all user-saved cookies.
         */
        handle_click_delete() { this; },

        /**
         * Handles downloading all persisted data into a singular JSON file.
         */
        handle_click_backup() { this; },

        /**
         * Handles loading backup JSON file & setting the appropriate data.
         */
        handle_click_restore() { this; }
    },

    computed: mapState(['settingsStore', '__metaData'])
});