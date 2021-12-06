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
 * Date or Time display component sizing setting.
 * @see {ModuleState}
 */
export enum DateTimeSize {
    MEDIUM = 'SIZE_MEDIUM',
    LARGE = 'SIZE_LARGE',
    SMALL = 'SIZE_SMALL',
    NONE = 'SIZE_NONE'
}

/**
 * User-defined clock convention, which we use in the
 * clock component as the display method.
 * @see {ModuleState}
 */
export enum ClockConvention {
    EUROPEAN = 'CONVENTION_24H',
    AMERICAN = 'CONVENTION_AM_PM'
}

/**
 * Specifies the delimiter, or separator between sections
 * of the clock display.
 * @see {ModuleState}
 */
export enum FormatDelimiter {
    SPACE = 'DELIMITER_SPACE',
    COMMA = 'DELIMITER_COMMA',
    SLASH = 'DELIMITER_SLASH',
    DASH = 'DELIMITER_DASH',
    DOT = 'DELIMITER_DOT'
}

/**
 * Specifies where the date stamp is displayed around the
 * current moment in time display wrapper.
 * @see {ModuleState}
 */
export enum DateDisplayLocation {
    BOTTOM = 'LOCATION_BOTTOM',
    RIGHT = 'LOCATION_RIGHT',
    LEFT = 'LOCATION_LEFT',
    TOP = 'LOCATION_TOP'
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
     * Selected display time convention.
     * @enum {ClockConvention}
     */
    time_convention: ClockConvention;

    /**
     * Date display delimiter.
     * @enum {FormatDelimiter}
     */
    date_delimiter: FormatDelimiter;

    /**
     * Location (around the counting clock) of the date display.
     * @enum {DateDisplayLocation}
     */
    date_display_position: DateDisplayLocation;

    /**
     * Date display size.
     * @enum {DateTimeSize}
     */
    date_size: DateTimeSize;

    /**
     * Time display size.
     * @enum {DateTimeSize}
     */
    time_size: DateTimeSize;

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
        date_display_position: DateDisplayLocation.BOTTOM,
        time_convention: ClockConvention.EUROPEAN,
        selected_theme: AvaillableThemes.LIGHT,
        date_delimiter: FormatDelimiter.SPACE,
        date_display_format: 'cccc, MMMM d, kkkk',
        date_size: DateTimeSize.SMALL,
        time_size: DateTimeSize.MEDIUM,
        time_display_format: 'mm:HH:ss',
        initialized: false
    },

    mutations: {
        SET_BACKGROUND_DISPLAY_METHOD: (state: any, payload: BackgroundDisplayMethod) => state.background_display_method = payload,

        SET_DATE_DISPLAY_POSITION: (state: any, payload: DateDisplayLocation) => state.date_display_position = payload,

        SET_CLOCK_CONVENTION: (state: any, payload: ClockConvention) => state.time_convention = payload,

        UPDATE_DATE_FORMAT_DELIMITER: (state: any, payload: FormatDelimiter) => state.date_delimiter = payload,

        UPDATE_USER_INITIALIZATION: (state: any, payload: boolean) => state.initialized = payload,

        UPDATE_DATE_SIZE: (state: any, payload: DateTimeSize) => state.date_size = payload,

        UPDATE_TIME_SIZE: (state: any, payload: DateTimeSize) => state.time_size = payload,

        UPDATE_USED_THEME: (state: any, payload: AvaillableThemes) => state.selected_theme = payload
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