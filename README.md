# Mastra KYC and Customer Onboarding

Turn a KYC application into an auditable, review-ready decision flow with durable execution, typed provider boundaries, parallel checks, and human approval built in.

This Mastra template accepts identity documents, extracts structured fields, runs identity, address, sanctions, and PEP checks in parallel, evaluates deterministic risk, and pauses for authorized compliance review. Approved cases continue through idempotent account provisioning, while every outcome keeps a traceable evidence and decision history.

## Why we built this

Customer onboarding crosses document processing, external providers, policy rules, long-running work, and high-consequence human decisions. This template shows how to coordinate those concerns as one explicit workflow without hiding authority, retry, or privacy boundaries inside an LLM prompt.

## Features

- **Durable workflows:** Mastra workflow state, branching, parallel steps, and suspend/resume keep applications moving safely across missing-information and compliance-review waits.
- **Agents and typed tools:** the KYC agent provides a conversational entry point while tools keep workflow inputs, pending actions, and resume commands schema validated.
- **Human-in-the-loop review:** every final approval or rejection comes from an authorized reviewer; screening candidates remain evidence for review, never automatic identity conclusions.
- **Provider architecture:** documented interfaces and example adapters make document extraction, verification, screening, notification, storage, and provisioning replaceable.
- **Observability and evals:** traces, redacted operational metrics, quality scorers, and repeatable datasets help teams inspect reliability and compare changes.
- **API and web experience:** run the same workflow through Mastra Studio, the HTTP API, or the included React portal.

## Demo

Use Mastra Studio, call the API, or open the included test portal to try three paths: a standard application, an application that pauses for missing information, and a sanctions candidate that requires explicit human review.

Mastra Studio, the API, and the portal are equal entry points to the same durable workflow.

You can connect this workflow to React, Next.js, or Vue applications with the [Mastra Client SDK](https://mastra.ai/en/docs/deployment/client), or use agentic UI libraries such as AI SDK UI, CopilotKit, and Assistant UI.

## Prerequisites

- Node.js 22.22.x, or 24.12.0 or newer
- npm
- An [OpenAI API key](https://platform.openai.com/api-keys) for the default agent

## Quickstart 🚀

1. **Clone the template**
   - Run `npx create-mastra@latest --template kyc-customer-onboarding` and name the project `kyc-customer-onboarding` when prompted.
2. **Add your API key**
   - Run `cd kyc-customer-onboarding && cp .env.example .env`, then add `OPENAI_API_KEY` to `.env`.
3. **Start the complete development environment**
   - Run `npm run dev` to start the portal, API, and Mastra Studio together.
   - Open the portal at [http://127.0.0.1:5173](http://127.0.0.1:5173), Mastra Studio at [http://127.0.0.1:4112](http://127.0.0.1:4112), or the API documentation at [http://127.0.0.1:4111/openapi.json](http://127.0.0.1:4111/openapi.json).

Select **KYC Onboarding Agent** and ask it to start the low-risk onboarding scenario. The workflow completes intake, extraction, four parallel checks, evidence aggregation, and deterministic risk assessment before pausing for compliance review.

The sample inputs in [`inputs-sample`](inputs-sample) cover the standard, missing-information, and sanctions-review paths.

## How it works

The agent starts `durable-kyc-onboarding-v1`, which composes the intake workflow with policy completeness, risk assessment, human review, and provisioning. Mastra runs independent verification and screening steps in parallel, persists workflow state before a suspension, and resumes only from a schema-validated command bound to the original case and run.

Provider registries keep implementation selection outside the workflow graph. Local adapters make the example repeatable, while optional OpenAI document extraction, OpenSanctions screening, structured risk narratives, and signed webhooks demonstrate production integration points. Redacted tracing and deterministic evals provide feedback without giving the model authority over compliance decisions.

## Making it yours

- [Configuration and optional integrations](docs/configuration.md)
- [Customize providers](docs/customize-providers.md)
- [Customize policy and jurisdiction](docs/customize-policy.md)
- [Add a scenario](docs/add-scenario.md)
- [Use the API and portal](docs/use-api.md)

As a template, you need to adapt it to your company's production workflow and implement the required integrations.

## Verify changes

```bash
npm test
npm run typecheck
npm run eval:baseline
npm run build
```

## About Mastra templates

[Mastra templates](https://mastra.ai/templates) are ready-to-use projects that show what you can build - clone one, explore it, and make it yours. They live in the [Mastra monorepo](https://github.com/mastra-ai/mastra) and are automatically synced to standalone repositories for easier cloning.

Want to contribute? See [CONTRIBUTING.md](https://github.com/mastra-ai/mastra/blob/main/templates/template-kyc-customer-onboarding/CONTRIBUTING.md).

This is a synthetic reference implementation, not a certified KYC product, legal advice or a substitute for your compliance program. A screening candidate is never treated as a confirmed identity match, and the workflow does not invent final compliance decisions.
