#/bin/bash

set -eu

curl -Sf -XPUT "localhost:9200/mirror" -H 'Content-Type: application/json' -d @elastic_index.json
