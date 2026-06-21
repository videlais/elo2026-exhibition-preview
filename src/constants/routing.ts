const baseUrl = import.meta.env.BASE_URL ?? "/";

export const APP_BASENAME =
  baseUrl.length > 1 && baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

export function withAppBase(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return APP_BASENAME === "/" ? normalizedPath : `${APP_BASENAME}${normalizedPath}`;
}

export const DEFAULT_VERSION_SLUG = "1.0.0";

interface WorkRouteArgs {
  workId: string;
  versionSlug?: string;
  copyId?: string;
}

export function toWorkRoutePath({
  workId,
  versionSlug,
  copyId,
}: WorkRouteArgs): string {
  const segments = [workId]
    .map((segment) => segment?.trim())
    .filter((segment) => segment && segment.length > 0);

  if (versionSlug !== undefined && versionSlug.trim().length > 0) {
    segments.push(versionSlug.trim());
  }

  if (copyId !== undefined && copyId.trim().length > 0) {
    segments.push(copyId.trim());
  }

  return `/${segments.join("/")}`;
}
