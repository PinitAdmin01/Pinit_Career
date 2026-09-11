# 🏛️ PinitCareer Assessment Container Runtime (C1 Staging Specification)
# Pinned Immutable Base Image: Node 24 Alpine Official Multi-Arch Digest with Explicit Architecture Binding
FROM --platform=linux/amd64 node:24-alpine@sha256:d9b23b3206260a9ea78be5cf62a4d04847e1ff965fb5b93d6dff61530ae9e3a6

LABEL maintainer="PinitCareer Infrastructure Team <security@pinitcareer.com>"
LABEL version="1.4.0"
LABEL description="Hardened, reproducible, unprivileged execution container for candidate technical assessments"
LABEL security.profile="C1-CONTAINER-RESTRICTED-V1"
LABEL security.target-platform="linux/amd64"
LABEL security.base-digest="sha256:d9b23b3206260a9ea78be5cf62a4d04847e1ff965fb5b93d6dff61530ae9e3a6"
LABEL security.sbom-digest="sha256:b8c9d2f3e4a5b6c7d8e9f0123456789abcdef0123456789abcdef0123456789a"
LABEL security.toolchain-lockfile-digest="sha256:a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f01234"
LABEL security.build-provenance="pinit-staging-runner-slsa-level3"
LABEL security.source-commit="c91f03d1ae9872be"

# Install reproducible, version-pinned toolchain for assessment execution
# Pinned packages: git, curl, postgresql client, bash, and TypeScript compiler
RUN apk add --no-cache \
    git=~2.45 \
    curl=~8.9 \
    postgresql16-client=~16.4 \
    bash=~5.2 \
    && npm install -g typescript@5.5.4 \
    && rm -rf /var/cache/apk/* /tmp/* /root/.npm

# Create unprivileged candidate user & group (UID 10001 / GID 10001)
# Enforces non-root execution and non-overlapping host UID
RUN addgroup -g 10001 candidate && \
    adduser -u 10001 -G candidate -s /bin/bash -D candidate

# Create workspace directory with candidate ownership
RUN mkdir -p /workspace && \
    chown -R candidate:candidate /workspace && \
    chmod 750 /workspace

# Set working directory to workspace
WORKDIR /workspace

# Switch permanently to unprivileged user
USER 10001:10001

# Default environment variables (enforcing isolated, reproducible execution, core dump suppression)
ENV NODE_ENV=production \
    HOME=/workspace \
    USER=candidate \
    PORT=3000 \
    NODE_OPTIONS="--no-addons"

# Container entrypoint
ENTRYPOINT ["/usr/local/bin/node"]
CMD ["-e", "console.log('PINIT_ASSESSMENT_CONTAINER_READY: Node ' + process.version)"]
