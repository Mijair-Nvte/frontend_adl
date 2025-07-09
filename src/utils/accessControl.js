import useAuthStore from '@/store/authStore';

export function hasRole(roles) {
  const { user } = useAuthStore.getState();
  if (!user || !user.roles) return false;

  if (Array.isArray(roles)) {
    return user.roles.some(role => roles.includes(role));
  }
  return user.roles.includes(roles);
}

export function hasPermission(permissions) {
  const { user } = useAuthStore.getState();
  if (!user || !user.permissions) return false;

  if (Array.isArray(permissions)) {
    return user.permissions.some(perm => permissions.includes(perm));
  }
  return user.permissions.includes(permissions);
}
