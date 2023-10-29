#!/bin/sh
echo "==============IMPORT DATABASE=============="
sleep 1s

DB=medical-booking
echo $DB
for FILE in ./database/*.json; do
    echo "Importing $FILE.json...."
    collection = basename $FILE .json;
    mongoimport --db=$DB --collection=$collection --drop --file=$FILE
done
echo "->>> Done"
