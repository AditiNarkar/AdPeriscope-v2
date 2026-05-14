export function buildReportFilename(workspaceSlug: string, title: string) {
  const safeTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return `${workspaceSlug}/${safeTitle}-${Date.now()}.pdf`;
}
