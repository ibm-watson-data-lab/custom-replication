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