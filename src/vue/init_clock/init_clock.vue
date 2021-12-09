<template>
    
    <!-- Clock & time of date component settings //-->
    <section class="component-init-clock">

        <!-- Upper half of the clock component settings //-->
        <div class="component-init-upper">

            <!-- Right-hand-side wrapper //-->
            <div class="upper-right">
                
                <!-- Clock display format title //-->
                <span class="right-title"> Time Convention </span>

                <!-- Clock display format, 24H or AM/PM //-->
                <div class="right-convention">

                    <!-- European, or 24 hour clock convention //-->
                    <div class="convention-european">

                        <!-- Radio input element //-->
                        <input type="radio" name="convention-european" value="CONVENTION_24H" id="convention-european" v-on:change="update_realtime_options" v-model="state.active_clock_convention">

                        <!-- Radio label element //-->
                        <label for="convention-european"> 24 Hour Clock </label>
                    </div>

                    <!-- American, or AM/PM clock convention //-->
                    <div class="convention-american">

                        <!-- Radio input element //-->
                        <input type="radio" name="convention-american" value="CONVENTION_AM_PM" id="convention-american" v-on:change="update_realtime_options" v-model="state.active_clock_convention">

                        <!-- Radio label element //-->
                        <label for="convention-american"> 12 Hour Clock </label>
                    </div>
                </div>

                <!-- Clock format delimiter title //-->
                <span class="right-title"> Date Format Delimiter </span>

                <!-- Clock format delimiter, or separator //-->
                <div class="right-delimiter">

                    <!-- Space delimiter //-->
                    <div class="delimiter-space">

                        <!-- Radio input element //-->
                        <input type="radio" name="delimiter-space" id="delimiter-space" value="DELIMITER_SPACE" v-on:change="update_realtime_options" v-model="state.active_date_delimiter">

                        <!-- Radio label element //-->
                        <label for="delimiter-space"> Blank </label>
                    </div>

                    <!-- Comma delimiter //-->
                    <div class="delimiter-comma">

                        <!-- Radio input element //-->
                        <input type="radio" name="delimiter-comma" id="delimiter-comma" value="DELIMITER_COMMA" v-on:change="update_realtime_options" v-model="state.active_date_delimiter">

                        <!-- Radio label element //-->
                        <label for="delimiter-comma"> Comma </label>
                    </div>

                    <!-- Slash delimiter //-->
                    <div class="delimiter-slash">

                        <!-- Radio input element //-->
                        <input type="radio" name="delimiter-slash" id="delimiter-slash" value="DELIMITER_SLASH" v-on:change="update_realtime_options" v-model="state.active_date_delimiter">

                        <!-- Radio label element //-->
                        <label for="delimiter-slash"> Slash </label>
                    </div>

                    <!-- Dash delimiter //-->
                    <div class="delimiter-dash">

                        <!-- Radio input element //-->
                        <input type="radio" name="delimiter-dash" id="delimiter-dash" value="DELIMITER_DASH" v-on:change="update_realtime_options" v-model="state.active_date_delimiter">

                        <!-- Radio label element //-->
                        <label for="delimiter-dash"> Dash </label>
                    </div>

                    <!-- Dot delimiter //-->
                    <div class="delimiter-dot">

                        <!-- Radio input element //-->
                        <input type="radio" name="delimiter-dot" id="delimiter-dot" value="DELIMITER_DOT" v-on:change="update_realtime_options" v-model="state.active_date_delimiter">

                        <!-- Radio label element //-->
                        <label for="delimiter-dot"> Period </label>
                    </div>
                </div>
            </div>

            <!-- Left-hand-side wrapper, for date display location //-->
            <div class="upper-left">

                <!-- Positioning section title //-->
                <span class="left-title"> Date Display Position </span>

                <!-- Positioning parent //-->
                <div class="left-parent">

                    <!-- Left-side column //-->
                    <div class="parent-left">

                        <!-- Automatically generated column cells //-->
                        <div v-for="n in 3" v-bind:key="n" class="column-cell">

                            <!-- Only display middle cell //-->
                            <input v-if="n == 2" type="radio" name="location-left" id="location-left" value="LOCATION_LEFT" v-on:change="update_realtime_options" v-model="state.active_date_display_location">

                            <!-- Cell label //-->
                            <label v-if="n == 2" for="location-left"> Left </label>
                        </div>
                    </div>

                    <!-- Middle column //-->
                    <div class="parent-middle">

                        <!-- Automatically generated column cells //-->
                        <div v-for="n in 3" v-bind:key="n" class="column-cell">

                            <!-- Only display top cell //-->
                            <input v-if="n == 1" type="radio" name="location-top" id="location-top" value="LOCATION_TOP" v-on:change="update_realtime_options" v-model="state.active_date_display_location">

                            <!-- Cell label //-->
                            <label v-if="n == 1" for="location-top"> Top </label>

                            <!-- Middle cell label //-->
                            <span v-if="n == 2" class="disabled"> Middle </span>

                            <!-- Only display bottom cell //-->
                            <input v-if="n == 3" type="radio" name="location-bottom" id="location-bottom" value="LOCATION_BOTTOM"  v-on:change="update_realtime_options" v-model="state.active_date_display_location">

                            <!-- Cell label //-->
                            <label v-if="n == 3" for="location-bottom"> Bottom </label>
                        </div>
                    </div>

                    <!-- Right-side column //-->
                    <div class="parent-right">

                        <!-- Automatically generated column cells //-->
                        <div v-for="n in 3" v-bind:key="n" class="column-cell">

                            <!-- Only display middle cell //-->
                            <input v-if="n == 2" type="radio" name="location-right" id="location-right" value="LOCATION_RIGHT" v-on:change="update_realtime_options" v-model="state.active_date_display_location">

                            <!-- Cell label //-->
                            <label v-if="n == 2" for="location-right"> Right </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Lower half of the clock component settings //-->
        <div class="component-init-lower">
            
            <!-- Left-hand-side of the lower element, containing time display settings //-->
            <div class="lower-left">
                
                <!-- Time display sizing title //-->
                <span class="left-title"> Time Display Size </span>

                <!-- Time size options //-->
                <div class="left-size">

                    <!-- Size none //-->
                    <div class="size-none">

                        <!-- Radio input element //-->
                        <input type="radio" name="size-none" id="date-size-none" value="SIZE_NONE" v-on:change="update_realtime_options" v-model="state.active_date_size">

                        <!-- Radio label element //-->
                        <label for="size-none"> Hidden </label>
                    </div>

                    <!-- Size small //-->
                    <div class="size-small">

                        <!-- Radio input element //-->
                        <input type="radio" name="size-small" id="date-size-small" value="SIZE_SMALL" v-on:change="update_realtime_options" v-model="state.active_date_size">

                        <!-- Radio label element //-->
                        <label for="size-small"> Small </label>
                    </div>

                    <!-- Size medium //-->
                    <div class="size-medium">

                        <!-- Radio input element //-->
                        <input type="radio" name="size-medium" id="date-size-medium" value="SIZE_MEDIUM" v-on:change="update_realtime_options" v-model="state.active_date_size">

                        <!-- Radio label element //-->
                        <label for="size-medium"> Medium </label>
                    </div>

                    <!-- Size large //-->
                    <div class="size-large">

                        <!-- Radio input element //-->
                        <input type="radio" name="size-large" id="date-size-large" value="SIZE_LARGE" v-on:change="update_realtime_options" v-model="state.active_date_size">

                        <!-- Radio label element //-->
                        <label for="size-large"> Large </label>
                    </div>
                </div>

                <!-- Time display format title //-->
                <span class="left-title"> Time Display Format </span>

                <!-- Time format options //-->
                <div class="left-format">

                    <!-- Upper un-used format items, delimiter add & remove //-->
                    <div class="format-upper">

                        <!-- VueDraggable based dragging container //-->
                        <draggable

                            v-bind:component-data="{
                                type: 'transition-group',
                                name: 'Foo',
                                tag: 'ul'
                            }"

                            v-bind="{
                                ghostClass: 'dragging',
                                group: 'time-format',
                                animation: 120
                            }"

                            v-on:start="state.date_format_dragging = true"

                            v-on:end="state.date_format_dragging = false"

                            v-model="data.time_format_inactive"
                            
                            tag="transition-group"

                            class="upper-group"

                            item-key="index"
                        >

                            <!-- Item element slot //-->
                            <template v-slot:item="{ element }">

                                <li class="group-item delimiter" v-if="discriminate_format_item_type(element)">

                                    <!-- Delimiter format item //-->
                                    {{ state.time_delimiter_display }}
                                </li>
                                <li class="group-item option" v-else>
                                    
                                    <!-- Format option item //-->
                                    {{ element.name }}
                                </li>
                            </template>
                        </draggable>

                        <!-- Add & remove buttons //-->
                        <div class="upper-buttons">

                            <!-- Remove delimiter button //-->
                            <button class="buttons-remove" v-on:click="remove_newest_delimiter" v-bind:disabled="state.disable_remove_delimiter"> - </button>

                            <!-- Add delimiter button //-->
                            <button class="buttons-add" v-on:click="add_new_delimiter" v-bind:disabled="state.disable_add_delimiter"> + </button>
                        </div>
                    </div>

                    <!-- Lower active format items & delimiter separators //-->
                    <div class="format-lower"/>
                </div>
            </div>

            <!-- Right-hand-side of the lower element, containing date display settings //-->
            <div class="lower-right">
                
                <!-- Date display sizing title //-->
                <span class="right-title"> Date Display Size </span>

                <!-- Date size options //-->
                <div class="right-size">
                    
                    <!-- Size none //-->
                    <div class="size-none">

                        <!-- Radio input element //-->
                        <input type="radio" name="size-none" id="time-size-none" value="SIZE_NONE" v-on:change="update_realtime_options" v-model="state.active_time_size">

                        <!-- Radio label element //-->
                        <label for="size-none"> Hidden </label>
                    </div>

                    <!-- Size small //-->
                    <div class="size-small">

                        <!-- Radio input element //-->
                        <input type="radio" name="size-small" id="time-size-small" value="SIZE_SMALL" v-on:change="update_realtime_options" v-model="state.active_time_size">

                        <!-- Radio label element //-->
                        <label for="size-small"> Small </label>
                    </div>

                    <!-- Size medium //-->
                    <div class="size-medium">

                        <!-- Radio input element //-->
                        <input type="radio" name="size-medium" id="time-size-medium" value="SIZE_MEDIUM" v-on:change="update_realtime_options" v-model="state.active_time_size">

                        <!-- Radio label element //-->
                        <label for="size-"> Medium </label>
                    </div>

                    <!-- Size large //-->
                    <div class="size-large">

                        <!-- Radio input element //-->
                        <input type="radio" name="size-" id="time-size-large" value="SIZE_LARGE" v-on:change="update_realtime_options" v-model="state.active_time_size">

                        <!-- Radio label element //-->
                        <label for="size-large"> Large </label>
                    </div>
                </div>

                <!-- Date format selection title //-->
                <span class="right-title"> Date Display Format </span>

                <!-- Date format options //-->
                <div class="right-format"></div>
            </div>
        </div>
    </section>
</template>

<script lang="ts" src="./init_clock.ts"></script>
<style lang="scss" src="./init_clock.scss"></style>