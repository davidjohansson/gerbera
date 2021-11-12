Innehåller data från gamla elasticsearch på fuchsia. Hämtat ut all data från training-indexet med

```
curl -XGET "http://192.168.86.129:9200/training/_search?size=1500" -H 'Content-Type: application/json' -d'
{
    "query": {
        "match_all": {}
    }
}' | jq '.hits.hits[]._source | {text: .text, time: .timestamp}'

```

Finns inget annat data där som är intressant. Det finns en bucket på S3 med några gamla exporter från elasticdump(?), men inte intressant att behålla utöver vad som finns uppsatt i den här mappen.

Spara ovantstående curl till `raw_from_elastic.jso`, sedan

```
node transform_to_common_format.js
```
