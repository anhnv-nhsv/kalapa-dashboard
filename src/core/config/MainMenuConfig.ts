export interface MenuItem {
  heading?: string;
  sectionTitle?: string;
  route?: string;
  pages?: Array<MenuItem>;
  keenthemesIcon?: string;
  bootstrapIcon?: string;
  sub?: Array<MenuItem>;
}

const MainMenuConfig: Array<MenuItem> = [
  {
    pages: [
      {
        heading: "dashboard",
        route: "/dashboard",
        keenthemesIcon: "element-11",
        bootstrapIcon: "bi-app-indicator",
      },
    ],
  },
  {
    heading: "apps",
    route: "/apps",
    pages: [
      {
        sectionTitle: "customers",
        route: "/customers",
        keenthemesIcon: "people",
        bootstrapIcon: "bi-people",
        sub: [
          {
            heading: "customerScoreListing",
            route: "/apps/customers/customer-score-list",
          },
        ],
      },
      {
        sectionTitle: "statistics",
        route: "/statistics",
        keenthemesIcon: "abstract-45",
        bootstrapIcon: "bi-graph-up",
        sub: [
          {
            heading: "requestStatistics",
            route: "/apps/statistics/request-statistics",
          },
        ],
      },
      {
        sectionTitle: "users",
        route: "/users",
        keenthemesIcon: "abstract-2",
        bootstrapIcon: "bi-graph-up",
        sub: [
          {
            heading: "userManagement",
            route: "/apps/users/user-management",
          },
        ],
      },
    ],
  },
];

export default MainMenuConfig;
