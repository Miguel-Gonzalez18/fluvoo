import { bottomItems, navItems } from "./sidebarNav";

const EMPLOYEE_HOME_PATH = "/employee";

function normalizePath(pathname: string): string {
  const trimmed = pathname.replace(/\/$/, "");
  return trimmed || EMPLOYEE_HOME_PATH;
}

/** Returns a page title for sub-routes, or null on home (show greeting). */
export function resolveEmployeePageTitle(pathname: string): string | null {
  const path = normalizePath(pathname);
  if (path === EMPLOYEE_HOME_PATH) return null;

  const match = [...navItems, ...bottomItems].find((item) => item.href === path);
  return match?.label ?? null;
}
