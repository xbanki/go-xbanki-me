<template>

    <!-- Left-side category section //-->
    <main class="component-categories">

        <!-- Main categories //-->
        <div class="categories-parent" v-for="[parent_category, category_items] of data.items" v-bind:key="data.items.indexOf([parent_category, category_items])">

            <!-- Render only categories that have child items //-->
            <div class="parent-item" v-if="get_category_items(category_items).length >= 1">

                <!-- Parent category title display //-->
                <span class="item-title"> {{ parent_category }} </span>

                <!-- Category icon, name & selector display //-->
                <div class="item-child" v-for="item of get_category_items(category_items)" v-bind:key="item.id">

                    <!-- Category item icon display //-->
                    <div class="child-icon" v-bind:id="item.id">
                    </div>

                    <!-- Category item name display //-->
                    <div class="child-name">

                        <!-- Name display element //-->
                        <span class="name-display"> {{ item.name }} </span>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script lang="ts" src="./categories.ts"></script>
<style lang="scss" src="./categories.scss"></style>