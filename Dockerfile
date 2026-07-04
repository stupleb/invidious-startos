# Invidious publishes arch-split tags only (no multi-arch version tags):
#   quay.io/invidious/invidious:<version>        amd64
#   quay.io/invidious/invidious:<version>-arm64  arm64
# This Dockerfile pins both and lets buildx pick by TARGETARCH.
FROM quay.io/invidious/invidious:2.20260626.0 AS base-amd64
FROM quay.io/invidious/invidious:2.20260626.0-arm64 AS base-arm64

ARG TARGETARCH
FROM base-${TARGETARCH}
