#!/bin/bash

# Caminho do JSON da conta de serviço
export GOOGLE_APPLICATION_CREDENTIALS="./firebase-service-account.json"

# Obtém o token de acesso
ACCESS_TOKEN=$(gcloud auth application-default print-access-token)

# Retorna o token
echo "$ACCESS_TOKEN"
