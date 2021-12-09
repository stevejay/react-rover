FROM node:16 AS build
WORKDIR /usr/src/app

COPY package.json .
COPY ./yarn.lock ./yarn.lock
COPY ./.yarn/releases/ ./.yarn/releases/
COPY ./.yarn/plugins/ ./.yarn/plugins/
COPY ./.yarnrc.yml ./.yarnrc.yml

RUN yarn

COPY ./index.html .
COPY ./tsconfig.json .
COPY ./vite.config.ts .
COPY ./.storybook ./.storybook
COPY ./src ./src

RUN yarn build:storybook

FROM node:16 AS storybook

COPY --from=build /usr/src/app/storybook-static ./storybook-static
CMD [ "npx", "serve", "storybook-static", "--listen", "5000" ]
