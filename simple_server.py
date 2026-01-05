#!/usr/bin/env python3
# Minimal static HTTP server with auto-open and port selection

import contextlib
import http.server
import os
import socket
import socketserver
import threading
import time
import webbrowser
from pathlib import Path


def find_free_port(candidates=(8000, 8080, 3000, 5173, 5500)):
    for port in candidates:
        with contextlib.closing(socket.socket(socket.AF_INET, socket.SOCK_STREAM)) as s:
            try:
                s.bind(("127.0.0.1", port))
                return port
            except OSError:
                continue
    # Fallback to any free port
    with contextlib.closing(socket.socket(socket.AF_INET, socket.SOCK_STREAM)) as s:
        s.bind(("127.0.0.1", 0))
        return s.getsockname()[1]


class SilentHandler(http.server.SimpleHTTPRequestHandler):
    # Serve from repo root
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(Path(__file__).parent.resolve()), **kwargs)

    def end_headers(self):
        # Prevent aggressive caching so local preview always reflects edits.
        # Browsers can cache "/" very strongly; this makes http://127.0.0.1:8000/ reflect latest files.
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, format, *args):
        # Keep console quiet; comment out to debug
        pass


def serve():
    port = int(os.environ.get("PORT", find_free_port()))
    with socketserver.ThreadingTCPServer(("127.0.0.1", port), SilentHandler) as httpd:
        url = f"http://127.0.0.1:{port}"
        print(f"Serving at {url}")

        # Open default browser shortly after start
        threading.Timer(0.8, lambda: webbrowser.open(url)).start()

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down...")
        finally:
            with contextlib.suppress(Exception):
                httpd.server_close()


if __name__ == "__main__":
    serve()

