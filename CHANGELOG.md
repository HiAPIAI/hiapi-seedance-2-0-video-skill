# Changelog

## 0.1.8

- Send the canonical HiAPI model id `seedance-2.0`.
- Keep runtime and package versions aligned to prevent false required-update loops.
- Increase the default polling window to 120 minutes and add `--timeout-minutes`.
- Preserve data URIs that contain commas.
- Prefer video outputs when a task also returns a last-frame image.
- Recognize error and cancellation terminal states.
- Preserve HTTP status and parsed response metadata on request errors.
- Clarify that `check-config --live` checks public network reachability, not API-key validity.
