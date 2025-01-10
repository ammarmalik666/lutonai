#!/bin/bash

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "PostgreSQL is not installed. Please install it first."
    exit 1
fi

# Create database user and database
sudo -u postgres psql << EOF
CREATE USER lutonai_admin WITH PASSWORD 'lutonai_secure_password';
CREATE DATABASE lutonai;
GRANT ALL PRIVILEGES ON DATABASE lutonai TO lutonai_admin;
EOF

# Update .env file with database URL
echo "DATABASE_URL=\"postgresql://lutonai_admin:lutonai_secure_password@localhost:5432/lutonai\"" > .env
echo "NEXTAUTH_URL=\"http://localhost:3001\"" >> .env
echo "NEXTAUTH_SECRET=\"tO35wtJJOTq6QhUhoKD0mqphbYegS5yHjL4bTzrRwZg=\"" >> .env

# Run Prisma migrations
npx prisma migrate dev --name init

echo "Database setup completed successfully!"