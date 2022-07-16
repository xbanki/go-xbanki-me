<template>

    <!-- Left-side category section //-->
    <main class="component-categories">

        <!-- Upper bar of categories //-->
        <div class="categories-bar">

            <!-- Upper close button & panel title bar //-->
            <div class="bar-upper">

                <!-- Bar close button //-->
                <button class="bar-close" v-on:click="close_settings_component"> &#215; </button>

                <!-- Navigation button back //-->
                <button class="bar-back" v-on:click="handle_navigation_previous" v-if="componentSettingsStore.is_critical_only" v-bind:disabled="internal_state.disable_back"> &#5176; </button>

                <!-- Navigation button forward //-->
                <button class="bar-forward" v-on:click="handle_navigation_next" v-if="componentSettingsStore.is_critical_only" v-bind:disabled="internal_state.disable_forward"> &#5171; </button>
            </div>

            <!--  Lower bar, for search sizing & positioning //-->
            <div class="bar-lower" v-if="!componentSettingsStore.is_critical_only">

                <!-- Categories search bar //-->
                <input class="bar-search" placeholder="Search..." ref="search" v-on:input="handle_search_input" v-bind:class="{ searching: componentSettingsStore.is_searching }"/>

                <!-- Clear search button //-->
                <button class="bar-clear" v-on:click="clear_search_content" v-if="componentSettingsStore.is_searching"> × </button>
            </div>
        </div>

        <!-- Main categories //-->
        <div class="categories-parent" v-for="[parent_category, category_items] of data.items" v-bind:key="data.items.indexOf([parent_category, category_items])">

            <!-- Render only categories that have child items //-->
            <div class="parent-item" v-if="get_category_items(category_items).length >= 1">

                <!-- Parent category title display //-->
                <span class="item-title" v-if="componentSettingsStore.is_critical_only"> {{ parent_category.name }} </span>

                <!-- Clickable category display //-->
                <div class="item-category" v-on:click="handle_parent_click(parent_category)" v-bind:class="{ 'search-filtered': parent_category.filtered }" v-else> 

                    <!-- Category display icon //-->
                    <div class="category-icon" v-bind:id="parent_category.id"/>

                    <!-- Category display label //-->
                    <span class="category-label"> {{ parent_category.name }} </span>
                </div>

                <!-- Category icon, name & selector display //-->
                <div

                    v-for="item of get_category_items(category_items)"

                    v-on:click="handle_category_click(item)"

                    v-if="componentSettingsStore.is_critical_only"

                    v-bind:key="item.id"

                    class="item-child"

                    v-bind:class="[
                        {
                            'state-initial'  : get_category_state(item.id) == 'STATE_INITIAL',
                            'state-visited'  : get_category_state(item.id) == 'STATE_VISITED',
                            'state-active'   : get_category_state(item.id) == 'STATE_ACTIVE',
                            'critical-only'  : componentSettingsStore.is_critical_only,
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