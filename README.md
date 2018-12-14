# aws-lamba-reply

💬 A tiny utility for creating AWS Lambda response objects.

## Why

Setting up service-wide headers can quicky add clutter. I wanted to simplify this process by creating a minimal
framework which allows you to set the headers only once, but use multiple times.

## Usage

Set up LambdaReply with your defaults:

```javascript
import { LambdaReply } from 'aws-lambda-reply';

const Reply = new LambdaReply({
  headers: {
    'x-powered-by': 'nodejs',
  }
});
```

And inside your function:

```javascript
const response = Reply.make(200, '{"message": "Hello world!"}')

callback(null, response);

```
