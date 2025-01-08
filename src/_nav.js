export default  {

  build: async function(t, admin) {

    const userRole = await admin.can(["user"]);
    const adminRole = await admin.can(["admin"]);

    return [
      // {
      //   icon: "mdi-view-dashboard-outline",
      //   text: t("menu.dashboard"),
      //   link: "/dashboard",
      // },
      {
        icon: "mdi-note-edit-outline",
        text: t("menu.posts"),
        link: "/posts",
      },
      {
        icon: "mdi-file-tree-outline",
        text: t("menu.categories"),
        link: "/categories",
      },
      {
        icon: "mdi-account-edit",
        text: t("menu.users"),
        link: "/users?sortBy=firstname&sortDesc=false&filter={\"active\":1}",
      },
      // { divider: true },
      {
        icon: "mdi-shield-outline",
        text: t("menu.security"),
        children: [
          {
            text: t("menu.failedlogins"),
            link: "/failedlogins?sortBy=attemptedAt&sortDesc=false",
          },
          {
            text: t("menu.api"),
            link: "/swagger",
          },
        ]
      },
      {
        icon: "mdi-account-lock",
        text: t("menu.authorization"),
        children: [
          {
            text: t("menu.roles"),
            link: "/roles",
          },
          {
            text: t("menu.permissions"),
            link: "/permissions",
          }
        ]
      },
    ]; // end array

  } // end func

} // end class