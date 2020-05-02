#/bin/bash

TAG=$1

echo "Creating instance template token-builder-$TAG"

#gcloud compute instance-templates create token-builder-$TAG \
#  --machine-type f1-micro \
#  --metadata "environment"="TAG=$TAG" \
#  --region us-west1 \
#  --metadata-from-file user-data="./deploy/cloud-config.yml" \
#  --service-account "token-builder@rpg-dougrich-net.iam.gserviceaccount.com" \
#  --image-project cos-cloud \
#  --image-family cos-stable \
#  --tags http-server \
#  --can-ip-forward

gcloud compute instance-templates create token-builder-$TAG \
  --machine-type f1-micro \
  --region us-west1 \
  --metadata tag=$TAG \
  --metadata-from-file startup-script="$2" \
  --service-account "token-builder@rpg-dougrich-net.iam.gserviceaccount.com" \
  --image-project cos-cloud \
  --image-family cos-stable \
  --tags http-server \
  --can-ip-forward