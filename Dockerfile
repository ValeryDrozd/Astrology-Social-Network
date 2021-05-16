FROM node:lts-alpine
WORKDIR /usr/src/web-app

COPY . .

ARG REACT_APP_GOOGLE_CLIENT_ID
ARG REACT_APP_ADDR_NAME
ARG REACT_APP_JWT_SECRET
ARG REACT_APP_SERVER_URL

RUN yarn install
RUN yarn build

EXPOSE 4000
CMD ["npm", "run", "start"]
