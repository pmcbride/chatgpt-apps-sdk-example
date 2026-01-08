
# Variables
NODE_BIN := ./node_modules/.bin

.PHONY: install build dev start test lint clean tf-init tf-plan tf-apply inspector

# Application Commands
install:
	npm install

build:
	npm run build

dev:
	npm run dev

start:
	npm start

start-http:
	npm run start:http

test:
	node test-server.mjs

inspector:
	npx @modelcontextprotocol/inspector@latest node dist/server.js

lint:
	npx tsc --noEmit

clean:
	rm -rf dist assets node_modules

# Infrastructure Commands
tf-init:
	cd terraform && terraform init

tf-plan:
	cd terraform && terraform plan

tf-apply:
	cd terraform && terraform apply
