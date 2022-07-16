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

    /**
     * Category item state which controls display styles for
     * all sub-categories, giving visual feedback for items that
     * have been visited, are active and are yet to be visited in
     * critical-only mode.
     * @enum {CategoryItemState}
     */
    critical_only_categories_state: Record<string, CategoryItemState>;

    /**
     * Denotes wether or not we are in critical-only (initialization)
     * mode.
     * @type {boolean}
     */
    critical_only: boolean;

    /**
     * The last clicked category.
     * @type {string}
     */
    last_clicked_category?: string;

    /**
     * Settings component render state.
     * @type {boolean}
     */
    render_settings: boolean;
}

/**
 * Internal state for all sub-category items.
 * @see {ModuleState}
 */
export enum CategoryItemState {
    INITIAL = 'STATE_INITIAL',
    VISITED = 'STATE_VISITED',
    ACTIVE = 'STATE_ACTIVE'
}

const store: { state: ModuleState, [name: string]: any } = {

    namespaced: true,

    state: {
        critical_only: false,
        render_settings: false,
        has_image_loaded: false,
        is_user_initialized: true,
        has_image_load_failed: false,
        supports_data_persistence: false,
        supports_system_theme_switch: true,
        critical_only_categories_state: { },
        version_change_significant_update: false
    },

    mutations: {
        UPDATE_CRITICAL_ONLY_CATEGORIES_STATE: (state: ModuleState, payload: Record<string, CategoryItemState>) => state.critical_only_categories_state = payload,

        DISABLE_SYSTEM_THEME_SWITCH_SUPPORT: (state: ModuleState) => state.supports_system_theme_switch = false,

        UPDATE_LAST_CLICKED_CATEGORY: (state: ModuleState, payload?: string) => state.last_clicked_category = payload,

        UPDATE_SETTINGS_RENDER_STATE: (state: ModuleState, payload: boolean) => state.render_settings = payload,

        UPDATE_IMAGE_LOAD_FAIL_STATE: (state: ModuleState, payload: boolean) => state.has_image_load_failed = payload,

        SIGNAL_SIGNIFICANT_UPDATE: (state: ModuleState) => state.version_change_significant_update = true,

        START_USER_INITIALIZATION: (state: ModuleState) => state.is_user_initialized = false,

        UPDATE_IMAGE_LOADED_STATE: (state: ModuleState, payload: boolean) => state.has_image_loaded = payload,

        DISABLE_DATA_PERSISTENCE: (state: ModuleState) => state.supports_data_persistence = false,

        ENABLE_DATA_PERSISTENCE: (state: ModuleState) => state.supports_data_persistence = true,

        UPDATE_CRITICAL_ONLY: (state: ModuleState, payload: boolean) => state.critical_only = payload
    },

    actions: {

        UpdateCategoriesState: (context: any, payload: { target: string, state: CategoryItemState }) => {

            if (!payload.target || !payload.state) return;

            context.commit('UPDATE_CRITICAL_ONLY_CATEGORIES_STATE', Object.assign(context.state.critical_only_categories_state, { [payload.target]: payload.state }));
        }
    }
};

export default store;