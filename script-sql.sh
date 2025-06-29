#!/bin/sh

# Espera hasta que MySQL esté listo
until nc -z -v -w30 $MYSQL_HOST 3306
do
  echo "Esperando a que MySQL ($MYSQL_HOST) esté listo..."
  sleep 5
done

echo "MySQL está listo, iniciando la aplicación..."

exec "$@"
