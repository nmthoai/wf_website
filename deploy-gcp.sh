#!/bin/bash
# Exit on any error
set -e

# Your explicit GCP Project ID from your specification
PROJECT_ID="wired-sol-490816-n7"
# Application specific name securely defined
SERVICE_NAME="wf-website"
# Define the most cost-effective region for cloud run natively
REGION="us-central1"

echo "==============================================="
echo " Deploying WorkFactory Website to Google Cloud "
echo "==============================================="

# 1. Config Local Cloud Project Environment
gcloud config set project "$PROJECT_ID"

# 2. Inform User Regarding Dependencies Check
echo ""
echo "Attempting to push Docker configuration directly to Cloud Run..."
echo "NOTE: If this asks you to enable APIs (like Cloud Build API), type 'y' to continue."

# 3. Direct Source Deployment Command
# This auto-generates the container image remotely without needing local Docker!
gcloud run deploy "$SERVICE_NAME" --source . \
  --region "$REGION" \
  --allow-unauthenticated \
  --env-vars-file .env

echo "==============================================="
echo " Deployment Successfully Completed!            "
echo " Next Step: Visit the Custom Domain mapping    "
echo " dashboard in the GCP Console to link your     "
echo " 'workfactory.ai' domain directly.             "
echo "==============================================="
