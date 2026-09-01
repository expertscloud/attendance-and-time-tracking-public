# Generate adonis key

`node ace generate:key`

# Requirements

- nodejs 20
- mysql 8
- redis 7
- smtp

# where to define config

- services.ts

# where to define env so they should be cast

- env.ts
- define all evn there so they should be automatically cast to specific type like string, boolean or number

# rules

## variables

- variables names should be camel case in controller, services and validator
- example

```
userType

userId

companyUserRoles
```

- routes name should be snake case
- example

```
api/users/generate-report

api/users/:userId/logs
```

# email sending

- first create email class
- `node ace make:mail WelcomeEmail`
- create email send event so we can dispatch the email
- check the events.ts file for email sending
