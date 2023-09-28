---
slug: origami-openai
title: "Noteable and LLMs: Part 1, OpenAI and Origami"
authors: [shoup]
description: "Leveraging the power of LLMs and the Noteable APIs outside of ChatGPT"
tags:
  [
    notebooks,
    openai,
    chatgpt,
    llm,
    origami,
    python
  ]
---

# Background

When [ChatGPT](https://chat.openai.com/) burst onto the tech scene, it didn't just nudge the boundaries of conversational AI – it blew right past them. The digital landscape, already well-acquainted with the incremental wonders of technology, found itself in the throes of another revolution. But OpenAI didn’t stop there. By introducing access to [plugins](https://openai.com/blog/chatgpt-plugins), it allowed ChatGPT to seamlessly take user prompts and meld them with other services' APIs. This was not just another feature; it was a gateway to endless integrations and applications.

By early May 2023, Noteable released its own ChatGPT plugin, and almost instantly, the plugin became the go-to tool for those with an itch for data analysis. 

![](./noteable-plugin.png)

What set the Noteable plugin apart from other plugins was its ability to transform conversations into tangible data analysis, all encapsulated within a [Jupyter-notebook](https://jupyter.org/) compatible document. This breakthrough meant that users weren’t just getting answers; they were obtaining a detailed artifact of their entire analytical journey. Such a document serves as an invaluable asset for documentation, further analysis, and collaboration. The blend of conversational AI with the structured format of Jupyter notebooks provides both clarity and context, ensuring that insights derived from data aren't just momentary flashes but are well-recorded, replicable, and ready for deeper exploration.

<mark>image of chatgpt + Noteable notebook UI here</mark>

Yet, as powerful as ChatGPT plugins are, they come with their own limitations. They operate separately from the OpenAI API and, for the time being, are tied exclusively to the GPT-4 model. This naturally prompts users to contemplate the potential of wider avenues beyond a single model or user interface.

# Interacting with the Noteable API with OpenAI's function calling API

For the curious minds and the restless tinkerers, this post is for you. Let's embark on a journey to uncover how to interface with the Noteable API using its foundational python package, `origami`, while also leveraging the power of OpenAI's function calling API.

## Install Dependencies

To get started, we first need to install some Python packages into our Python environment of choice: 
+ [`origami`](https://noteable-io.github.io/origami/quickstart/)
+ [`openai`](https://platform.openai.com/docs/api-reference?lang=python)
+ [`pydantic`](https://docs.pydantic.dev/1.10/)

In a notebook environment:
```python cell
!pip install origamist openai "pydantic<2.0"
```
Or in a terminal:
```bash
pip install origamist openai "pydantic<2.0"
```
_*We're using pydantic v1.x since `origami` hasn't migrated to pydantic v2.x yet_

## Authentication
We'll need both an [`OPENAI_API_KEY`](https://platform.openai.com/docs/libraries/python-library) as well as [`NOTEABLE_TOKEN`](https://noteable-io.github.io/origami/quickstart/#api-tokens) to authenticate to both services.

```python cell
import openai
import os

openai.api_key = os.environ['OPENAI_API_KEY']
noteable_token = os.environ['NOTEABLE_TOKEN']
```

## Function Calling Setup

To enable OpenAI's function calling API to use `origami` functions, we'll need to outline a few key steps:
- generating JSON schemas for functions
- sending a request to the OpenAI chat completion API
- parsing the response with function calling arguments

Let's get started by breaking down each step. Feel free to look at the OpenAI [function calling docs](https://platform.openai.com/docs/guides/gpt/function-calling) for reference as well.

First, we'll make a convenience function to turn our functions and methods into JSON schemas for the function calling API. Using [`pydantic`](https://docs.pydantic.dev/latest/)* and the [`inspect`](https://docs.python.org/3/library/inspect.html) module together makes this very easy. We'll need this later since we don't want to create each JSON schema by hand.

```python cell
from pydantic import create_model
import inspect


def generate_function_json_schema(func):
    """Use a function/method's signature to create a Pydantic model for easy generation of a JSON
    schema.
    """
    sig = inspect.signature(func)

    # extract function parameters and their type annotations
    fields = {}
    for name, param in sig.parameters.items():
        # skip 'self' for class methods
        if name == "self":
            continue

        # determine type annotation
        type_annotation = inspect._empty
        if param.annotation != inspect.Parameter.empty:
            type_annotation = param.annotation

        # get the default value
        default_value = ...
        if param.default != inspect.Parameter.empty:
            default_value = param.default

        fields[name] = (type_annotation, default_value)

    # create the pydantic model and return its JSON schema
    model = create_model(func.__name__, **fields)
    schema = model.schema()

    # also make sure we have the description of the function
    schema['description'] = inspect.getdoc(func)
    return schema
```
:::note
If you're using `pydantic` version 2.x, you may need to change the syntax above to use `model_json_schema` instead of `.schema()`
https://docs.pydantic.dev/latest/concepts/json_schema/
:::

As a quick example of what our convenience function does:
```python cell
def test_func(foo: str, bar: int, baz: Optional[dict] = None):
    """Sample function"""
    pass

test_schema = generate_function_json_schema(test_func)
test_schema
```
```python cell output
{
    'title': 'test_func',
    'type': 'object',
    'properties': {
        'foo': {'title': 'Foo', 'type': 'string'},
        'bar': {'title': 'Bar', 'type': 'integer'},
        'baz': {'title': 'Baz', 'type': 'object'}
    },
    'required': ['foo', 'bar'],
    'description': 'Sample function'
}
```
Great! Let's keep going.

Next, we'll need to create a Noteable `APIClient` to make HTTP requests. First, using our `noteable_token` to get the default project ID.
```python cell
from origami.clients.api import APIClient

api_client = APIClient(noteable_token)
user_info = await api_client.user_info()
# use the same user-default project id as ChatGPT
project_id = user_info.origamist_default_project_id
project_id
```
```python cell output
UUID('a1b2c3d4-e5f6-4a7b-8123-abcdef123456')
```

For OpenAI to handle everything we want to accomplish, we'll need JSON schemas for the following operations:
+ creating a notebook
+ launching a kernel
+ adding cells and content
+ executing cells
+ retrieving cell output

### 1. Creating a Notebook
To create a Notebook, we'll want to make HTTP requests to the Noteable REST API with OpenAI providing the (hopefully) correct parameters.

Based on the [`origami` docs](https://noteable-io.github.io/origami/quickstart/#creating-a-new-notebook), we need to use `api_client.create_notebook()`, which takes a `project_id` (which we already have), and an optional `notebook` parameter that we don't need for this guide. 

You can either pass the `api_client.create_notebook` method directly into `generate_function_json_schema()`, or create a lightweight wrapper function, such as:
```python cell
import uuid

async def create_notebook(project_id: uuid.UUID, path: str):
    """Create a Notebook in a Project"""
    return await api_client.create_notebook(project_id, path)

create_notebook_func_schema = generate_function_json_schema(create_notebook)
create_notebook_func_schema
```
```python cell output
{
    'title': 'create_notebook',
    'type': 'object',
    'properties': {
        'project_id': {
            'title': 'Project Id',
            'type': 'string',
            'format': 'uuid'
        },
        'path': {
            'title': 'Path',
            'type': 'string'
        }
    },
    'required': ['project_id', 'path'],
    'description': 'Create a Notebook in a Project'
}
```

### 2. Launching a Kernel
We can launch a kernel using [`api_client.launch_kernel`](https://noteable-io.github.io/origami/quickstart/#launching-a-kernel), but since we can assume we'll always need a kernel running to execute code, let's update our existing wrapper function instead of creating a new one.

The new arguments we want to provide are `file_id`, `kernel_name`, and `hardware_size`.

```python cell
import uuid

async def create_notebook_and_launch_kernel(
    project_id: uuid.UUID, 
    file_path: str,
    kernel_name: str = "python3.9",
    hardware_size: str = "small",
) -> None:
    """Create a Notebook in a Project and launch a Kernel session."""
    file = await api_client.create_notebook(project_id, file_path)
    await api_client.launch_kernel(
        file_id=file.id,
        kernel_name=kernel_name,
        hardware_size=hardware_size,
    )

start_notebook_schema = generate_function_json_schema(create_notebook_and_launch_kernel)
start_notebook_schema
```
```python cell output
{
    'title': 'create_notebook_and_launch_kernel',
    'type': 'object',
    'properties': {
        'project_id': {
            'title': 'Project Id', 
            'type': 'string', 
            'format': 'uuid'
        },
        'file_path': {
            'title': 'File Path', 
            'type': 'string'
        },
        'kernel_name': {
            'title': 'Kernel Name',
            'default': 'python3.9',
            'type': 'string'
        },
        'hardware_size': {
            'title': 'Hardware Size',
            'default': 'small',
            'type': 'string'
        }
    },
    'required': ['project_id', 'file_path'],
    'description': 'Create a Notebook in a Project and launch a Kernel session.'
}
```

### 3. Adding Cells and Content
Since updating the Notebook document and executing cells are handled as part of the Real-Time Update (RTU) modeling, we need to set up our RTU client. To avoid overloading our first function for OpenAI, let's create another that will be solely responsible for connecting to a file via RTU, and then adding a cell with content.

```python cell
from origami.models.notebook import CodeCell, MarkdownCell
from typing import Literal

async def add_cell_content(
    file_id: uuid.UUID,
    cell_source: str,
    cell_type: Literal["code", "markdown"] = "code",
    after_cell_id: Optional[str] = None,
    execute: bool = False,
) -> None:
    # connect to a Notebook file via RTU
    rtu_client = await api_client.connect_realtime(file_id)
    
    # create the new cell model
    if cell_type == "code":
        new_cell = CodeCell(source=cell_source)
    elif cell_type == "markdown":
        new_cell = MarkdownCell(source=cell_source)

    # if no `after_cell_id` was passed, add it to the end of the Notebook
    if not after_cell_id:
        after_cell_id = rtu_client.cell_ids[-1]

    # add the cell to the notebook document
    cell = await rtu_client.add_cell(
        cell=cell,
        after_id=after_cell_id,
    )

    if cell_type == "markdown" or not execute:
        # return the cell immediately, without executing it
        return cell
    
    # return the cell after it's been executed
    queued_execution = await realtime_notebook.queue_execution(cell.id)
    cells = await asyncio.gather(*queued_execution)
    return cells[0]

add_cell_content_schema = generate_function_json_schema(add_cell_content)
add_cell_content_schema
```
```python cell output
{
    'title': 'add_cell_content',
    'type': 'object',
    'properties': {
        'file_id': {
            'title': 'File Id',
            'type': 'string',
            'format': 'uuid'
        },
        'cell_source': {
            'title': 'Cell Source',
            'type': 'string'
        },
        'cell_type': {
            'title': 'Cell Type',
            'default': 'code',
            'enum': ['code', 'markdown'],
            'type': 'string'
        },
        'after_cell_id': {
            'title': 'After Cell Id',
            'type': 'string'
        },
        'execute': {
            'title': 'Execute',
            'default': False,
            'type': 'boolean'
        }
    },
    'required': ['file_id', 'cell_source'],
    'description': None
}
```

### 4. Executing (Code) Cells


### 5. Retrieving Cell Output


## Prompts and Parsing Responses
