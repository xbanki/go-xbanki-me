<template>

    <!-- Date display category page root element //-->
    <main class="component-date-display">

        <!-- Date Display component title display //-->
        <span class="date-display-title" v-if="!standalone"> Date Display </span>

        <!-- Delimiter choise section //-->
        <section class="date-display-delimiter">

            <!-- Space delimiter //-->
            <div class="selections-item">

                <!-- Radio input element //-->
                <input

                    v-model="state.format.delimiter"

                    v-on:change="update_delimiter"

                    name="date-delimiter-space"

                    id="date-delimiter-space"

                    value="DELIMITER_SPACE"

                    type="radio"

                >

                <!-- Radio label element //-->
                <label for="date-delimiter-space"> Blank </label>
            </div>

            <!-- Comma delimiter //-->
            <div class="selections-item">

                <!-- Radio input element //-->
                <input

                    v-model="state.format.delimiter"

                    v-on:change="update_delimiter"

                    name="date-delimiter-comma"

                    id="date-delimiter-comma"

                    value="DELIMITER_COMMA"

                    type="radio"

                >

                <!-- Radio label element //-->
                <label for="date-delimiter-comma"> Comma </label>
            </div>

            <!-- Slash delimiter //-->
            <div class="selections-item">

                <!-- Radio input element //-->
                <input

                    v-model="state.format.delimiter"

                    v-on:change="update_delimiter"

                    name="date-delimiter-slash"

                    id="date-delimiter-slash"

                    value="DELIMITER_SLASH"

                    type="radio"

                >

                <!-- Radio label element //-->
                <label for="date-delimiter-slash"> Slash </label>
            </div>

            <!-- Dash delimiter //-->
            <div class="selections-item">

                <!-- Radio input element //-->
                <input

                    v-model="state.format.delimiter"

                    v-on:change="update_delimiter"

                    name="date-delimiter-dash"

                    id="date-delimiter-dash"

                    value="DELIMITER_DASH"

                    type="radio"

                >

                <!-- Radio label element //-->
                <label for="date-delimiter-dash"> Dash </label>
            </div>

            <!-- Dot delimiter //-->
            <div class="selections-item">

                <!-- Radio input element //-->
                <input

                    v-model="state.format.delimiter"

                    v-on:change="update_delimiter"

                    name="date-delimiter-dot"

                    id="date-delimiter-dot"

                    value="DELIMITER_DOT"

                    type="radio"

                >

                <!-- Radio label element //-->
                <label for="date-delimiter-dot"> Period </label>
            </div>

            <!-- Colon delimiter //-->
            <div class="selections-item">

                <!-- Radio input element //-->
                <input

                    v-model="state.format.delimiter"

                    v-on:change="update_delimiter"

                    name="date-delimiter-colon"

                    id="date-delimiter-colon"

                    value="DELIMITER_COLON"

                    type="radio"

                >

                <!-- Radio label element //-->
                <label for="date-delimiter-colon"> Colon </label>
            </div>
        </section>

        <!-- Date display format section //-->
        <span class="date-display-title"> Date Format </span>

        <!-- Clock display format //-->
        <section class="date-display-format">

            <!-- Left "non-active" format rail //-->
            <div class="format-left">

                <!-- VueDraggable based dragging container //-->
                <draggable

                    v-bind:component-data="{
                        type: 'transition-group'
                    }"

                    v-bind="{
                        ghostClass: 'dragging',
                        group: 'date-format',
                        animation: 120
                    }"

                    v-on:start="state.dragging = true"

                    v-on:end="state.dragging = false"

                    v-on:change="handle_drag_event"

                    v-model="state.format.inactive"

                    handle="span.item-handle"

                    class="left-group"

                    item-key="index"

                    tag="ul"

                >
                    <!-- Rail section header display //-->
                    <template v-slot:header>

                        <div class="group-header">

                            <!-- Rail title //-->
                            <span class="header-title">
                                Inactive Format Tokens
                            </span>

                            <!-- Rail delimiter mutations //-->
                            <div class="header-buttons">

                                <!-- Add new delimiter to the inactive pool //-->
                                <button class="buttons-add" v-on:click="add_new_delimiter" v-bind:disabled="state.delimiters.disable_add"> + </button>

                                <!-- Remove newest or oldest delimiter from the pool //-->
                                <button class="buttons-remove" v-on:click="remove_newest_delimiter" v-bind:disabled="state.delimiters.disable_remove"> - </button>
                            </div>
                        </div>
                    </template>

                    <!-- VueDraggable based dragging container //-->
                    <template  v-slot:item="{ element }" name="default">

                        <li class="group-item"
                        
                            v-bind:class="{
                                delimiter: element?.delimiter,
                                option: !element?.delimiter
                            }"

                            v-if="!element.disabled"
                        >

                            <!-- Dragging handle //-->
                            <span class="item-handle"> ☰ </span>

                            <!-- Delimiter format item //-->
                            <span class="item-display" v-if="element?.delimiter">
                                {{ get_delimiter(state.format.delimiter) }}
                            </span>

                            <!-- Format option item //-->
                            <span class="item-display" v-else>
                                {{ state.display[element.token] }}
                            </span>
                        </li>
                    </template>
                </draggable>
            </div>

            <!-- Right "active" format rail //-->
            <div class="format-right">

                <!-- VueDraggable based dragging container //-->
                <draggable

                    v-bind:component-data="{
                        type: 'transition-group'
                    }"

                    v-bind="{
                        ghostClass: 'dragging',
                        group: 'date-format',
                        animation: 120
                    }"

                    v-on:change="update_active_format"

                    v-on:start="state.dragging = true"

                    v-on:end="state.dragging = false"

                    v-model="state.format.active"

                    handle="span.item-handle"

                    class="right-group"

                    item-key="index"

                    tag="ul"

                >
                    <!-- Rail section header display //-->
                    <template v-slot:header>

                        <div class="group-header">

                            <!-- Rail title //-->
                            <span class="header-title">
                                Active Date Format
                            </span>
                        </div>
                    </template>

                    <!-- VueDraggable based dragging container //-->
                    <template v-slot:item="{ element }">

                        <li class="group-item"
                        
                            v-bind:class="{
                                delimiter: element?.delimiter,
                                option: !element?.delimiter
                            }"

                            v-if="!element.disabled"
                        >

                            <!-- Dragging handle //-->
                            <span class="item-handle"> ☰ </span>

                            <!-- Delimiter format item //-->
                            <span class="item-display" v-if="element?.delimiter">
                                {{ get_delimiter(state.format.delimiter) }}
                            </span>

                            <!-- Format option item //-->
                            <span class="item-display" v-else>
                                {{ state.display[element.token] }}
                            </span>
                        </li>
                    </template>
                </draggable>
            </div>
        </section>
    </main>
</template>

<script lang="ts" src="./date_display.ts"></script>
<style lang="scss" src="./date_display.scss" scoped></style>