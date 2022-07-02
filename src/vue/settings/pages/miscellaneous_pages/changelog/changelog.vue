<template>

    <!-- Changelog category page root element //-->
    <main class="component-changelog">

        <!-- Changelog section titlebar //-->
        <section class="changelog-title">

            <!-- Release date marker //-->
            <span class="title-label"> Changelog </span>

            <!-- Changelog component title display //-->
            <span class="title-date"> {{ get_styled_datetime(state.latest.date) }} </span>
        </section>

        <!-- Latest update changelog rendered Markdown //-->
        <section class="changelog-latest" v-html="state.latest.html"/>

        <!-- Legacy updates label //-->
        <span class="changelog-title"> Older Updates </span>

        <!-- History of older versions //-->
        <section class="changelog-history">

            <!-- All legacy update items //-->
            <div
                class="history-item"
                
                v-for="item of state.legacy"

                v-bind:class="{ active: item.active }"

                v-bind:key="state.legacy.indexOf(item)"
            >
                <!-- Title/ activation bar //-->
                <div class="item-title" v-on:click="toggle_dropdown_state(item)">
                    
                    <!-- State chevron display inactive //-->
                    <span class="title-arrow" v-if="!item.active"> ▼ </span>

                    <!-- State chevron display active //-->
                    <span class="title-arrow" v-else> ▲ </span>

                    <!-- Changelog version //-->
                    <span class="title-version"> {{ item.version }} </span>

                    <!-- Date display label //-->
                    <span class="title-date"> {{ get_styled_datetime(state.latest.date) }} </span>
                </div>

                <!-- Rendered Markdown content //-->
                <div class="item-content" v-html="item.html"/>
            </div>
        </section>
    </main>
</template>

<script lang="ts" src="./changelog.ts"></script>
<style lang="scss" src="./changelog.scss" scoped></style>