
### 2x version changes

- Added disableFetch and disableFilters props to List provider.
- Replaced vuex store with Pinia.
- Deprecated usage of this.admin, now we use this.$admin which is defined in global properties as following:
- Added CategoryTree list component
- Added disableDelete property to DeleteButton

```js
 app.config.globalProperties.$admin = admin; 
```

Old usage:
```js
this.admin
```

New usage:
```js
this.$admin
````
- deprecated vuex module getters

Old usage:

```js
this.admin.store.getters['messages/getSnackbar'];
```
New usage:

```js
this.$store.getModule('messages').getSnackbar
```
- mapActions().checkAuth() changed as await this.$store.getModule("auth").checkAuth();
- SheetInput.vue component mapActions().checkAuth() changed as await this.$store.getModule("auth").checkAuth();
- components/layouts/Admin.vue
- components/layout/AppBar.vue
- components/layout/Footer.vue
- admin/components/ui/buttons/DeleteButton.vue
- components/NoExitWithoutSaveModal.vue

**Updated Store Functions:** 
- mapActions().login() changed as await this.$store.getModule("auth").login()

Old Usage:
```sh
 mapActions().login()
```
New Usage:
```sh
this.$store.getModule("auth").login()
```
- mapActions().checkAuth() changed as await this.$store.getModule("auth").checkAuth()

Old Usage:
```sh
mapActions().checkAuth()
```
New Usage:
```sh
this.$store.getModule("auth").checkAuth()
```

- this.$store.dispatch("auth/logout") changed as this.$store.getModule("auth").logout()

Old Usage:
```sh
this.$store.dispatch("auth/logout")
```

New Usage:
```sh
this.$store.getModule("auth").logout()
```

**Updated Providers:** 
- providers/auth/jwt.js
- providers/auth/actions.js

**Updated All Mixins:** 
- mixins/resource.js  (currentResource() relaced this.admin as this.$admin)

**Updated All Store Modules:** 
- store/api.js
- store/auth.js
- store/guest.js
- store/messages.js
- store/resource.js

**Updated Plugins & Files** 
- plugins/index.js ( added pinia )
- updated i18n/translation.js  setLocale() function

**Updated Layouts/Admin.vue Computed Functions** 
- getEmail()
- getAvatar()
- getFullname()
- getCurrentLocale()
- avatarExists()
- mapActions()
- logout()

