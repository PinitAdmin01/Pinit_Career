#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# deploy-functions.sh
# Deploy all Supabase Edge Functions for the PinIT Career OS project.
#
# PREREQUISITES:
#   npm install -g supabase   (or: brew install supabase/tap/supabase)
#   supabase login
#   supabase link --project-ref <your-project-ref>
#
# USAGE:
#   bash deploy-functions.sh
# ─────────────────────────────────────────────────────────────────────────────

set -e

echo "🚀 Deploying Supabase Edge Functions..."

# 1. push-dossier — secure recruiter webhook relay
echo ""
echo "📦 Deploying push-dossier..."
supabase functions deploy push-dossier --no-verify-jwt
echo "✅ push-dossier deployed."

# 2. verify-quest — serverless quest code evaluator
echo ""
echo "📦 Deploying verify-quest..."
supabase functions deploy verify-quest
echo "✅ verify-quest deployed."

echo ""
echo "🔐 Now set these secrets in Supabase Dashboard → Settings → Edge Functions:"
echo "   RECRUITER_WEBHOOK_SECRET  → your secure recruiter portal webhook bearer token"
echo "   QUEST_SIGNING_SECRET      → a random 64-char string for HMAC signing quest tokens"
echo ""
echo "   Or set via CLI:"
echo "   supabase secrets set RECRUITER_WEBHOOK_SECRET=your_secret_here"
echo "   supabase secrets set QUEST_SIGNING_SECRET=your_random_secret_here"
echo ""
echo "✅ All functions deployed successfully."
