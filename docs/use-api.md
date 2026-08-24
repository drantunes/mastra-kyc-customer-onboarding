# Use the API and portal

Mastra Studio is the primary experience. The Hono API and React portal are secondary transports over the same services, workflow, state machine and repositories.

Start them in separate terminals:

```bash
npm run dev:api
npm run dev:portal
```

- API: `http://127.0.0.1:4111`
- readiness: `/health/ready`
- OpenAPI: `/openapi.json`
- portal: `http://127.0.0.1:5173`

Domain commands require idempotency keys. Reviewer routes enforce the selected demo role and tenant. Case events expose redacted status/reason data through JSON pages or SSE, and the portal falls back to polling when the stream is unavailable.

Before embedding the workflow in your application, replace the process-local demo session with production authentication and authorization, retain origin/CSRF/rate/body-size controls, and preserve opaque references and PII-safe responses. See `docs/api-and-companion.md` for the complete route and security contract.
