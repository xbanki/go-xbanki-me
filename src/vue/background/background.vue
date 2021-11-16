<template>

    <!-- Copyright holder information //-->
    <teleport to="main#go-xbanki-ui">

        <!-- AnimeJS based animation hooks //-->
        <transition v-on:enter="animate_copyright_enter" v-on:leave="animate_copyright_exit">

            <!-- Copyright holder & image description displays //-->
            <div class="background-copyright" v-if="data.copyright">

                <!-- Image description display //-->
                <span class="copyright-description" v-if="data.copyright.description"> {{ data.copyright.description }} </span>

                <!-- Copyright holder's information //-->
                <span class="copyright-holder" v-if="data.copyright.holder"> {{ data.copyright.holder }} </span>
            </div>
        </transition>
    </teleport>

    <!-- Background element display wrapper //-->
    <main class="component-background" ref="root"/>
</template> 

<script lang="ts" src="./background.ts"></script>
<style lang="scss" src="./background.scss"></style>