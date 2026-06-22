"""Reserved WeChat integration surface.

Real WeChat verification, OpenID session mapping, and message reply signing are
intentionally left for the later integration stage.
"""


def verify_server_signature() -> None:
    raise NotImplementedError("WeChat integration is reserved for a later stage.")


def handle_text_message() -> None:
    raise NotImplementedError("WeChat integration is reserved for a later stage.")

