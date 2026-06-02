build-back: ## Build the back docker image
	docker build -t todo-back back

build-front: ## Build the front docker image (needs .env.development.front)
	. ./.env.development.front && docker build --build-arg "VITE_API_URL=$$VITE_API_URL" -t todo-front front

network: ## Create the user-defined network
	docker network create todo-net

network-rm: ## Remove the user-defined network
	docker network rm todo-net

up-db: ## Start the db container (needs .env.development.db)
	docker run -d --name todo-db-container --network todo-net -p 15432:5432 --env-file .env.development.db postgres:16-alpine

up-back: ## Start the back container (needs .env.development.back)
	docker run -d --name todo-back-container --network todo-net -p 13000:3000 --env-file .env.development.back todo-back

up-front: ## Start the front container
	docker run -d --name todo-front-container -p 18080:80 todo-front

down-db: ## Stop and remove the db container
	docker rm -f todo-db-container

down-back: ## Stop and remove the back container
	docker rm -f todo-back-container

down-front: ## Stop and remove the front container
	docker rm -f todo-front-container

e2e-install: ## Install front npm deps and the playwright browser (run once)
	cd front && npm install && npx playwright install --with-deps chromium

e2e: ## Open the Playwright UI runner against the running containers (needs all three containers up + e2e-install)
	set -a && . ./.env.development.e2e && cd front && npm run e2e
