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
     * @enum 
     */
    background_display_method: BackgroundDisplayMethod
}

const store: { state: ModuleState, [name: string]: any } = {

    namespaced: true,

    state: {
        background_display_method: BackgroundDisplayMethod.FIT
    },

    mutations: {
        SET_BACKGROUND_DISPLAY_METHOD: (state: any, payload: BackgroundDisplayMethod): BackgroundDisplayMethod => state.background_display_method = payload
    },

    actions: {

        /**
         * Updates current background display method.
         */
        UpdateDisplayMethod: (context: any, payload: BackgroundDisplayMethod) => {

            if (context.background_display_method == payload) return;

            context.commit('SET_BACKGROUND_DISPLAY_METHOD', payload);
        }
    }
};

export default store;