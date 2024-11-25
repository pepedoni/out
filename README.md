### Execução do Projeto
docker compose up out

curl --location 'http://127.0.0.1:9999/movies/producers/intervalAward'

### Alterando arquivo para leitura
#### Opção 1
- Mover o arquivo para pasta files
- Alterar no .env o FILE_PATH
- docker-compose up --build out

#### Opção 2
- Sobrescrever o conteudo do arquivo movielist.csv
- Executar o projeto novamente


### Executar testes
- docker compose up out-tests