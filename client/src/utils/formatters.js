export function formatDateLabel(value) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export function formatCategoryLabel(value) {
  return value || "All";
}

export function getStatusTone(status) {
  if (status === "confirmed") {
    return "success";
  }
  if (status === "completed") {
    return "neutral";
  }
  if (status === "cancelled") {
    return "danger";
  }
  return "warning";
}
