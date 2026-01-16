#!/bin/bash

# Strix Security Testing Helper Script
# This script helps you run Strix safely on your application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DEFAULT_PORT=8080
DEFAULT_MODE="full"

# Functions
print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

check_docker() {
    if ! docker ps > /dev/null 2>&1; then
        print_error "Docker is not running!"
        echo "Please start Docker Desktop or Docker daemon and try again."
        exit 1
    fi
    print_success "Docker is running"
}

check_strix() {
    if ! command -v strix &> /dev/null; then
        print_warning "Strix is not installed"
        echo "Installing Strix..."
        curl -sSL https://strix.ai/install | bash
        export PATH="$HOME/.local/bin:$PATH"
    fi
    print_success "Strix is installed"
}

check_env() {
    if [ -z "$LLM_API_KEY" ]; then
        print_error "LLM_API_KEY environment variable is not set!"
        echo ""
        echo "Please set it:"
        echo "  export LLM_API_KEY='your-api-key'"
        echo ""
        echo "Or create a .env.local file and source it:"
        echo "  source .env.local"
        exit 1
    fi
    print_success "Environment variables configured"
}

# Main script
print_header "Strix Security Testing Setup"

# Parse arguments
TARGET=""
MODE="full"
PORT=$DEFAULT_PORT
INSTRUCTION=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --target|-t)
            TARGET="$2"
            shift 2
            ;;
        --mode|-m)
            MODE="$2"
            shift 2
            ;;
        --port|-p)
            PORT="$2"
            shift 2
            ;;
        --instruction|-i)
            INSTRUCTION="$2"
            shift 2
            ;;
        --help|-h)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  -t, --target URL      Target URL or path to test"
            echo "  -m, --mode MODE       Scan mode: quick, full (default: full)"
            echo "  -p, --port PORT       Port for local server (default: 8080)"
            echo "  -i, --instruction     Custom testing instructions"
            echo "  -h, --help           Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0 -t http://localhost:8080"
            echo "  $0 -t ./src -m quick"
            echo "  $0 -t ./src -i 'Focus on authentication vulnerabilities'"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Pre-flight checks
check_docker
check_strix
check_env

# Determine target
if [ -z "$TARGET" ]; then
    print_warning "No target specified. Using default: ./src"
    TARGET="./src"
fi

# Check if target is a local URL
if [[ "$TARGET" == http://localhost:* ]] || [[ "$TARGET" == http://127.0.0.1:* ]]; then
    print_warning "Testing against local server: $TARGET"
    print_warning "Make sure your dev server is running!"
    echo ""
    read -p "Press Enter to continue or Ctrl+C to cancel..."
elif [[ "$TARGET" == http* ]]; then
    print_warning "Testing against remote server: $TARGET"
    print_warning "Make sure you have permission to test this server!"
    echo ""
    read -p "Press Enter to continue or Ctrl+C to cancel..."
fi

# Build Strix command
STRIX_CMD="strix --target $TARGET"

if [ "$MODE" == "quick" ]; then
    STRIX_CMD="$STRIX_CMD --scan-mode quick"
fi

if [ -n "$INSTRUCTION" ]; then
    STRIX_CMD="$STRIX_CMD --instruction \"$INSTRUCTION\""
fi

# Run Strix
print_header "Starting Strix Security Scan"
echo "Target: $TARGET"
echo "Mode: $MODE"
if [ -n "$INSTRUCTION" ]; then
    echo "Focus: $INSTRUCTION"
fi
echo ""

eval $STRIX_CMD

# Check results
if [ $? -eq 0 ]; then
    print_success "Strix scan completed successfully!"
    echo ""
    echo "Results are saved in: strix_runs/"
    echo "Review the reports for vulnerability details."
else
    print_warning "Strix scan completed with warnings or errors"
    echo "Check strix_runs/ for detailed results"
fi


