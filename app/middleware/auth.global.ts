import { useAuthStore } from "~/entities/auth/stores/auth.store";
import { useAuth } from "~/shared/composables/useAuth";
import { PROTECTED_ROUTES } from "~/shared/constants/route";

/** Moving protected route guard here due to size of the application */
export default defineNuxtRouteMiddleware( (to): void => {
  const { logout } = useAuth();
  const { isAuthenticated } = toRefs(useAuthStore());

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    to.path === route,
  );
  if (isProtectedRoute) {
    if (!isAuthenticated.value) {
      logout();
    }
  }
});
