# lambda-response-template

[![npm version](https://badge.fury.io/js/lambda-response-template.svg)](https://www.npmjs.com/package/lambda-response-template)
[![Build Status](https://travis-ci.com/c-bandy/lambda-response-template.svg?branch=master)](https://travis-ci.com/c-bandy/lambda-response-template)
[![codecov](https://codecov.io/gh/c-bandy/lambda-response-template/branch/master/graph/badge.svg)](https://codecov.io/gh/c-bandy/lambda-response-template)
[![dependencies Status](https://david-dm.org/c-bandy/lambda-response-template/status.svg)](https://david-dm.org/c-bandy/lambda-response-template)

>💬 A tiny utility for creating AWS Lambda response objects.

This package provides an easy way for you generate templates for your responses. Increase readability and make your
output more consistent across your Lambda application.

## Install

```bash
npm install lambda-response-template
```

## Features

* Templating
  * Create re-usable templates for your responses.
* Transforming
  * Transform your response body before returning it, removing the need to stringify your JSON responses.
* Fully TypeScript supported

## Why

When developing large applications you often work across multiple repositories. I found myself following the same
pattern of creating a factory in each repository every time I wanted set standards for a lambda's output. When you also
have to add tests for this boilerplate it can quickly get annoying - this package aims to solve this problem by creating
a first class, best version of this generic method.

## Usage

Set up lambda-response-template your defaults:

```javascript
import { ResponseTemplate } from 'lambda-response-template';

const reply = new ResponseTemplate({
  headers: {
    'x-powered-by': 'nodejs',
  }
});
```

And then use inside your function:

```javascript
async function handler(event, context) {
  return reply.make(200, body, options);
}
```

Your response will be made from the template, inheriting any options you set.

## Tips

### Shortcut for Content-Type header

```javascript
const a = reply.make(200, body, {
  headers: { 'content-type': 'text/plain' }
});

// can be written as

const b = reply.make(200, body, 'text/plain');
```

### Automatically stringify responses

```javascript
const reply = new ResponseTemplate({
  transform: (value) => JSON.stringify(value)
})

const response = reply.make(400, {
  theTruth: 'Pizza cutters are a lie!'
});
```