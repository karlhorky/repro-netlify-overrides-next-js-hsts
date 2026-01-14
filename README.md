# Reproduction: Netlify overrides HSTS headers

Reproduction for Netlify overriding HSTS HTTP headers set in the [Next.js `proxy.ts` file](https://nextjs.org/docs/app/api-reference/file-conventions/proxy#setting-headers)

## Reproduction Steps

How this reproduction was created:

1. Create a new Next.js app
   ```bash
   mkdir repro-netlify-overrides-next-js-hsts
   cd repro-netlify-overrides-next-js-hsts
   pnpm create next-app . --app --no-src-dir --no-eslint --import-alias @/\* --no-tailwind --typescript --react-compiler
   ```
2. Add [a `proxy.ts` file](./proxy.ts) in the project root which [sets a `Strict-Transport-Security` response header](https://nextjs.org/docs/app/api-reference/file-conventions/proxy#setting-headers) including the `includeSubdomains` and `preload`
3. Run the build and start the server locally
4. In browser DevTools, review the `Strict-Transport-Security` response header from `localhost:3000` and observe the presence of the `includeSubdomains` and `preload` directives
   ![DevTools showing HSTS header for localhost:3000](./.readme/hsts-header-localhost.avif)
5. Remove the `packages` config from `pnpm-workspace.yaml` (to avoid [Netlify build error when inferring build command as `pnpm --filter ... build`](https://github.com/vercel/next.js/pull/88546))
6. Create a project on Netlify and deploy
7. Add a domain, and configure it to be managed by Netlify DNS (leave the default config of `www` redirecting to apex domain)
8. In browser DevTools, review the `Strict-Transport-Security` response header from the apex domain and observe the overridden header value, with a different `max-age` of `31536000` and missing `includeSubdomains` and `preload` directives 💥
   ![DevTools showing HSTS header for Netlify apex domain](./.readme/hsts-header-netlify-apex-domain.avif)
