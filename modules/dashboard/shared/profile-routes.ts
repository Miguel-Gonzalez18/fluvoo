export const PROFILE_HOME = {
  employee: "/employee",
  freelancer: "/freelancer",
  business_owner: "/business",
} as const;

export type ProfileType = keyof typeof PROFILE_HOME;

export function getProfileHomePath(
  profileType: string | null | undefined
): string | undefined {
  if (!profileType || !(profileType in PROFILE_HOME)) {
    return undefined;
  }

  return PROFILE_HOME[profileType as ProfileType];
}
