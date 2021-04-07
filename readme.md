# Filômetro

Este projeto é divido em dois serviços:
- Backend -  API do sistema feita com Adonis v5 e o banco de dados Firestore
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
