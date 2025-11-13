#!/usr/bin/env python3
# Simple live-reload server for static LP development

from livereload import Server
from pathlib import Path


def main():
    root = Path(__file__).parent.resolve()

    server = Server()
    # Watch common assets
    server.watch(str(root / "index.html"))
    server.watch(str(root / "css" / "*.css"))
    server.watch(str(root / "js" / "*.js"))
    server.watch(str(root / "images" / "**" / "*"))
    server.watch(str(root / "videos" / "**" / "*"))

    # Serve from project root
    server.serve(root=str(root), host="127.0.0.1", port=8000, open_url_delay=1)


if __name__ == "__main__":
    main()

