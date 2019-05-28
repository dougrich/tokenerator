#/bin/bash

TAG=$1

gcloud compute instance-groups managed set-instance-template token-builder \
  --region us-west1
  --template token-builder-$TAG

gcloud beta --quiet compute instance-groups managed rolling-action replace token-builder