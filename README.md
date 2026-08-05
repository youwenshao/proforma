# ProForma

ProForma is an open-source feasibility prototype that helps Hong Kong and Greater Bay Area law firms explore fixed- and capped-fee quoting with structured matter inputs, synthetic comparable-matter analysis, and partner-facing decision support.

**This project is not ready for real legal work.** It is trained and demonstrated on synthetic data only. ProForma is decision-support software: a partner or authorized solicitor must make every fee decision. It does not provide legal advice and must not be treated as a client-facing fee approval system.

## License

Released under the [MIT License](LICENSE). Copyright (c) 2026 Youwen Shao ([youwenshao](https://github.com/youwenshao)).

You may fork, redeploy, modify, and commercialize the software, provided you retain the copyright and permission notice.

## Stack

| Area | Path | Notes |
|------|------|--------|
| Web app | `apps/web` | Next.js (Vercel) |
| API | `services/api` | FastAPI (Fly.io) |
| ML | `ml/` | Training, inference, model cards |
| Contracts | `proforma_data/` | Shared Pydantic schemas |
| Docs | `docs/` | Requirements, ADRs, governance |

## Local development

```bash
cp .env.example .env
./start.sh install
./start.sh dev
```

- API: `http://127.0.0.1:8000`
- Web: `http://127.0.0.1:3000`

See [`.env.example`](.env.example) for web and API environment variables. For local API-only work, see [`services/api/README.md`](services/api/README.md).

## Deploy

- **Web:** Vercel project rooted at `apps/web`. Set `PROFORMA_API_URL` (and/or `NEXT_PUBLIC_PROFORMA_API_URL`) to the Fly API origin so Next.js can proxy `/v1/*`.
- **API:** Fly app configured by [`fly.toml`](fly.toml) and the root [`Dockerfile`](Dockerfile). Deploy from the repository root with `fly deploy`.

## Author

Built by [youwenshao](https://github.com/youwenshao).
