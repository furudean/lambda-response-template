# aws-lamba-reply

[![Build Status](https://travis-ci.com/c-bandy/aws-lambda-reply.svg?branch=master)](https://travis-ci.com/c-bandy/aws-lambda-reply)
[![dependencies Status](https://david-dm.org/c-bandy/aws-lambda-reply/status.svg)](https://david-dm.org/c-bandy/aws-lambda-reply)
[![codecov](https://codecov.io/gh/c-bandy/aws-lambda-reply/branch/master/graph/badge.svg)](https://codecov.io/gh/c-bandy/aws-lambda-reply)

>💬 A tiny utility for creating AWS Lambda response objects.

This package provides an easy way for you set default headers for your lambda functions. Helps reduce clutter and make
your output more consistent in large scale applications.

## Install

```bash
npm install aws-lambda-reply
```

## Why

When developing large applications you often work across multiple repositories. I found myself following the same
pattern of creating a factory in each repository every time I wanted set standards for a lambda's output. When you also
have to add tests for this boilerplate it can quickly get annoying - this package intends to solve this problem by
creating a first class, best version of this generic method, that is easily accessible as a module.

## Usage

Set up aws-lambda-reply with your defaults:

```typescript
import { LambdaReply } from 'aws-lambda-reply';

const Reply = new LambdaReply({
  headers: {
    'x-powered-by': 'nodejs',
  }
});
```

And then use inside your function:

```typescript
function handler(event, context) {
  return Reply.make(200, '{"message": "Hello world!"}');
}
```

Your headers will automatically be added to the response object, along with any additional headers you pass.

## API

```typescript
// ES6
import { LambdaReply } from 'aws-lambda-reply';

// commonJS
const LambdaReply = require('aws-lambda-reply').LambdaReply;
```

---

```typescript
const Reply = new LambdaReply(defaults);
```

>This API assumes that you name the instance `Reply`, but you can call it anything you like.

### Constructor

#### defaults

Type: `object`

Defaults for all replies made using this object.

`headers` default to `{ 'Content-Type': 'application/json' }`.

`multiValueHeaders` default to `{}`.

```typescript
{
  headers?: { [key: string]: string | boolean | number },
  multiValueHeaders?: { [key: string]: string[] }
}
```

---

```typescript
Reply.make(statusCode, body, options);
```

### Params

#### statusCode

Type: `number`

HTTP status code

#### body

Type: `string`

The response body to return.

#### options

Type: `object`

Add additional headers or set the response as base64 encoded.

```typescript
{
  headers?: { [key: string]: string | boolean | number },
  multiValueHeaders?: { [key: string]: Array<string | boolean | number> },
  isBase64Encoded?: boolean,
}
```

#### Returns

Type: `object`

```typescript
{
  statusCode: number,
  body: string,
  headers?: { [key: string]: string | boolean | number },
  multiValueHeaders?: { [key: string]: Array<string | boolean | number> },
  isBase64Encoded?: boolean
}
```
