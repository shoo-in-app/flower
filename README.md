# flower

Server for butterfly app. This serve CRUD API Server. And data are from PostgreSQL DB.

- master branch deploy
  [https://cc4-flower.herokuapp.com/](https://cc4-flower.herokuapp.com/)
- dev branch deploy
  [https://cc4-flower-dev.herokuapp.com/](https://cc4-flower-dev.herokuapp.com/)

## Default Seeds Users

```
{
    id: 10001,
    email: "alex@sample.com",
    username: "Alex",
},
{
    id: 10002,
    email: "taka@sample.com",
    username: "Taka",
},
{
    id: 10003,
    email: "yusuke@sample.com",
    username: "Yusuke",
},
```

## API access points

### mobile-api

#### post /mobile-api/user

Add user.
post body. It returns userId.

```
{
  "email": "test@test.com",
  "username": "Yusuke"
}
```

#### delete /mobile-api/user/:userId

Delete user.

### get /mobile-api/rallies/:userId

Get rallies which a user join.

```
{
    "chosen": [
        {
            "id": 1,
            "title": "Tokyo FamilyMarts",
            "description": "Go 3 famima!",
            "complete": false,
            "locations": [
                {
                    "id": 1,
                    "name": "Motoazabu Sanchoume",
                    "description": "nearest famima to cc",
                    "lat": 35.659,
                    "lng": 139.722,
                    "visited": false
                },
                {
                    "id": 2,
                    "name": "Motoazabu",
                    "description": "second nearest famima to cc",
                    "lat": 35.6549,
                    "lng": 139.726,
                    "visited": false
                },
                {
                    "id": 3,
                    "name": "Nishiazabu Sanchoume",
                    "description": "third nearest famima to cc",
                    "lat": 35.6594,
                    "lng": 139.723,
                    "visited": false
                }
            ]
        }
    ],
    "notChosen": [
        {
            "id": 2,
            "title": "Wakayama around",
            "description": "Wakayama famous spots",
            "locations": [
                {
                    "id": 4,
                    "name": "Wakayama Castle",
                    "description": "The place Abarenbou shogun grew up",
                    "lat": 34.2295,
                    "lng": 135.172
                },
                {
                    "id": 5,
                    "name": "Shimotsu cho",
                    "description": "Yusuke's Home town",
                    "lat": 34.1088,
                    "lng": 135.143
                },
                {
                    "id": 6,
                    "name": "Adventure World",
                    "description": "A Great Zoo",
                    "lat": 33.6678,
                    "lng": 135.374
                },
                {
                    "id": 7,
                    "name": "Susami cho",
                    "description": "The place Felix visited",
                    "lat": 33.567,
                    "lng": 135.494
                },
                {
                    "id": 8,
                    "name": "Shionomisaki",
                    "description": "South End of Honshu",
                    "lat": 33.437,
                    "lng": 135.747
                }
            ]
        },
        {
            "id": 3,
            "title": "Yamanote Line",
            "description": "Go 3 stations",
            "locations": [
                {
                    "id": 9,
                    "name": "Shinjuku Station",
                    "description": "Shin Toshin",
                    "lat": 35.6896,
                    "lng": 139.698
                },
                {
                    "id": 10,
                    "name": "Shibuya Station",
                    "description": "Town for young",
                    "lat": 35.658,
                    "lng": 139.699
                },
                {
                    "id": 11,
                    "name": "Tokyo Station",
                    "description": "Toshin",
                    "lat": 35.6812,
                    "lng": 139.765
                }
            ]
        }
    ]
}
```

#### patch /mobile-api/rally/:userId/:rallyId

Choose rally/Unchoose rally.

body example

```
{
  "chosen":true
}
```

#### patch /mobile-api/location/:userId/:locationId

Update location history as visited.

body example

```
{
  "visited":true
}
```

#### patch /mobile-api/exp/:userId

Increase exp (new exp will be `[current exp] + [exp which you send]`).
body example:

```
{
    exp:10
}
```

### web-api

#### post /web-api/rally/

Create new rally.
body example:

```
{
    "title": "Roppongi",
    "description": "Good place to visit in Roppongi",
    "start_datetime": "2018-06-15T00:00:00.000Z",
    "end_datetime": "2018-07-15T00:00:00.000Z",
    "locations": [
        {
          "name": "Code Chrisalis",
          "lat": 35.6579975,
          "lng": 139.7275789,
          "description": "The Immersive bootcamp"
        },
        {
          "name": "Roppongi Hills",
          "lat": 35.6604896,
          "lng": 139.7292863,
          "description": "Big Building in Roppongi"
        }
    ]
}
```

#### get /web-api/rallies/

Create new rally.
body example:

```
{
    "title": "Roppongi",
    "description": "Good place to visit in Roppongi",
    "start_datetime": "2018-06-15T00:00:00.000Z",
    "end_datetime": "2018-07-15T00:00:00.000Z",
    "locations": [
        {
          "name": "Code Chrisalis",
          "lat": 35.6579975,
          "lng": 139.7275789,
          "description": "The Immersive bootcamp"
        },
        {
          "name": "Roppongi Hills",
          "lat": 35.6604896,
          "lng": 139.7292863,
          "description": "Big Building in Roppongi"
        }
    ]
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
