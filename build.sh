#!/bin/sh
if [[ $(git rev-parse --abbrev-ref HEAD) == "main" || $(git log --pretty='format:%Creset%s' --no-merges -1) =~ "(vercel-build)" ]] ;
    then exit 1; else exit 0;
fi
