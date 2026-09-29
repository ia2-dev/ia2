FROM ubuntu:24.04
RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential ca-certificates cmake git libcurl4-openssl-dev pkg-config \
    && git clone --depth 1 --branch v2.6.0 https://github.com/lexbor/lexbor.git /tmp/lexbor \
    && cmake -S /tmp/lexbor -B /tmp/lexbor/build -DCMAKE_BUILD_TYPE=Release -DLEXBOR_BUILD_TESTS=OFF \
    && cmake --build /tmp/lexbor/build --parallel \
    && cmake --install /tmp/lexbor/build \
    && ldconfig \
    && rm -rf /tmp/lexbor /var/lib/apt/lists/*
