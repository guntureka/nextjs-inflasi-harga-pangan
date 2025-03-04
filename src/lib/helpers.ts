export function formatLabel(value: string) {
  return value.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
}

export function getKey(value: string) {
  return value.split("/").pop();
}
