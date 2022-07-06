---
latest_revision: 'Wed, 06 Jul 2022 15:51:13 +0300'
version: '0.1'
---

### What are cookies ###

Cookies are a piece of text data that websites you visit save to your browser. They are used for many things, such as user authentication to make sure the data you access is yours and only accessible by you, targeted advertising information that helps identify you so more personalized advertisements can be served to you, or saving personalization data for websites you visit to tailor the experience according to your needs.

### How we use cookies ###

We do not save any data without **explicit consent**. We only use cookies to save preference related data, so the user does not have to re-enter settings each time they visit **go.xbanki.me**.

### How we don't use cookies ###

This application **does not** use cookies for the following functions:

 - Targeted advertisements
 - User identification
 - Cross-site tracking

Specifically, we also **do not** store any data about users who have accessed this application in any other form on our side. All data gathered and used in this application is **strictly client side**, and will never be used for any other purpouses other than critical application functionality. We save cookies in an **unencrypted** and readable format which can be viewed and downloaded in the **Delete Data** section under the settings view.

### More information ###

For a more specific and technical explanation on how we use cookies, the source code of this application is **open source** and can be found [here](https://github.com/xbanki/go-xbanki-me). All cookie related code can be found at `src/lib/` in files prefixed with `store_<module>.ts`, with the saved data modules being marked in the **namespaces** array in the master `store.ts` file.