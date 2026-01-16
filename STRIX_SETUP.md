# Strix Security Testing Setup Guide

This guide will help you set up and run Strix AI-powered penetration testing on your application.

## 🎯 What is Strix?

Strix is an open-source AI agent that performs automated security testing by:
- Running your code dynamically
- Finding vulnerabilities with proof-of-concepts
- Validating security issues (not just false positives)
- Providing actionable remediation steps

## ⚠️ Important Security Notes

**CRITICAL:** Strix performs **real attacks** on your application. Only use it on:
- ✅ Local development environments
- ✅ Staging/test environments you control
- ✅ Applications you own or have explicit permission to test
- ❌ **NEVER** run on production without explicit approval
- ❌ **NEVER** test applications you don't own

## 📋 Prerequisites

1. **Docker** (must be running)
   ```bash
   # Check if Docker is running
   docker ps
   ```

2. **LLM Provider API Key** (choose one):
   - OpenAI GPT-5 (recommended): https://platform.openai.com/api-keys
   - Anthropic Claude Sonnet 4.5: https://console.anthropic.com/
   - Or use a local LLM (Ollama, LMStudio)

3. **Environment Variables** (see `.env.example`)

## 🚀 Quick Start

### Step 1: Install Strix

```bash
# Install via curl (recommended)
curl -sSL https://strix.ai/install | bash

# Or via pipx
pipx install strix-agent

# Verify installation
strix --version
```

### Step 2: Configure Environment Variables

1. Copy the example file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your API keys:
   ```bash
   export STRIX_LLM="openai/gpt-5"
   export LLM_API_KEY="your-api-key-here"
   ```

3. Source the environment variables:
   ```bash
   source .env.local
   ```

### Step 3: Run Your First Scan

#### Option A: Test Local Development Server

```bash
# Terminal 1: Start your dev server
npm run dev

# Terminal 2: Run Strix (wait for server to start)
strix --target http://localhost:8080
```

#### Option B: Test Source Code

```bash
# Test the codebase for security issues
strix --target ./src --instruction "Focus on authentication, authorization, and input validation vulnerabilities"
```

#### Option C: Test Specific Areas

```bash
# Test authentication system
strix --target ./src/lib/auth.ts --target ./src/components/AuthGuard.tsx \
  --instruction "Test for authentication bypass and session management flaws"

# Test API endpoints (if you have a staging URL)
strix --target https://your-staging-url.supabase.co \
  --instruction "Test Edge Functions for injection vulnerabilities and authorization bypass"
```

## 🔧 Advanced Usage

### Focused Testing Scenarios

```bash
# Test payment processing security
strix --target ./supabase/functions/stripe-provincial-webhook \
  --instruction "Focus on webhook security, payment validation, and business logic flaws"

# Test form inputs for XSS and injection
strix --target ./src/components/forms \
  --instruction "Test all form inputs for XSS, SQL injection, and input validation bypass"

# Test admin functionality
strix --target ./src/pages/admin \
  --instruction "Test for privilege escalation, IDOR vulnerabilities, and authorization bypass"
```

### Headless Mode (CI/CD)

```bash
# Non-interactive mode for automated testing
strix -n --target http://localhost:8080 --scan-mode quick
```

### Multi-Target Testing

```bash
# Test both source code and deployed application
strix \
  --target ./src \
  --target https://staging.your-app.com \
  --instruction "Comprehensive security assessment"
```

## 📊 Understanding Results

Strix generates reports in `strix_runs/<run-name>/` with:
- **Vulnerability findings** with severity ratings
- **Proof-of-concept** exploits demonstrating the issues
- **Remediation steps** to fix each vulnerability
- **Detailed logs** of the testing process

### Common Vulnerabilities Strix Finds

- 🔐 **Authentication Bypass** - Weak or missing auth checks
- 🔑 **Authorization Flaws** - IDOR, privilege escalation
- 💉 **Injection Attacks** - SQL, NoSQL, command injection
- 🌐 **XSS Vulnerabilities** - Cross-site scripting in forms
- 🔄 **CSRF Issues** - Missing CSRF protection
- 🔓 **Session Management** - Weak session handling
- 💳 **Payment Security** - Webhook validation, business logic flaws

## 🔄 CI/CD Integration

See `.github/workflows/strix-security.yml` for automated security testing on pull requests.

The workflow will:
- Run Strix on every PR
- Block merges if critical vulnerabilities are found
- Generate security reports as PR comments

## 🛠️ Troubleshooting

### Docker Not Running
```bash
# Start Docker Desktop or Docker daemon
# On macOS: Open Docker Desktop app
# On Linux: sudo systemctl start docker
```

### API Key Issues
```bash
# Verify your API key is set
echo $LLM_API_KEY

# Test with a simple command
strix --target ./src --scan-mode quick
```

### Port Already in Use
```bash
# If port 8080 is busy, use a different port
npm run dev -- --port 3000
strix --target http://localhost:3000
```

## 📚 Additional Resources

- **Strix Documentation**: https://docs.strix.ai
- **Strix GitHub**: https://github.com/usestrix/strix
- **Strix Discord**: Join for community support

## 🎓 Best Practices

1. **Run regularly** - Test after major changes
2. **Fix critical issues first** - Address high-severity vulnerabilities immediately
3. **Review false positives** - Strix is accurate but review findings
4. **Test before deployment** - Always test staging before production
5. **Keep Strix updated** - Update regularly for latest vulnerability checks

## ⚡ Quick Reference

```bash
# Basic scan
strix --target <your-target>

# Quick scan (faster, less thorough)
strix --target <your-target> --scan-mode quick

# Focused testing
strix --target <your-target> --instruction "your testing focus"

# Headless mode (CI/CD)
strix -n --target <your-target>

# Multiple targets
strix -t <target1> -t <target2>
```

## 🆘 Need Help?

- Check Strix logs in `strix_runs/`
- Review the [Strix documentation](https://docs.strix.ai)
- Join the [Strix Discord community](https://discord.gg/strix)

---

**Remember:** Only test applications you own or have permission to test. Use responsibly!


