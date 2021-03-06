# custom-replication

This repository show how to build a custom Cloudant "replicator" using OpenWhisk. The OpenWhisk action is fed every change from the source database. In this case it is expecting documents of this form:

```js
{
  "_id": "3007166d-3fd3-4e3f-be0d-43aa9c054a48",
  "_rev": "1-16e262673ed141f0b711f33e6bb0fdc1",
  "route": "X1",
  "name": "Newcastle to London Express",
  "start": "Newcastle-upon-Tyne",
  "end": "Victoria, London",
  "scheduled_start": "2017-08-04 13:05:00 Z",
  "actual_start": "2017-08-04 13:08:00 Z",
  "scheduled_arrival": "2017-08-04 13:05:00 Z",
  "estimated_arrival": "2017-08-04 13:08:00 Z",
  "actual_arrival": null,
  "stops": [
    {
      "type": "comfort_break",
      "location": "Woodall services",
      "start": "2017-08-04 15:00:00 Z",
      "actual_start": null,
      "end": "2017-08-04 15:30:00 Z",
      "actual_end": null
    }
  ],
  "driver": {
    "name": "Sheila Davies",
    "employee_num": "SD_1552"
  },
  "vehicle": {
    "model": "Volvo 9700",
    "registration": "PQ89MGW"
  }
}
```

that represent the progress of a bus along its journey.

The OpenWhisk action takes the document, removes some unnecessary detail and writes the pruned data to two locations: a database for the start station and a database for the arrival station, retaining the revision token.

This allows station displays to see only the data that pertains to their station while maintaining a master database containing all the data.

## Deploying

Sign up for a Cloudant service and in the dashboard create three databases:

- bus
- busstation_newcastleupontyne
- busstation_victorialondon

Create some environment variables containing your Cloudant credentials:

```sh
$ export CLOUDANT_HOST="YOURACCOUNT.cloudant.com"
$ export CLOUDANT_USERNAME="YOURACCOUNT"
$ export CLOUDANT_PASSWORD="YOURPASSWORD"
$ export CLOUDANT_DB="bus"
```

Install the [`wsk` command-line tool](https://console.bluemix.net/openwhisk/learn/cli) and configure it against your IBM Bluemix account.

Run `deploy.sh`.

Now every time you create or modify a document in the `bus` database, the other two databases will receive cut-down copies of the original document.

## Caveats

This configuration may be useful to you if you need:

- a central every growing database of data
- a limited number of satellite databases (in this case one-per-station) that contain a subset of this data
- all data change happens centrally and is broadcast outwards to remote replicas

Feel free to try this approach yourself if you have an application like this. 