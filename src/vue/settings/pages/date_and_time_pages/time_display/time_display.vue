<template>

    <!-- Time display category page root element //-->
    <main class="component-time-display">

        <!-- Time Display component title display //-->
        <span class="time-display-title"> Time Display </span>

        <!-- Clock display format //-->
        <section class="time-display-format">

            <!-- Left "non-active" format rail //-->
            <div class="format-left">

                <!-- VueDraggable based dragging container //-->
                <draggable

                    v-bind:component-data="{
                        type: 'transition-group'
                    }"

                    v-bind="{
                        ghostClass: 'dragging',
                        group: 'time-format',
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
                        group: 'time-format',
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
                                Active Time Format
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

        <!-- Static clock example //-->
        <section class="time-display-example">

            <span class="example-title"> Example </span>

            <!-- Clock example, which is static //-->
            <span class="example-display"> {{ state.display.time }} </span>
        </section>
    </main>
</template>

<script lang="ts" src="./time_display.ts"></script>
<style lang="scss" src="./time_display.scss" scoped></style>