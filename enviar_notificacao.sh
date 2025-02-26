#!/bin/bash

# Obter token OAuth 2.0
ACCESS_TOKEN=$(./auth.sh)

# Verificar se o token foi gerado
if [[ -z "$ACCESS_TOKEN" ]]; then
  echo "❌ Erro ao obter o token OAuth. Verifique suas credenciais."
  exit 1
fi

# Definir o Token FCM do dispositivo
DEVICE_TOKEN="eFQJ17qpzsOUqm-DTxeBl-:APA91bHQkacwtc-9y_n45GCoNAJnSEyisGQT-fDA2rSV6eRkwC0YiyXe0AIJl_kNg_wJf8p3yRTpJntugiyZ7WtKcgJIPxzKWpDfWYEKUUZeZBMJduGIw7w"

# Criar JSON do payload da notificação
JSON_PAYLOAD=$(cat <<EOF
{
  "message": {
    "token": "$DEVICE_TOKEN",
    "notification": {
      "title": "Título Título Título Título",
      "body": "mensagem saindo as $(date) e vai chegar que horas?"
    }
  }
}
EOF
)

# Enviar a notificação via API v1 do FCM
response=$(curl -s -o .response.json -w "%{http_code}" -X POST "https://fcm.googleapis.com/v1/projects/meuteste-f0f34/messages:send" \
     -H "Authorization: Bearer $ACCESS_TOKEN" \
     -H "Content-Type: application/json" \
     -d "$JSON_PAYLOAD")

# Verificar resposta
if [[ "$response" -eq 200 ]]; then
  echo "✅ Notificação enviada com sucesso!"
else
  echo "❌ Erro ao enviar notificação. Resposta do servidor:"
  cat .response.json
fi
