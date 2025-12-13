#!/bin/bash
echo "==================================="
echo "Railway Deployment Size Check"
echo "==================================="
echo ""

echo "1. Total backend folder size:"
du -sh .
echo ""

echo "2. Size excluding cache and venv:"
du -sh --exclude=__pycache__ --exclude=venv --exclude=.venv --exclude=env --exclude=.cache .
echo ""

echo "3. Largest files (>5MB):"
find . -type f -size +5M -exec ls -lh {} \; 2>/dev/null | awk '{print $5, $9}'
echo ""

echo "4. Python package cache:"
du -sh ~/.cache/pip 2>/dev/null || echo "No pip cache"
echo ""

echo "5. Sentence transformers cache:"
du -sh ~/.cache/torch 2>/dev/null || echo "No torch cache"
echo ""

echo "==================================="
echo "CHECKLIST:"
echo "==================================="
echo "✓ Total size should be under 100MB"
echo "✓ No node_modules in backend/"
echo "✓ No frontend files in backend/"
echo "✓ .dockerignore properly configured"
echo ""