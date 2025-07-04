#!/bin/bash
cd /home/kavia/workspace/code-generation/sketchquest-106944-8f3e06be/doodle_finder_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

