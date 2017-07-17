#!/bin/bash

# don't deploy without env variables
if [[ -z "${CLOUDANT_HOST}" ]]; then
  echo "Environment variable CLOUDANT_HOST is required"
  exit 1
fi
if [[ -z "${CLOUDANT_USERNAME}" ]]; then
  echo "Environment variable CLOUDANT_USERNAME is required"
  exit 1
fi
if [[ -z "${CLOUDANT_PASSWORD}" ]]; then
  echo "Environment variable CLOUDANT_PASSWORD is required"
  exit 1
fi
if [[ -z "${CLOUDANT_DB}" ]]; then
  echo "Environment variable CLOUDANT_DB is required"
  exit 1
fi

# create a package called 'leaderboard' with our credentials 
wsk package create bus -p username "$CLOUDANT_USERNAME" -p password "$CLOUDANT_PASSWORD" -p host "$CLOUDANT_HOST"

# deploy our stream action to the package
wsk action create bus/onchange onchange.js

# now the changes feed config
# create a Cloudant connection
wsk package bind /whisk.system/cloudant busCloudant -p username "$CLOUDANT_USERNAME" -p password "$CLOUDANT_PASSWORD" -p host "$CLOUDANT_HOST"

# a trigger that listens to our database's changes feed
wsk trigger create busTrigger --feed /_/busCloudant/changes --param dbname "$CLOUDANT_DB" 

# a rule to call our action when the trigger is fired
wsk rule create busRule busTrigger bus/onchange


