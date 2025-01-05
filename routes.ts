export const routes = {
  login: {
    route: "/login",
    requiredAuth: false,
  },
  register: {
    route: "/register",
    requiredAuth: false,
  },
  customers: {
    route: "/customers",
    requiredAuth: true,
  },
  settings: {
    route: "/settings",
    requiredAuth: true,
  },
  invoices: {
    route: "/invoices",
    requiredAuth: true,
  },
  auth: {
    login: {
      route: "/login",
    },
    register: {
      route: "/register",
    },
  },
} as const;
