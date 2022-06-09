<template>

    <!-- Left-side category section //-->
    <main class="component-categories">

        <!-- Upper bar of categories //-->
        <div class="categories-bar">

            <!-- Upper close button & panel title bar //-->
            <div class="bar-upper">

                <!-- Bar close button //-->
                <button class="bar-close" v-on:click="close_settings_component"> × </button>
            </div>

            <!--  Lower bar, for search sizing & positioning //-->
            <div class="bar-lower" v-if="!state.critical_only">

                <!-- Categories search bar //-->
                <input class="bar-search" ref="search" v-on:input="handle_search_input" v-bind:class="{ searching: internal_state.is_searching }"/>

                <!-- Clear search button //-->
                <button class="bar-clear" v-on:click="clear_search_content" v-if="internal_state.is_searching"> × </button>
            </div>
        </div>

        <!-- Main categories //-->
        <div class="categories-parent" v-for="[parent_category, category_items] of data.items" v-bind:key="data.items.indexOf([parent_category, category_items])">

            <!-- Render only categories that have child items //-->
            <div class="parent-item" v-if="get_category_items(category_items).length >= 1">

                <!-- Parent category title display //-->
                <span class="item-title"> {{ parent_category }} </span>

                <!-- Category icon, name & selector display //-->
                <div class="item-child"
                    v-for="item of get_category_items(category_items)"
                    v-on:click="handle_category_click(item)"
                    v-bind:key="item.id"
                    v-bind:class="[
                        {
                            'search-filtered': item.filtered && internal_state.is_searching,
                            'state-initial'  : get_category_state(item.id) == 'STATE_INITIAL',
                            'state-visited'  : get_category_state(item.id) == 'STATE_VISITED',
                            'state-active'   : get_category_state(item.id) == 'STATE_ACTIVE',
                            'critical-only'  : state.critical_only,
                        },

                        item.id
                    ]"
                >

                    <!-- Category item icon display //-->
                    <div class="child-icon">

                        <!-- Top connection line showed during initialization //-->
                        <div class="icon-top">

                            <!-- Connection line display element //-->
                            <hr class="top-line" v-bind:class="{ faint: get_category_state(item.id) == 'STATE_INITIAL'}"/>
                        </div>

                        <!-- Icon container which will get populated at render time //-->
                        <div class="icon-display" v-bind:id="item.id"/>

                        <!-- Bottom connection line showed during initialization //-->
                        <div class="icon-bottom">

                            <!-- Connection line display element //-->
                            <hr class="bottom-line" v-bind:class="{ faint: (get_category_state(item.id) == 'STATE_INITIAL' || get_next_category_state(item.id) == 'STATE_INITIAL') }"/>
                        </div>
                    </div>

                    <!-- Category item name display //-->
                    <div class="child-name">

                        <!-- Name display element //-->
                        <span class="name-display"> {{ item.name }} </span>
                    </div>
                </div>
            </div>
        </div>

        <span class="categories-version">
            {{ data.version }}
        </span>
    </main>
</template>

<script lang="ts" src="./categories.ts"></script>
<style lang="scss" src="./categories.scss"></style>