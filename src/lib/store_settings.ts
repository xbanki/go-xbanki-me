import { FormatToken } from '@/vue/init_clock/init_clock';

/**
 * Internal state for all sub-category items.
 * @see {ModuleState}
 */
 export enum CategoryItemState {
    INITIAL = 'STATE_INITIAL',
    VISITED = 'STATE_VISITED',
    ACTIVE = 'STATE_ACTIVE'
}

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
    COLON = 'DELIMITER_COLON',
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
     * Category item state which controls display styles for
     * all sub-categories, giving visual feedback for items that
     * have been visited, are active and are yet to be visited in
     * critical-only mode.
     * @enum {CategoryItemState}
     */
    critical_only_categories_state: Record<string, CategoryItemState>;

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
     * Time display delimiter.
     * @enum {FormatDelimiter}
     */
    time_delimiter: FormatDelimiter;

    /**
     * Time display size.
     * @enum {DateTimeSize}
     */
    time_size: DateTimeSize;

    /**
     * Date display construction format.
     * @type {Array<Array<FormatToken> | undefined>}
     */
    date_format_active: Array<FormatToken> | undefined;

    /**
     * Time display construction format.
     * @type {Array<FormatToken> | undefined>}
     */
    time_format_active: Array<FormatToken> | undefined;

     /**
     * Unused date format tokens.
     * @type {Array<Array<FormatToken> | undefined>}
     */
    date_format_inactive: Array<FormatToken> | undefined;

    /**
     * Unused time format tokens.
     * @type {Array<FormatToken> | undefined>}
     */
    time_format_inactive: Array<FormatToken> | undefined;
}

