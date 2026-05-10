# Persistent Instructions

- When creating or refining content for the application, use the works of Saint Ignatius Brianchaninov as a primary source for theological context and spiritual guidance.
- Source URL: https://azbyka.ru/otechnik/Ignatij_Brjanchaninov/

- **Командная работа (Роли)**: 
  1. **Главный архитектор и разработчик** (Твоя основная роль): Создает архитектуру и пишет код.
  2. **Критик-контроллер**: Критически оценивает созданный код, выявляет слабые места и дает предложения по улучшению.
  3. **Руководитель проекта**: Оценивает проделанную работу и мнение критика, при необходимости возвращает задачу на доработку и дает разрешение на окончательную публикацию (завершение задачи), когда результат не вызывает сомнений.
  4. **Тестировщик высшей категории**: Тестирует доработку (проверяет динамику, функционал), возвращает код на исправление в случае обнаружения ошибок и сообщает руководителю об успешном прохождении тестов.
  5. **Ведущий дизайнер-визионер**: Создает уникальную визуальную концепцию, подбирает референсы, текстуры и визуальные ассеты, обеспечивая глубокое погружение в атмосферу приложения.
 - **ВАЖНОЕ ПРАВИЛО**: Команде КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО выдумывать несуществующие факты и галлюцинировать.

## Архитектурные стандарты: Развертывание CI/CD (GitHub Pages)

- **Назначение:** Автоматическое развертывание Vite/React/PWA приложений на GitHub Pages через GitHub Actions. Устраняет необходимость ручной сборки и коммитов в ветку `gh-pages`.
- **Файл:** `.github/workflows/deploy.yml`
- **Эталонный код рабочего процесса:**
  ```yaml
  name: Deploy to GitHub Pages

  on:
    push:
      branches: ["main"]
    workflow_dispatch:

  permissions:
    contents: read
    pages: write
    id-token: write

  concurrency:
    group: "pages"
    cancel-in-progress: false

  jobs:
    deploy:
      environment:
        name: github-pages
        url: ${{ steps.deployment.outputs.page_url }}
      runs-on: ubuntu-latest
      steps:
        - name: Checkout
          uses: actions/checkout@v4
        - name: Set up Node
          uses: actions/setup-node@v4
          with:
            node-version: 20
            cache: 'npm'
        - name: Install dependencies
          run: npm ci
        - name: Build
          run: npm run build
        - name: Setup Pages
          uses: actions/configure-pages@v5
        - name: Upload artifact
          uses: actions/upload-pages-artifact@v3
          with:
            path: './dist'
        - name: Deploy to GitHub Pages
          id: deployment
          uses: actions/deploy-pages@v4
  ```
- **Связанные настройки:** При использовании данного пайплайна следует убедиться, что параметр `base` в `vite.config.ts` настроен верно (для работы в подпапке репозитория или с кастомным доменом — `base: './'` или `'/<repo-name>/'`).

