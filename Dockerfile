FROM node:lts-alpine3.19 AS builder

COPY ./package.json /app/package.json
COPY ./pnpm-lock.yaml /app/pnpm-lock.yaml
WORKDIR /app
RUN npm install -g pnpm
RUN pnpm install
COPY ./ /app
RUN pnpm run build

FROM node:lts-alpine3.19

RUN apk add nginx

COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/pnpm-lock.yaml /app/pnpm-lock.yaml
WORKDIR /app
RUN npm install -g pnpm
RUN pnpm install --prod
COPY --from=builder /app/build /app
COPY --chmod=0755 deploy/startup.sh /app/startup.sh

EXPOSE 3333
ENTRYPOINT ["/app/startup.sh"]