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
 * Settings VueX module interface.
 * @see {VueX}
 */
export interface ModuleState {

    /**
     * Background image fitting method.
     * @enum {BackgroundDisplayMethod}
     */
    background_display_method: BackgroundDisplayMethod

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
        initialized: false
    },

    mutations: {
        SET_BACKGROUND_DISPLAY_METHOD: (state: any, payload: BackgroundDisplayMethod): BackgroundDisplayMethod => state.background_display_method = payload,

        UPDATE_USER_INITIALIZATION: (state: any, payload: boolean): boolean => state.initialized = payload
    },

    actions: {

        /**
         * Updates current background display method.
         */
        UpdateDisplayMethod: (context: any, payload: BackgroundDisplayMethod) => {

            if (context.background_display_method == payload) return;

            context.commit('SET_BACKGROUND_DISPLAY_METHOD', payload);
        },

        /**
         * Applies user initialization.
         */
        InitializeUser: (context: any) => {

            if (context.initialized == true) return;

            context.commit('UPDATE_USER_INITIALIZATION', true);
        }
    }
};

export default store;