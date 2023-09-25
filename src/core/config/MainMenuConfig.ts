export interface MenuItem {
  heading?: string;
  sectionTitle?: string;
  route?: string;
  accessible?: boolean;
  pages?: Array<MenuItem>;
  keenthemesIcon?: string;
  bootstrapIcon?: string;
  sub?: Array<MenuItem>;
}

// const MainMenuConfig: Array<MenuItem> = [
//   {
//     accessible: true,
//     pages: [
//       {
//         heading: "dashboard",
//         route: "/dashboard",
//         accessible: true,
//         keenthemesIcon: "element-11",
//         bootstrapIcon: "bi-app-indicator",
//       },
//     ],
//   },
//   {
//     heading: "apps",
//     route: "/apps",
//     accessible: true,
//     pages: [
//       {
//         heading: "customerScoreListing",
//         route: "/apps/customers/customer-score-list",
//         accessible: "customer" in role.grantedPermissions,
//         keenthemesIcon: "people",
//         bootstrapIcon: "bi-people",
//       },
//       {
//         heading: "requestStatistics",
//         route: "/apps/statistics/request-statistics",
//         accessible: "reqStatistic" in role.grantedPermissions,
//         keenthemesIcon: "abstract-45",
//         bootstrapIcon: "bi-graph-up",
//       },
//       {
//         heading: "userManagement",
//         route: "/apps/users/user-management",
//         accessible: "usersMgmt" in role.grantedPermissions,
//         keenthemesIcon: "abstract-2",
//         bootstrapIcon: "bi-graph-up",
//       },
//     ],
//   },
// ];

export const getMainMenu = (role): Array<MenuItem> => {
  return [
    {
      accessible: true,
      pages: [
        {
          heading: "dashboard",
          route: "/dashboard",
          accessible: true,
          keenthemesIcon: "element-11",
          bootstrapIcon: "bi-app-indicator",
        },
      ],
    },
    {
      heading: "apps",
      route: "/apps",
      accessible: true,
      pages: [
        {
          heading: "customerScoreListing",
          route: "/apps/customers/customer-score-list",
          accessible: "customer" in role.grantedPermissions,
          keenthemesIcon: "people",
          bootstrapIcon: "bi-people",
        },
        {
          heading: "requestStatistics",
          route: "/apps/statistics/request-statistics",
          accessible: "reqStatistic" in role.grantedPermissions,
          keenthemesIcon: "abstract-45",
          bootstrapIcon: "bi-graph-up",
        },
        {
          heading: "userManagement",
          route: "/apps/users/user-management",
          accessible: "usersMgmt" in role.grantedPermissions,
          keenthemesIcon: "abstract-2",
          bootstrapIcon: "bi-graph-up",
        },
      ],
    },
  ];
};

export default { getMainMenu };
