# aws-lamba-reply

>💬 A tiny utility for creating AWS Lambda response objects.

## Install

```bash
$ npm install aws-lambda-reply
```

## Why

Setting up service-wide headers can quicky add clutter. I wanted to simplify this process by creating a minimal
module which allows you to set the headers only once, but use multiple times across your function code.

## Usage

Set up LambdaReply with your defaults:

```javascript
import { LambdaReply } from 'aws-lambda-reply';

const reply = new LambdaReply({
  headers: {
    'x-powered-by': 'nodejs',
  }
});
```

And then use inside your function:

```javascript
function handler(event, context, callback) {
  const response = reply.make(200, '{"message": "Hello world!"}');
  callback(null, response);
}
```

## API

```js
// ES6
import { LambdaReply } from 'aws-lambda-reply';

// commonJS
const LambdaReply = require('aws-lambda-reply').LambdaReply;
```

---

```javascript
const reply = new LambdaReply(defaults);
```

>This API assumes that you call the object `reply`, but you can call it anything you want.

### Constructor

#### defaults

Defaults for all replies made using this object.

Type: `object`

```typescript
{
  headers?: { [key: string]: string | boolean | number }
}
```

---

```js
reply.make(statusCode, body, options);
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

Customize the response. Overwrite headers or set the response as base64 encoded.

```typescript
{
  headers?: { [key: string]: string | boolean | number },
  multiValueHeaders?: { [key: string]: string[]; },
  isBase64Encoded?: boolean,
}
```

#### Returns

Type: `object`

```typescript
{
  statusCode: number,
  body: string,
  headers?: { [key: string]: string[]; },
  multiValueHeaders?: { [key: string]: string[]; },
  isBase64Encoded?: boolean
}
```
