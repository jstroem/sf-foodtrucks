FROM node:argon

# Create app directory
RUN mkdir -p /usr/src/truckthatfood
WORKDIR /usr/src/truckthatfood

COPY package.json /usr/src/truckthatfood/
RUN npm install

COPY . /usr/src/truckthatfood

RUN npm run downloadSFData

EXPOSE 3000
CMD ["npm", "start"]
