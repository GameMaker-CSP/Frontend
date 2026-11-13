ARG IMAGE_REGISTRY=docker.io/library
FROM ${IMAGE_REGISTRY}/ruby:3.4-slim AS build
RUN apt-get update && apt-get install -y --no-install-recommends build-essential git ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /site
ENV BUNDLE_GEMFILE=/site/Gemfile.local
COPY Gemfile.local Gemfile.local.lock ./
RUN gem install bundler -v 4.0.19 --no-document && bundle lock --add-platform x86_64-linux aarch64-linux && bundle install
COPY . .
RUN bundle exec jekyll build --config _config.yml,_config.local.yml,_config.docker.yml --destination /output

FROM ${IMAGE_REGISTRY}/nginx:stable-alpine
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /output /usr/share/nginx/html
HEALTHCHECK --interval=30s --timeout=5s CMD wget -q -O /dev/null http://127.0.0.1/play/ || exit 1