const store: { state: ModuleState, [name: string]: any } = {

    namespaced: true,

    state: {
        background_display_method: BackgroundDisplayMethod.FIT,
        date_display_position: DateDisplayLocation.BOTTOM,
        time_convention: ClockConvention.EUROPEAN,
        selected_theme: AvaillableThemes.LIGHT,
        date_delimiter: FormatDelimiter.COMMA,
        time_delimiter: FormatDelimiter.COLON,
        date_display_format: 'cccc, MMMM d, kkkk',
        date_size: DateTimeSize.SMALL,
        time_size: DateTimeSize.MEDIUM,
        time_display_format: 'HH:mm:ss',
        date_format_inactive: undefined,
        time_format_inactive: undefined,
        date_format_active: undefined,
        time_format_active: undefined,
        critical_only_categories_state: {}
    },

    mutations: {
        SET_BACKGROUND_DISPLAY_METHOD: (state: any, payload: BackgroundDisplayMethod) => state.background_display_method = payload,

        SET_DATE_DISPLAY_POSITION: (state: any, payload: DateDisplayLocation) => state.date_display_position = payload,

        SET_CLOCK_CONVENTION: (state: any, payload: ClockConvention) => state.time_convention = payload,

        UPDATE_DATE_FORMAT_DELIMITER: (state: any, payload: FormatDelimiter) => state.date_delimiter = payload,

        UPDATE_TIME_FORMAT_DELIMITER: (state: any, payload: FormatDelimiter) => state.time_delimiter = payload,

        UPDATE_DATE_DISPLAY_FORMAT: (state: any, payload: string) => state.date_display_format = payload,

        UPDATE_TIME_DISPLAY_FORMAT: (state: any, payload: string) => state.time_display_format = payload,

        UPDATE_DATE_SIZE: (state: any, payload: DateTimeSize) => state.date_size = payload,

        UPDATE_TIME_SIZE: (state: any, payload: DateTimeSize) => state.time_size = payload,

        UPDATE_USED_THEME: (state: any, payload: AvaillableThemes) => state.selected_theme = payload,

        UPDATE_DATE_FORMAT_INACTIVE: (state: any, payload: Array<FormatToken>) => state.date_format_inactive = payload,

        UPDATE_TIME_FORMAT_INACTIVE: (state: any, payload: Array<FormatToken>) => state.time_format_inactive = payload,

        UPDATE_DATE_FORMAT_ACTIVE: (state: any, payload: Array<FormatToken>) => state.date_format_active = payload,

        UPDATE_TIME_FORMAT_ACTIVE: (state: any, payload: Array<FormatToken>) => state.time_format_active = payload,

        UPDATE_CRITICAL_ONLY_CATEGORIES_STATE: (state: any, payload: Record<string, CategoryItemState>) => state.critical_only_categories_state = payload
    },

    actions: {

        UpdateDisplayMethod: (context: any, payload: BackgroundDisplayMethod) => {

            if (context.state.background_display_method == payload) return;

            context.commit('SET_BACKGROUND_DISPLAY_METHOD', payload);
        },

        SwitchTheme: (context: any, payload: BackgroundDisplayMethod) => {

            if (context.state.selected_theme == payload) return;

            context.commit('UPDATE_USED_THEME', payload);
        },

        SetDateFormat: (context: any, payload: [Array<FormatToken>, Array<FormatToken>]) => {
            const [active_format, inactive_format] = payload;

            if (inactive_format != context.state.date_format_inactive) context.commit('UPDATE_DATE_FORMAT_INACTIVE', inactive_format);

            if (active_format != context.state.date_format_active) {
                context.commit('UPDATE_DATE_FORMAT_ACTIVE', active_format);

                const assembled_active_format: string[] = [];

                for (const item of active_format) {
                    const next_item = active_format.at(active_format.indexOf(item) + 1);

                    if (!item.token && item.delimiter) {

                        switch (context.state.date_delimiter) {
                            case FormatDelimiter.COMMA : assembled_active_format.push(', '); break;
                            case FormatDelimiter.COLON : assembled_active_format.push(':');  break;
                            case FormatDelimiter.SLASH : assembled_active_format.push('/');  break;
                            case FormatDelimiter.SPACE : assembled_active_format.push(' ');  break;
                            case FormatDelimiter.DASH  : assembled_active_format.push('-');  break;
                            case FormatDelimiter.DOT   : assembled_active_format.push('.');  break;
                        }

                        continue;
                    }

                    if (item.dynamic) {
                        let token = '';

                        if (item?.token == 'HOUR_UNPADDED') {
                            if (context.state.time_convention == ClockConvention.AMERICAN) token = 'h';
                            if (context.state.time_convention == ClockConvention.EUROPEAN) token = 'H';
                        }

                        if (item?.token == 'HOUR_PADDED') {
                            if (context.state.time_convention == ClockConvention.AMERICAN) token = 'hh';
                            if (context.state.time_convention == ClockConvention.EUROPEAN) token = 'HH';
                        }

                        if (next_item != undefined && !next_item.delimiter) token = `${token} `;

                        assembled_active_format.push(token);

                        continue;
                    }

                    if (next_item != undefined && !next_item.delimiter) {
                        assembled_active_format.push(`${item.token} `);

                        continue;
                    }

                    if (item?.token) assembled_active_format.push(item.token);
                }

                context.commit('UPDATE_DATE_DISPLAY_FORMAT', assembled_active_format.join(''));
            }
        },

        SetTimeFormat: (context: any, payload: [Array<FormatToken>, Array<FormatToken>]) => {
            const [active_format, inactive_format] = payload;

            if (inactive_format != context.state.time_format_inactive) context.commit('UPDATE_TIME_FORMAT_INACTIVE', inactive_format);

            if (active_format != context.state.time_format_active) {
                context.commit('UPDATE_TIME_FORMAT_ACTIVE', active_format);

                const assembled_active_format: string[] = [];

                for (const item of active_format) {
                    const next_item = active_format.at(active_format.indexOf(item) + 1);

                    if (!item.token && item.delimiter) {

                        switch (context.state.time_delimiter) {
                            case FormatDelimiter.COMMA : assembled_active_format.push(', '); break;
                            case FormatDelimiter.COLON : assembled_active_format.push(':');  break;
                            case FormatDelimiter.SLASH : assembled_active_format.push('/');  break;
                            case FormatDelimiter.SPACE : assembled_active_format.push(' ');  break;
                            case FormatDelimiter.DASH  : assembled_active_format.push('-');  break;
                            case FormatDelimiter.DOT   : assembled_active_format.push('.');  break;
                        }

                        continue;
                    }

                    if (item.dynamic) {
                        let token = '';

                        if (item?.token == 'HOUR_UNPADDED') {
                            if (context.state.time_convention == ClockConvention.AMERICAN) token = 'h';
                            if (context.state.time_convention == ClockConvention.EUROPEAN) token = 'H';
                        }

                        if (item?.token == 'HOUR_PADDED') {
                            if (context.state.time_convention == ClockConvention.AMERICAN) token = 'hh';
                            if (context.state.time_convention == ClockConvention.EUROPEAN) token = 'HH';
                        }

                        if (next_item != undefined && !next_item.delimiter) token = `${token} `;

                        assembled_active_format.push(token);

                        continue;
                    }

                    if (next_item != undefined && !next_item.delimiter) {
                        assembled_active_format.push(`${item.token} `);

                        continue;
                    }

                    if (item?.token) assembled_active_format.push(item.token);
                }

                context.commit('UPDATE_TIME_DISPLAY_FORMAT', assembled_active_format.join(''));
            }
        },

        UpdateCriticalCategoriesState: (context: any, payload: { target: string, state: CategoryItemState }) => {
            if (!payload.target || !payload.state) return;

            context.commit('UPDATE_CRITICAL_ONLY_CATEGORIES_STATE', Object.assign(context.state.critical_only_categories_state, { [payload.target]: payload.state }));
        }
    }
};

export default store;