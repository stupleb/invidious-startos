ARG IMAGE
# The companion image is distroless, so the fixed store is built in a Debian stage and copied in.
FROM debian:bookworm-slim AS ca
RUN apt-get update \
 && apt-get install -y --no-install-recommends ca-certificates \
 && ! grep -q MIICTjCCAdOgAwIBAgIKPPYHqWhwDtqLhDAKBggqhkjOPQQDAzBr /etc/ssl/certs/ca-certificates.crt

FROM ${IMAGE}
COPY --from=ca /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt
# Deno otherwise trusts its compiled-in roots instead of the system store.
ENV DENO_TLS_CA_STORE=system
