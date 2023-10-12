---
sidebar_position: 1
---

# The Noteable

Let's discover **Noteable in less than 5 minutes**.

## What is Noteable?

Noteable lets you **create, edit, and share** computational notebooks. You can do it as a human or enable LLMs to do it for you, like you see on the Noteable Plugin on ChatGPT.

## Installation

```
pip install noteable-origami
```

## Configuration

1. Log in to [Noteable](https://app.noteable.io) (sign up is free).
2. In the User Settings tab, navigate to `API Tokens` and generate a new token.
3. Set your API Token as environment variable `NOTEABLE_TOKEN`

## Creating your First Notebook

```python
import os
import asyncio
from origami.clients.api import APIClient

async def main():
    api_client = APIClient()

    user = await api_client.user_info()
    project_id = user.origamist_default_project_id

    file = await api_client.create_notebook(
        project_id=project_id,
        path="Origami Demo.ipynb"
    )
    print(file)

if __name__ == "__main__":
    asyncio.run(main())
```

