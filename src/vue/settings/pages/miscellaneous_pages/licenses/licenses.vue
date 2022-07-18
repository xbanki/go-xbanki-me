<template>

    <!-- FOSS licenses component //-->
    <main class="component-licenses">

        <!-- Auto-generated license items //-->
        <section
        
            v-bind:key="state.licenses.indexOf(item)"
            
            v-bind:class="{ active: item.active }"

            v-for="item of state.licenses"

            class="licenses-item"

        >
            
            <!-- License item titlebar //-->
            <div class="item-title" v-on:click="toggle_dropdown_state(item)">

                <!-- State chevron display inactive //-->
                <span class="title-arrow" v-if="!item.active"> ▼ </span>

                <!-- State chevron display active //-->
                <span class="title-arrow" v-else> ▲ </span>

                <!-- Package name //-->
                <span class="title-name"> {{ item.name }} </span>

                <!-- Package home link //-->
                <a class="title-home" v-if="item.home" v-bind:href="item.home"> Home </a>
            </div>

            <!-- Rendered license content //-->
            <div class="item-content" v-if="item.active">
                
                <!-- Owner information rail //-->
                <div class="content-upper" v-if="item.author || item.email || item.repo">

                    <!-- Creator name label //-->
                    <span class="upper-name" v-if="item.author"> {{ get_styled_author(item.author) }} </span>

                    <!-- Creator contact email //-->
                    <a class="upper-email" v-if="item.email" v-bind:href="`mailto:${item.email}`"> E-Mail </a>

                    <!-- Code repository link //-->
                    <a class="upper-repo" v-bind:href="item.repo" v-if="item.repo"> Code </a>
                </div>

                <!-- Markdown rendered license display //-->
                <div class="content-display" v-html="render_content(item.content)"/>
            </div>
        </section>
    </main>
</template>

<script lang="ts" src="./licenses.ts"></script>
<style lang="scss" src="./licenses.scss" scoped></style>