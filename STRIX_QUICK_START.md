# 🚀 Strix Quick Start

Get started with security testing in 3 steps:

## Step 1: Install Strix

```bash
curl -sSL https://strix.ai/install | bash
```

## Step 2: Set Up Environment

```bash
# Create .env.local (see ENV_SETUP.md for template)
export STRIX_LLM="openai/gpt-5"
export LLM_API_KEY="your-api-key-here"
```

## Step 3: Run Your First Scan

```bash
# Option 1: Use the helper script (recommended)
./scripts/run-strix.sh -t http://localhost:8080

# Option 2: Direct command
strix --target http://localhost:8080

# Option 3: Test source code
strix --target ./src --scan-mode quick
```

## Common Commands

```bash
# Quick scan (faster)
strix --target ./src --scan-mode quick

# Focused testing
strix --target ./src --instruction "Test authentication and authorization"

# Test local server
npm run dev  # Terminal 1
strix --target http://localhost:8080  # Terminal 2
```

## ⚠️ Remember

- Only test on **staging/test** environments
- Never test **production** without approval
- Review results in `strix_runs/` directory

For detailed documentation, see [STRIX_SETUP.md](./STRIX_SETUP.md)


