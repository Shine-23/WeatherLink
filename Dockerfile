FROM node:22-alpine
WORKDIR /app

COPY backend/package*.json ./backend/
RUN cd backend && npm ci --omit=dev

COPY backend ./backend

WORKDIR /app/backend
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "index.mjs"]
