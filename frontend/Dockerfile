FROM node:18-alpine AS builder

# Install python/pip and build tools cuz node-gyp is horrible
ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 py3-pip build-base

WORKDIR /app
COPY package.json .
# copy lock file (styled-components depedenency)
COPY yarn.lock .

RUN yarn

# Copy what we built into a clean image
FROM builder

WORKDIR /app

COPY . .
COPY --from=builder /app/node_modules ./node_modules

# Run as a non-root user
RUN adduser -D polygon
RUN chown -R polygon /app
USER polygon

EXPOSE 3000

CMD [ "sh", "-c", "npx next build && npx next start -p 3000" ]