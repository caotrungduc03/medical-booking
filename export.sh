#!/bin/bash
echo "==============EXPORT DATABASE=============="
sleep 1s

DB=medical-booking
DB_COLLECTIONS=$(mongosh $DB --quiet --eval "db.getCollectionNames().join(' ')")
for collection in $DB_COLLECTIONS; do
    echo "Exporting $DB/$collection ..."
    mongoexport --db=$DB --collection=$collection --out=./database/$collection.json
done

echo "->>> Done"
