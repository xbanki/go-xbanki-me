<template>

    <!-- Delete data category page root element //-->
    <main class="component-delete-data">
        
        <!-- Delete Data component title display //-->
        <span class="delete-data-title"> Delete Data </span>

        <!-- Delete data buttons wrapper //-->
        <section class="delete-data-buttons">

            <!-- Delete data itself //-->
            <button class="buttons-delete" v-on:click="handle_click_delete" v-bind:disabled="state.disabled.disable_remove"> {{ state.display.remove }} </button>

            <!-- Backup all active data //-->
            <button class="buttons-backup" v-on:click="handle_click_backup" v-bind:disabled="state.disabled.disable_backup"> {{ state.display.backup }} </button>

            <!-- Restore backup data //-->
            <button class="buttons-restore" v-on:click="handle_click_restore" v-bind:disabled="state.disabled.disable_restore"> {{ state.display.restore }} </button>
        </section>
    </main>
</template>

<script lang="ts" src="./delete_data.ts"></script>
<style lang="scss" src="./delete_data.scss" scoped></style>