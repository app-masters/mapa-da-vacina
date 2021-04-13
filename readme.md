# Filômetro

Este projeto é divido em dois serviços:

- Backend - API do sistema feita com Adonis v5 e o banco de dados Firestore
- Frontend -

Assim que baixar o projeto, execute o comando [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) para usar a versão correta do node: `nvm use`.

# Backend / API

Para rodar o backend é preciso:

- Fazer uma cópia do `.env.example` para `.env`
- Executar `yarn` para instalar as dependências
- Executar `yarn dev`

Neste momento o servidor local já deverá estar recebendo requisições. Acesse [http://0.0.0.0:3333/](http://0.0.0.0:3333/) para confirmar o status do seu servidor local.

## Banco de dados

Estamos usando o Firestore para armazenar as informações.

# Frontend

O frontend está dividido em outros dois projetos, **_admin_** que será usado tanto para o admin quanto para o ponto de vacinação e **_front_** que será por onde o usuário verá os pontos de vacinação.

## Executando o projeto

1. Clone o repositório.
2. Navegue até a pasta do projeto (`/filometro/admin` e ou `/filometro/front`)
3. Execute `yarn` para instalar as dependências.
4. Após finalizar a instalação das dependências execute `yarn dev` para iniciar o projeto.

## Padrão de pastas (ambos os projetos)

### `/src/pages`

Contém a lógica das páginas e também o arquivo de rotas.

### `/src/views`

Contém a parte visual das páginas.

Arquivos:

- `index.tsx` - Arquivo que monta a parte visual da page
- `styles.tsx` - Styled components com media queries para o responsivo (se necessário)

### `/src/components`

São separados em: `elements`, que são componentes que possuem lógica e `ui` que são componentes sem lógica.

Arquivos de **elements**:

- `index.tsx` - Arquivo de lógica do componente, que conecta no redux (se necessário)
- `template.tsx` - Arquivo que monta a parte visual do componente
- `styles.tsx` - Styled components com media queries para o responsivo (se necessário)

Arquivos de **ui**:

- `index.tsx` - Arquivo que monta a parte visual do componente
- `styles.tsx` - Styled components com media queries para o responsivo (se necessário)

## Formulários
