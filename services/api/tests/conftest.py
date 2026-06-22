from collections.abc import Awaitable, Callable

import anyio
import httpx

from services.api.app.main import create_app


def api_request(method: str, url: str, **kwargs: object) -> httpx.Response:
    async def _request() -> httpx.Response:
        transport = httpx.ASGITransport(app=create_app())
        async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
            http_method: Callable[..., Awaitable[httpx.Response]] = getattr(client, method)
            return await http_method(url, **kwargs)

    return anyio.run(_request)
