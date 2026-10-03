// Demo data stores dates as UTC instants ("2023-11-01T00:00:00Z"). Format them in UTC
// with a fixed locale: pages are prerendered on the build machine, so a plain
// toLocaleDateString() bakes in the build's time zone, and a visitor in another zone
// renders different text. React then reports a hydration mismatch (error #418) and
// the label shifts by a day.
const dateFormat = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC' })
const monthFormat = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', month: 'short', year: 'numeric' })

export const formatUtcDate = (value: number | string | Date): string => dateFormat.format(new Date(value))
export const formatUtcMonth = (value: number | string | Date): string => monthFormat.format(new Date(value))
