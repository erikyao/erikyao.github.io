---
category: vs-code
description: ''
tags: []
title: 'VS Code Docker: cannot build from local images'
---

当你的 Dockerfile 是 `FROM` 一个 local image，然后你在 VS Code 里右键你的 Dockerfile 再 `Build Image...`，你可能会看到这样一个 error:

```bash
> Executing task in folder foo_vscode_ws: docker build --pull --rm -f "Dockerfile" -t foo-test:0.10.x "test-docker" <

[+] Building 1.3s (4/4) FINISHED                                         
 => [internal] load build definition from Dockerfile                0.0s
 => => transferring dockerfile: 37B                                 0.0s
 => [internal] load .dockerignore                                   0.0s
 => => transferring context: 2B                                     0.0s
 => ERROR [internal] load metadata for docker.io/library/foo  1.2s
 => [auth] library/foo:pull token for registry-1.dock  0.0s
------
 > [internal] load metadata for docker.io/library/foo:0.10.x:
------
failed to solve with frontend dockerfile.v0: failed to create LLB definition: pull access denied, repository does not exist or may require authorization: server message: insufficient_scope: authorization failed
The terminal process "zsh '-c', 'docker build --pull --rm -f "Dockerfile" -t foo-test:0.10.x "test-docker"'" terminated with exit code: 1.

Terminal will be reused by tasks, press any key to close it.
```

你会发现自己 terminal 跑一个 `docker build -f Dockerfile -t foo:0.10.x` 是完全没问题的，说明这完全是 VS Code 的 Docker plugin 自己的问题。问题就出在它 `Build Image...` 命令默认会有一个参数 `--pull`:

> \-\-pull Always attempt to pull a newer version of the image

也就是说它会 pull from docker hub，所以当你是 `FROM` 一个 local image 的时候，这个 `Build Image...` 命令肯定是会 fail.

这个问题已经有人反映过了，参见 [Build image forces "--pull", makes local development inconvenient](https://github.com/microsoft/vscode-docker/issues/2443)。解决方案这个 issue 也写了，参见 [Command customization](https://code.visualstudio.com/docs/containers/reference#_command-customization):

```json
{
  "docker.commands.build": [
    {
      "label": "Default build command",
      "template": "docker build --rm -f \"${dockerfile}\" -t ${tag} \"${context}\""
    },
    {
      "label": "Alpine-specific build command",
      "template": "docker build -p 1234:1234 -f \"${dockerfile}\" -t ${tag} \"${context}\"",
      "match": "alpine"
    },
    {
      "label": "Context-specific build command",
      "template": "docker build -f \"${dockerfile}\" .",
      "contextTypes": ["moby"]
    }
  ]
}
```

一旦你定义了多个 command label，下次 `Build Image...` 就会弹出一个 list 让你选择具体是要跑哪个 command.