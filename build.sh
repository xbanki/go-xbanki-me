#!/bin/bash

if [[ "$VERCEL_GIT_COMMIT_REF" == "staging" || "$VERCEL_GIT_COMMIT_REF" == "main" || "$VERCEL_GIT_COMMIT_MESSAGE" =~ "(vercel-build)" ]] ;
    then exit 1; else exit 0;
fi
