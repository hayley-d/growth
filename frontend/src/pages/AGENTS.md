# Pages

A page is a template filled with data. Routes render pages. This is the only layer that calls query and mutation hooks and reads route params.

## Rules

- One page per route, named `<name>-page.tsx` with the component `<Name>Page`.
- Get data from `@/lib/queries` and `@/lib/mutations` hooks. Never call a service directly.
- Handle loading, error and empty states here, then pass plain data down as props.
- Read route params and search params here with the route's hooks, and pass values down.
- Layout comes from a template in `@/components/templates`. Sections come from organisms. Keep page files short: if markup grows, move it into a component.
- Every page has one `h1`.

## Tests

`<name>-page.test.tsx` next to the page, run in Chromium. Check what a person would see: the heading, the main content, the empty and error states.

Keep this file current: update it in the same commit when a new page pattern appears, such as a shared loading or error state.
