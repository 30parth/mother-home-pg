#!/bin/sh

# Set the port in nginx.conf dynamically
if [ -n "$PORT" ]; then
  echo "Setting Nginx port to $PORT..."
  sed -i "s/LISTEN_PORT/$PORT/g" /etc/nginx/http.d/default.conf
else
  echo "Setting Nginx port to 80 (default)..."
  sed -i "s/LISTEN_PORT/80/g" /etc/nginx/http.d/default.conf
fi

# Set up SQLite database if configured
if [ "$DB_CONNECTION" = "sqlite" ] || [ -z "$DB_CONNECTION" ]; then
  # Default to database/database.sqlite if DB_DATABASE is not set
  DB_PATH="${DB_DATABASE:-database/database.sqlite}"
  
  # If DB_PATH is not absolute, make it relative to the application directory
  case "$DB_PATH" in
    /*) ;;
    *) DB_PATH="/var/www/html/$DB_PATH" ;;
  esac

  if [ ! -f "$DB_PATH" ]; then
    echo "Creating SQLite database file at $DB_PATH..."
    mkdir -p "$(dirname "$DB_PATH")"
    touch "$DB_PATH"
    # Ensure correct permissions
    chown www-data:www-data "$DB_PATH"
    chmod 664 "$DB_PATH"
    # Make sure the directory is writable by www-data
    chown www-data:www-data "$(dirname "$DB_PATH")"
    chmod 775 "$(dirname "$DB_PATH")"
  fi
fi

# Run migrations
echo "Running database migrations..."
php artisan migrate --force

# Cache configuration, routes, events, and views for production
echo "Caching configuration and routes..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# Start PHP-FPM in background
echo "Starting PHP-FPM..."
php-fpm -D

# Start Nginx in foreground
echo "Starting Nginx..."
exec nginx -g "daemon off;"
