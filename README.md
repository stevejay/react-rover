# react-rover

:dog2:

[![npm](https://img.shields.io/npm/v/react-rover?style=for-the-badge)](https://www.npmjs.com/package/react-rover)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/react-rover?style=for-the-badge)](https://bundlephobia.com/package/react-rover)
[![GitHub license](https://img.shields.io/github/license/stevejay/react-rover?style=for-the-badge)](https://github.com/stevejay/react-rover/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/stevejay/react-rover?style=for-the-badge)](https://github.com/stevejay/react-rover/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/stevejay/react-rover?style=for-the-badge)](https://github.com/stevejay/react-rover/issues)
[![Codacy grade](https://img.shields.io/codacy/grade/7933e4280d8642e9b503b45ff801c724?style=for-the-badge)](https://www.codacy.com/gh/stevejay/react-rover/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=stevejay/react-rover&amp;utm_campaign=Badge_Grade)
[![Code Climate maintainability](https://img.shields.io/codeclimate/maintainability/stevejay/react-rover?style=for-the-badge)](https://codeclimate.com/github/stevejay/react-rover/maintainability)
[![CodeFactor Grade](https://img.shields.io/codefactor/grade/github/stevejay/react-rover/main?style=for-the-badge)](https://www.codefactor.io/repository/github/stevejay/react-rover)

## Notes

- This is the branch for the prop getter approach code.
- In Safari, clicking a button, radio button or checkbox doesn't give the element focus. (The onfocus event does not fire.)
- The prop-types rule from eslint-plugin-react [does not support the React.VFC type](https://github.com/yannickcr/eslint-plugin-react/issues/2913).
- CodeFactor don't support an ESLint config file with the `.cjs` file extension.
- To run the E2E tests on only a single browser, use `yarn test:e2e --project=webkit`, where `project` is one of `chromium`, `firefox` or `webkit`.
- Furthermore, you can add the `--grep` option to also select a single test, as in `yarn test:e2e --project=webkit --grep "clicking on a toolbar item when focus is not in the text area"`.
- Keep an eye on when `vite-jest` is ready for use, [here](https://github.com/sodatea/vite-jest/tree/main/packages/vite-jest#limitations-and-differences-with-commonjs-tests) and [here](https://github.com/vitejs/vite/issues/1955).
- Explanation of `:focus-visible` pseudo-class [here](https://blog.chromium.org/2020/09/giving-users-and-developers-more.html).
- Component styling was derived from [Primer CSS](https://primer.style/css/).

## TODO

- Check tree-shaking.
- useGridRover
- useMenuRover

## Storybook

### Storybook Docker image

To rebuild:

```bash
docker-compose up --force-recreate --build --detach
docker image prune -f
```

To view:

```bash
open http://127.0.0.1:6007/
```

To bring down (preserving any volumes; use `-v` to remove those too):

```bash
docker-compose down
```

## Info on downshift's memoization implementation

> Everywhere we were referencing state directly in our new useMemo and useCallback hooks, we replaced with our latest ref so we don't have to worry about breaking memoization.
>
> Note in general, this is not a great idea. There's a good reason that this isn't the default for React hooks. However, for the use case of this library and the way these callbacks are called (typically during the render phase), it makes perfect sense. We don't really need to worry about preserving old closures.

Links:

- [here](https://github.com/downshift-js/downshift/pull/1051/files)
- [here](https://github.com/downshift-js/downshift/issues/1050)
- [live stream](https://youtu.be/UG3B5wjPuG0)

```javascript
function useLatestRef(val) {
  const ref = useRef(val)
  // technically this is not "concurrent mode safe" because we're manipulating
  // the value during render (so it's not idempotent). However, the places this
  // hook is used is to support memoizing callbacks which will be called
  // *during* render, so we need the latest values *during* render.
  // If not for this, then we'd probably want to use useLayoutEffect instead.
  ref.current = val
  return ref
}
```
