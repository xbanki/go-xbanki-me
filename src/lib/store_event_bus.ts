/**
 * Settings VueX module interface.
 * @see {VueX}
 */
export interface ModuleState {

    /**
     * Is set to true when the background image has finished loading.
     * @type {boolean}
     */
    has_image_loaded: boolean;

    /**
     * Is set to true if the image load has failed.
     * @type {boolean}
     */
    has_image_load_failed: boolean;

    /**
     * Supports automatic theme matching based on OS theme.
     * @type {boolean}
     */
    supports_system_theme_switch: boolean;

    /**
     * Allows saving state to the browser's local storage.
     * @type {boolean}
     */
    supports_data_persistence: boolean;

    /**
     * Determines wether or not the application has updated significantly between last & current initialization.
     * @type {boolean}
     */
    version_change_significant_update: boolean;

    /**
     * Denotes wether or not user has completed first time initialization.
     * @type {boolean}
     */
    is_user_initialized: boolean;
}

const store: { state: ModuleState, [name: string]: any } = {

    namespaced: true,

    state: {
        has_image_loaded: false,
        is_user_initialized: true,
        has_image_load_failed: false,
        supports_data_persistence: false,
        supports_system_theme_switch: true,
        version_change_significant_update: false
    },

    mutations: {
        UPDATE_IMAGE_LOADED_STATE: (state: any, payload: boolean) => state.has_image_loaded = payload,

        UPDATE_IMAGE_LOAD_FAIL_STATE: (state: any, payload: boolean) => state.has_image_load_failed = payload,

        DISABLE_SYSTEM_THEME_SWITCH_SUPPORT: (state: any) => state.supports_system_theme_switch = false,

        ENABLE_DATA_PERSISTENCE: (state: any) => state.supports_data_persistence = true,

        DISABLE_DATA_PERSISTENCE: (state: any) => state.supports_data_persistence = false,

        SIGNAL_SIGNIFICANT_UPDATE: (state: any) => state.version_change_significant_update = true,

        START_USER_INITIALIZATION: (state: any) => state.is_user_initialized = false
    }
};

export default store;