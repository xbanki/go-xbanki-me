/**
 * Windows-like background image display format, to fit
 * the viewport how the user wants.
 * @see {ModuleState}
 */
export enum BackgroundDisplayMethod {
    STRETCH = 'METHOD_STRETCH',
    FILL = 'METHOD_FILL',
    FIT = 'METHOD_FIT'
}

/**
 * User theme preference, which we dynamically animate transitions
 * between. The first two options are self-explanatory, but the
 * `SYSTEM` option signals for us to fetch the theme from the
 * browser.
 * @see {ModuleState}
 */
export enum AvaillableThemes {
    DARK = 'THEME_DARK',
    LIGHT = 'THEME_LIGHT',
    SYSTEM = 'THEME_SYSTEM'
}

/**
 * Settings VueX module interface.
 * @see {VueX}
 */
export interface ModuleState {

    /**
     * Background image fitting method.
     * @enum {BackgroundDisplayMethod}
     */
    background_display_method: BackgroundDisplayMethod;

    /**
     * User-selected display theme.
     * @enum {AvaillableThemes}
     */
    selected_theme: AvaillableThemes;

    /**
     * Clock component current time display format.
     * @type {string}
     */
    time_display_format: string;

    /**
     * Clock component date display format.
     * @type {string}
     */
    date_display_format: string;

    /**
     * Indicates wether the user has completed first-time initialization.
     * @type {boolean}
     */
    initialized: boolean;
}

const store: { state: ModuleState, [name: string]: any } = {

    namespaced: true,

    state: {
        background_display_method: BackgroundDisplayMethod.FIT,
        selected_theme: AvaillableThemes.LIGHT,
        date_display_format: 'cccc, MMMM d, kkkk',
        time_display_format: 'mm:HH:ss',
        initialized: false
    },

    mutations: {
        SET_BACKGROUND_DISPLAY_METHOD: (state: any, payload: BackgroundDisplayMethod): BackgroundDisplayMethod => state.background_display_method = payload,

        UPDATE_USER_INITIALIZATION: (state: any, payload: boolean): boolean => state.initialized = payload,

        UPDATE_USED_THEME: (state: any, payload: AvaillableThemes): AvaillableThemes => state.selected_theme = payload
    },

    actions: {

        UpdateDisplayMethod: (context: any, payload: BackgroundDisplayMethod) => {

            if (context.background_display_method == payload) return;

            context.commit('SET_BACKGROUND_DISPLAY_METHOD', payload);
        },

        InitializeUser: (context: any) => {

            if (context.initialized == true) return;

            context.commit('UPDATE_USER_INITIALIZATION', true);
        },

        SwitchTheme: (context: any, payload: BackgroundDisplayMethod) => {

            if (context.selected_theme == payload) return;

            context.commit('UPDATE_USED_THEME', payload);
        }
    }
};

export default store;