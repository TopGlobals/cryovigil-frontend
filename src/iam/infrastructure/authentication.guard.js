import useIamStore from '../application/iam.store.js';

/**
 * Navigation guard that protects non-public routes for anonymous users.
 *
 * @param {import('vue-router').RouteLocationNormalized} to - Target route.
 * @param {import('vue-router').RouteLocationNormalized} from - Current route.
 * @returns {{name: string}|boolean|undefined} - Returns true to allow navigation or an object to redirect.
 */
export const authenticationGuard = (to) => {
  const store = useIamStore();
  const isAnonymous = !store.isSignedIn;
  const authRoutes = ['/sign-in', '/sign-up'];
  const publicRoutes = [...authRoutes, '/about', '/page-not-found'];
  const routeRequiresToBeAuthenticated = !publicRoutes.includes(to.path);

  if (isAnonymous && routeRequiresToBeAuthenticated) {
    return { name: 'iam-sign-in' };
  }
  if (!isAnonymous && authRoutes.includes(to.path)) {
    return { name: 'analytics' };
  }
  return true;
};
