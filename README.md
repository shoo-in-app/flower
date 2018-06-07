# flower

Server for butterfly app. This serve CRUD API Server. And data are from PostgreSQL DB.

- master branch deploy
  [https://cc4-flower.herokuapp.com/](https://cc4-flower.herokuapp.com/)
- dev branch deploy
  [https://cc4-flower-dev.herokuapp.com/](https://cc4-flower-dev.herokuapp.com/)

## API access points

### post /user

Add user.
post body

```
{
  idToken: "bv4UrqEdJ97gUjS469LPX6zrbDMNcKhW5DqmQmuPP9wEEMK7YewqDRQxfQ9xT669bmHDfpRHSjEUssF8yEcEde2BJHeFgy64q9EKvfPa845pETHvRKuCaUzVtAbJwqAC"
  username: "Yusuke"
}
```

### get /rallies

Get all rallies.

```
[
  {
    "id": 1,
    "title": "Tokyo FamilyMarts",
    "description": "Go 3 famima!"
  },
  {
    "id": 2,
    "title": "Wakayama around",
    "description": "Wakayama famous spots"
  },
  {
    "id": 3,
    "title": "Yamanote Line",
    "description": "Go 3 stations"
  }
]
```

### get /rallies/:userId

Get rallies which a user join.

```
[
  {
    "id": 1,
    "title": "Tokyo FamilyMarts",
    "description": "Go 3 famima!"
  },
  {
    "id": 2,
    "title": "Wakayama around",
    "description": "Wakayama famous spots"
  }
]
```

### get /locations/:userId/:rallyId

Get locations history which user visited in one rally.

```
[
  {
    "id": 1,
    "name": "Motoazabu Sanchoume",
    "lat": 35.659,
    "lng": 139.722,
    "description": "nearest famima to cc",
    "rally_id": 1,
    "user_id": 1,
    "location_id": 1,
    "visited": true
  },
  {
    "id": 2,
    "name": "Motoazabu Sanchoume",
    "lat": 35.659,
    "lng": 139.722,
    "description": "nearest famima to cc",
    "rally_id": 1,
    "user_id": 1,
    "location_id": 2,
    "visited": true
  },
  {
    "id": 3,
    "name": "Motoazabu Sanchoume",
    "lat": 35.659,
    "lng": 139.722,
    "description": "nearest famima to cc",
    "rally_id": 1,
    "user_id": 1,
    "location_id": 3,
    "visited": false
  }
]
```

### patch /location/:userId/:locationId

Update location history as visited.

body example

```
{
  "visited":true
}
```

## Getting Started

```
yarn install
yarn initdb
yarn start
```

### Prerequisites

you need db named `flower` in PostgreSQL.

```
psql -D postgres
> CREATE DATABASE flower;
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
