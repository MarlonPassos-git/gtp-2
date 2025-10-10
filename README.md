# Quiz Meme-místico

Aplicação em React criada para rodar 100% no cliente e pronta para ser publicada no GitHub Pages.

## Scripts disponíveis

- `npm install` – instala as dependências.
- `npm run dev` – inicia o ambiente de desenvolvimento com Vite.
- `npm run build` – gera os arquivos estáticos em `dist`.
- `npm run preview` – serve o build para testes locais.
- `npm run deploy` – faz o build e publica o conteúdo da pasta `dist` no branch `gh-pages` utilizando o pacote `gh-pages` (útil para deploys manuais).

## Publicando no GitHub Pages

### Deploy automático (recomendado)

O repositório conta com um workflow do GitHub Actions (`.github/workflows/deploy.yml`) que constrói o projeto e publica no GitHub Pages sempre que algo é mesclado no branch `main`.

1. Habilite o GitHub Pages em **Settings → Pages**, escolha **GitHub Actions** como a fonte e salve.
2. Faça o push do código para o branch `main`.
3. Abra um pull request ou envie commits diretamente. Assim que o merge for concluído, o workflow fará o build (`npm run build`) e publicará o resultado automaticamente.
4. Acompanhe o status em **Actions**. Ao final, o ambiente `github-pages` exibirá a URL pública (ex.: `https://usuario.github.io/quiz-meme/`).

### Deploy manual

1. Faça login no GitHub e crie um repositório para o projeto (ex.: `usuario/quiz-meme`).
2. Faça o push do código para o branch `main` desse repositório.
3. Execute `npm run deploy`. Esse comando vai criar (ou atualizar) o branch `gh-pages` com o build estático.
4. No GitHub, acesse **Settings → Pages** e selecione **Deploy from a branch**, apontando para o branch `gh-pages` e a pasta `/`.
5. Aguarde alguns minutos até que o site esteja disponível em `https://usuario.github.io/quiz-meme/`.

Caso prefira hospedar direto do branch `main`, basta copiar o conteúdo da pasta `dist` gerada pelo `npm run build` para a pasta `docs/` do repositório e habilitar o Pages para servir a partir dela.

> ℹ️ O arquivo `vite.config.js` já define `base: "./"`, garantindo que os caminhos funcionem corretamente quando o site for servido a partir de uma subpasta do GitHub Pages.
