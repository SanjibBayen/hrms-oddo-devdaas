import { adminRoutes } from "./adminRoutes.tsx";
import { employeeRoutes } from "./employeeRoutes.tsx";
import { publicRoutes } from "./publicRoutes.tsx";

export const routes = {
  admin: adminRoutes,
  employee: employeeRoutes,
  public: publicRoutes,
};

export default routes;
