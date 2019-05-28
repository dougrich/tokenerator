#/bin/bash

TAG=$1

gcloud compute instance-groups managed set-instance-template token-builder \
  --zone us-west1-a \
  --template token-builder-$TAG

gcloud compute instance-groups managed rolling-action replace token-builder --zone us-west1-a