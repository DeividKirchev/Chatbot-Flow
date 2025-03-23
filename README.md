# Configuration
### Environment variables
><b>OPENAI_API_KEY</b>=<OPENAI_API_KEY> # OpenAI API Key. Required for functionality\
><b>NODE_ENV</b>=[development | production] # Optional. Default is production.

### Running the application
Start the application using docker. Example command:
>docker-compose up --build

### Running tests
Example command using docker:
>docker build --target test --rm . --no-cache --progress=plain


# API Endpoints
A guide to all available API endpoints.

---

## Table of Contents
- [Configuration Endpoints](#configuration-endpoints)
  - [GET /api/v1/configuration](#get-apiv1configuration)
  - [POST /api/v1/configuration](#post-apiv1configuration)
- [Chat Block Endpoints](#chat-block-endpoints)
  - [GET /api/v1/blocks](#get-apiv1blocks)
  - [GET /api/v1/blocks/types](#get-apiv1blockstypes)
- [Chat History Endpoints](#chat-history-endpoints)
  - [GET /api/v1/chat](#get-apiv1chat)
  - [GET /api/v1/chat/:id](#get-apiv1chatid)
- [WebSocket Endpoints](#websocket-endpoints)
  - [WS /ws/chat](#ws-wschat)
  - [WS /ws/chat/:id](#ws-wschatid)

---

## Configuration Endpoints

### [GET] /api/v1/configuration

**What it does:**  
Gets the current active chatbot configuration with all its blocks.

**Request schema:**  
No request body required.

**Response schema:**
```typescript
{
  "activeConfiguration": {
    "_id": ObjectId,
    "configuration": {
      "_id": ObjectId,
      "blocks": [ChatBlock], // ChatBlock schema in /api/v1/blocks
      "entryBlock": ChatBlock, // ChatBlock schema in /api/v1/blocks
      "createdAt": Date,
      "updatedAt": Date
    },
    "createdAt": Date,
    "updatedAt": Date
  }
}
```
***Sample request:***

>GET /api/v1/configuration

***Sample response:***

```typescript
{
  "activeConfiguration": {
    "_id": "67db434be74aa7a252f58934",
    "__v": 0,
    "configuration": {
      "_id": "67df514e33a22d8c85f4867f",
      "blocks": [
        {
          "_id": "67df514d33a22d8c85f48655",
          "type": "sendMessage",
          "originalId": "0",
          "originalNextBlock": "1",
          "message": "What are you looking for today?",
          "__v": 0,
          "createdAt": "2025-03-23T00:09:50.002Z",
          "updatedAt": "2025-03-23T00:09:50.033Z",
          "nextBlock": "67df514d33a22d8c85f48656"
        },
        ... (more blocks) ...
      ],
      "entryBlock": {
        "_id": "67df514d33a22d8c85f48655",
        "type": "sendMessage",
        "originalId": "0",
        "originalNextBlock": "1",
        "message": "What are you looking for today?",
        "__v": 0,
        "createdAt": "2025-03-23T00:09:50.002Z",
        "updatedAt": "2025-03-23T00:09:50.033Z",
        "nextBlock": "67df514d33a22d8c85f48656"
      },
      "createdAt": "2025-03-23T00:09:50.053Z",
      "updatedAt": "2025-03-23T00:09:50.053Z",
      "__v": 0
    },
    "createdAt": "2025-03-19T22:20:59.642Z",
    "updatedAt": "2025-03-23T00:09:50.057Z"
  }
}
```

---

### [POST] /api/v1/configuration

**What it does:**  
Sets the active configuration for the chatbot, replacing any existing active configuration.\
All provided ids get moved to 'original' fields (originalNextBlock, originalId etc.) and get generated MongoDB ones.

**Request schema:**
```typescript
{
  "blocks": [
    {
      // SendMessage block
      "type": "sendMessage",
      "_id": ObjectId, // Optional, auto-generated if not provided
      "message": String, // Required
      "nextBlock": ObjectId // Optional - ID of next block, null if end of conversation
    },
    // OR AwaitResponse block
    {
      "type": "awaitResponse",
      "_id": ObjectId, // Optional, auto-generated if not provided
      "nextBlock": ObjectId // Required - ID of block to execute after receiving response
    },
    // OR RecognizeIntent block
    {
      "type": "recognizeIntent",
      "_id": ObjectId, // Optional, auto-generated if not provided
      "intents": [ // Required
        {
          "intent": String, // Required - The intent phrase
          "nextBlock": ObjectId // Required - ID of block to execute if this intent matches
        }
      ],
      "errorIntentNextBlock": ObjectId // Required - ID of block to execute when no intent matches
    }
  ],
  "entryBlock": String // Optional - ID of the first block to execute, defaults to first block if not provided
}
```
***Response schema***
```typescript
{
  "activeConfiguration": {
    "_id": ObjectId,
    "configuration": {
      "_id": ObjectId,
      "blocks": [
        {
          "_id": ObjectId,
          "originalId": ObjectId, // The original id which was passed on setting the configuration
          "type": String,
          // Fields differ based on block type (as above)
          "createdAt": Date,
          "updatedAt": Date
        }
        // More blocks...
      ],
      "entryBlock": String,
      "createdAt": Date,
      "updatedAt": Date,
    },
    "createdAt": Date,
    "updatedAt": Date,
  }
}

```

***Sample request***
```typescript
{
    "blocks": [
        {
            "_id": "0",
            "type": "sendMessage",
            "message": "What are you looking for today?",
            "nextBlock": "1"
        },
        {
            "type": "awaitResponse",
            "_id": "1",
            "nextBlock": "2"
        },
        {
            "_id": "2",
            "type": "recognizeIntent",
            "intents": [
                {
                    "intent": "What is the weather?",
                    "nextBlock": "3"
                },
                {
                    "intent": "What is the time?",
                    "nextBlock": "4"
                }
            ],
            "errorIntentNextBlock": "9"
        },
        {
            "_id": "3",
            "type": "sendMessage",
            "message": "It's sunny",
            "nextBlock": "5"
        },
        {
            "_id": "4",
            "type": "sendMessage",
            "message": "It's 10pm",
            "nextBlock": "5"
        },
        {
            "_id": "5",
            "type": "sendMessage",
            "message": "Would you like anything else?",
            "nextBlock": "6"
        },
        {
            "type": "awaitResponse",
            "_id": "6",
            "nextBlock": "7"
        },
        {
            "_id": "7",
            "type": "recognizeIntent",
            "intents": [
                {
                    "intent": "Yes",
                    "nextBlock": "0"
                },
                {
                    "intent": "No",
                    "nextBlock": "8"
                }
            ],
            "errorIntentNextBlock": "10"
        },
        {
            "_id": "8",
            "type": "sendMessage",
            "message": "Have a nice day!"
        },
        {
            "_id": "9",
            "type": "sendMessage",
            "message": "I don't understand what you mean.",
            "nextBlock": "0"
        },
        {
            "_id": "10",
            "type": "sendMessage",
            "message": "I don't understand what you mean.",
            "nextBlock": "5"
        }
    ]
}

```
***Sample response***
```typescript
{
    "activeConfiguration": {
        "_id": "67db434be74aa7a252f58934",
        "__v": 0,
        "configuration": {
            "_id": "67df514e33a22d8c85f4867f",
            "blocks": [
                {
                    "_id": "67df514d33a22d8c85f48655",
                    "type": "sendMessage",
                    "originalId": "0",
                    "originalNextBlock": "1",
                    "message": "What are you looking for today?",
                    "__v": 0,
                    "createdAt": "2025-03-23T00:09:50.002Z",
                    "updatedAt": "2025-03-23T00:09:50.033Z",
                    "nextBlock": "67df514d33a22d8c85f48656"
                },
                {
                    "_id": "67df514d33a22d8c85f48656",
                    "type": "awaitResponse",
                    "originalId": "1",
                    "originalNextBlock": "2",
                    "__v": 0,
                    "createdAt": "2025-03-23T00:09:50.002Z",
                    "updatedAt": "2025-03-23T00:09:50.033Z",
                    "nextBlock": "67df514d33a22d8c85f48657"
                },
                {
                    "_id": "67df514d33a22d8c85f48657",
                    "type": "recognizeIntent",
                    "originalId": "2",
                    "intents": [
                        {
                            "intent": "What is the weather?",
                            "originalNextBlock": "3",
                            "_id": "67df514d33a22d8c85f48663",
                            "nextBlock": "67df514d33a22d8c85f48658"
                        },
                        {
                            "intent": "What is the time?",
                            "originalNextBlock": "4",
                            "_id": "67df514d33a22d8c85f48664",
                            "nextBlock": "67df514d33a22d8c85f48659"
                        }
                    ],
                    "originalErrorIntentNextBlock": "9",
                    "__v": 0,
                    "createdAt": "2025-03-23T00:09:50.002Z",
                    "updatedAt": "2025-03-23T00:09:50.033Z",
                    "errorIntentNextBlock": "67df514d33a22d8c85f4865e"
                },
                {
                    "_id": "67df514d33a22d8c85f48658",
                    "type": "sendMessage",
                    "originalId": "3",
                    "originalNextBlock": "5",
                    "message": "It's sunny",
                    "__v": 0,
                    "createdAt": "2025-03-23T00:09:50.002Z",
                    "updatedAt": "2025-03-23T00:09:50.033Z",
                    "nextBlock": "67df514d33a22d8c85f4865a"
                },
                {
                    "_id": "67df514d33a22d8c85f48659",
                    "type": "sendMessage",
                    "originalId": "4",
                    "originalNextBlock": "5",
                    "message": "It's 10pm",
                    "__v": 0,
                    "createdAt": "2025-03-23T00:09:50.003Z",
                    "updatedAt": "2025-03-23T00:09:50.033Z",
                    "nextBlock": "67df514d33a22d8c85f4865a"
                },
                {
                    "_id": "67df514d33a22d8c85f4865a",
                    "type": "sendMessage",
                    "originalId": "5",
                    "originalNextBlock": "6",
                    "message": "Would you like anything else?",
                    "__v": 0,
                    "createdAt": "2025-03-23T00:09:50.003Z",
                    "updatedAt": "2025-03-23T00:09:50.033Z",
                    "nextBlock": "67df514d33a22d8c85f4865b"
                },
                {
                    "_id": "67df514d33a22d8c85f4865b",
                    "type": "awaitResponse",
                    "originalId": "6",
                    "originalNextBlock": "7",
                    "__v": 0,
                    "createdAt": "2025-03-23T00:09:50.003Z",
                    "updatedAt": "2025-03-23T00:09:50.033Z",
                    "nextBlock": "67df514d33a22d8c85f4865c"
                },
                {
                    "_id": "67df514d33a22d8c85f4865c",
                    "type": "recognizeIntent",
                    "originalId": "7",
                    "intents": [
                        {
                            "intent": "Yes",
                            "originalNextBlock": "0",
                            "_id": "67df514e33a22d8c85f4866a",
                            "nextBlock": "67df514d33a22d8c85f48655"
                        },
                        {
                            "intent": "No",
                            "originalNextBlock": "8",
                            "_id": "67df514e33a22d8c85f4866b",
                            "nextBlock": "67df514d33a22d8c85f4865d"
                        }
                    ],
                    "originalErrorIntentNextBlock": "10",
                    "__v": 0,
                    "createdAt": "2025-03-23T00:09:50.003Z",
                    "updatedAt": "2025-03-23T00:09:50.033Z",
                    "errorIntentNextBlock": "67df514d33a22d8c85f4865f"
                },
                {
                    "_id": "67df514d33a22d8c85f4865d",
                    "type": "sendMessage",
                    "originalId": "8",
                    "message": "Have a nice day!",
                    "__v": 0,
                    "createdAt": "2025-03-23T00:09:50.003Z",
                    "updatedAt": "2025-03-23T00:09:50.003Z"
                },
                {
                    "_id": "67df514d33a22d8c85f4865e",
                    "type": "sendMessage",
                    "originalId": "9",
                    "originalNextBlock": "0",
                    "message": "I don't understand what you mean.",
                    "__v": 0,
                    "createdAt": "2025-03-23T00:09:50.003Z",
                    "updatedAt": "2025-03-23T00:09:50.033Z",
                    "nextBlock": "67df514d33a22d8c85f48655"
                },
                {
                    "_id": "67df514d33a22d8c85f4865f",
                    "type": "sendMessage",
                    "originalId": "10",
                    "originalNextBlock": "5",
                    "message": "I don't understand what you mean.",
                    "__v": 0,
                    "createdAt": "2025-03-23T00:09:50.003Z",
                    "updatedAt": "2025-03-23T00:09:50.033Z",
                    "nextBlock": "67df514d33a22d8c85f4865a"
                }
            ],
            "entryBlock": "67df514d33a22d8c85f48655",
            "createdAt": "2025-03-23T00:09:50.053Z",
            "updatedAt": "2025-03-23T00:09:50.053Z",
            "__v": 0
        },
        "createdAt": "2025-03-19T22:20:59.642Z",
        "updatedAt": "2025-03-23T00:09:50.057Z"
    }
}

```
---

## Chat Block Endpoints

### [GET] /api/v1/blocks

**What it does:**  
Retrieves all chat blocks currently in the system.

**Request schema:**  
No request body required.

**Response schema:**
```typescript
{
  "blocks": [
    {
      "_id": ObjectId,
      "type": String, // Block type: "sendMessage", "awaitResponse", or "recognizeIntent"
      "originalId": ObjectId, // The original id which was passed on setting the configuration
      
      // Fields based on block type:
      
      // For sendMessage blocks:
      "message": String,
      "nextBlock": ObjectId,
      "originalNextBlock": ObjectId, // The original id which was passed on setting the configuration
      
      // For awaitResponse blocks:
      "nextBlock": ObjectId,
      "originalNextBlock": ObjectId, // The original id which was passed on setting the configuration

      
      // For recognizeIntent blocks:
      "intents": [
        {
          "intent": String,
          "nextBlock": ObjectId
          "originalNextBlock": ObjectId, // The original id which was passed on setting the configuration
        }
      ],
      "errorIntentNextBlock": ObjectId,
      "originalErrorIntentNextBlock": ObjectId, // The original id which was passed on setting the configuration
      
      // For all blocks
      "createdAt": Date,
      "updatedAt": Date
    }
    // More blocks...
  ]
}
```
***Sample Response:***
```typescript
{
  "blocks": [
    {
      "_id": "67df514533a22d8c85f4863e",
      "type": "sendMessage",
      "message": "Hello, what are you looking for today?",
      "nextBlock": "67df514533a22d8c85f4863f",
      "createdAt": "2025-03-23T00:09:41.377Z",
      "updatedAt": "2025-03-23T00:09:41.377Z"
    },
    {
      "_id": "67df514533a22d8c85f4863f",
      "type": "awaitResponse",
      "nextBlock": "67df514533a22d8c85f48640",
      "createdAt": "2025-03-23T00:09:41.379Z",
      "updatedAt": "2025-03-23T00:09:41.379Z"
    },
    {
      "_id": "67df514533a22d8c85f48640",
      "type": "recognizeIntent",
      "intents": [
        {
          "intent": "What is the weather?",
          "nextBlock": "67df514533a22d8c85f48641"
        },
        {
          "intent": "What is the time?",
          "nextBlock": "67df514533a22d8c85f48642"
        }
      ],
      "errorIntentNextBlock": "67df514533a22d8c85f4863f",
      "createdAt": "2025-03-23T00:09:41.381Z",
      "updatedAt": "2025-03-23T00:09:41.381Z"
    },
    {
      "_id": "67df514533a22d8c85f48641",
      "type": "sendMessage",
      "message": "It's sunny",
      "nextBlock": null,
      "createdAt": "2025-03-23T00:09:41.383Z",
      "updatedAt": "2025-03-23T00:09:41.383Z"
    },
    {
      "_id": "67df514533a22d8c85f48642",
      "type": "sendMessage",
      "message": "It's 10pm",
      "nextBlock": null,
      "createdAt": "2025-03-23T00:09:41.385Z",
      "updatedAt": "2025-03-23T00:09:41.385Z"
    }
  ]
}
``` 

---

### [GET] /api/v1/blocks/types

**What it does:**  
Retrieves all available chat block types supported by the system.

**Request schema:**  
No request body required.

**Response schema:**
```typescript
{
  "types": [
    {
        String // Block type identifiers
    }
  ]
}
```
***Sample response:***
```typescript
{
  "types": [
    {"sendMessage"},
    {"awaitResponse"},
    {"recognizeIntent"}
  ]
}

```

---

## Chat History Endpoints

### [GET] /api/v1/chat

**What it does:**  
Retrieves a list of all chat histories stored in the system.

**Request schema:**  
No request body required.

**Response schema:**
```typescript
{
  "chats": [
    {
      "_id": ObjectId,
      "messages": [
        {
          "content": String,
          "block": String, // ID of the block that generated/received this message
          "isUserMessage": Boolean,
          "sentAt": Date
        }
      ],
      "configuration": String, // ID of the configuration used for this chat
      "lastBlock": String, // ID of the last active block
      "createdAt": Date,
      "updatedAt": Date
    }
    // More chats...
  ]
}
```
***Sample response:***
```typescript
{
  "chats": [
    {
      "_id": "67e1f23a9b8c7d6e5f4a3b2c",
      "messages": [
        {
          "content": "Hello, what are you looking for today?",
          "block": "67df514533a22d8c85f4863e",
          "isUserMessage": false,
          "sentAt": "2025-03-24T14:32:15.123Z"
        },
        {
          "content": "I want to know the weather",
          "block": "67df514533a22d8c85f4863f",
          "isUserMessage": true,
          "sentAt": "2025-03-24T14:32:28.456Z"
        },
        {
          "content": "It's sunny",
          "block": "67df514533a22d8c85f48641",
          "isUserMessage": false,
          "sentAt": "2025-03-24T14:32:30.789Z"
        }
      ],
      "configuration": "67df514533a22d8c85f4864c",
      "lastBlock": "67df514533a22d8c85f48641",
      "createdAt": "2025-03-24T14:32:15.000Z",
      "updatedAt": "2025-03-24T14:32:30.789Z"
    },
    {
      "_id": "67e1f25c9b8c7d6e5f4a3b2d",
      "messages": [
        {
          "content": "Hello, what are you looking for today?",
          "block": "67df514533a22d8c85f4863e",
          "isUserMessage": false,
          "sentAt": "2025-03-24T15:45:10.123Z"
        },
        {
          "content": "What time is it?",
          "block": "67df514533a22d8c85f4863f",
          "isUserMessage": true,
          "sentAt": "2025-03-24T15:45:25.456Z"
        },
        {
          "content": "It's 10pm",
          "block": "67df514533a22d8c85f48642",
          "isUserMessage": false,
          "sentAt": "2025-03-24T15:45:27.789Z"
        }
      ],
      "configuration": "67df514533a22d8c85f4864c",
      "lastBlock": "67df514533a22d8c85f48642",
      "createdAt": "2025-03-24T15:45:10.000Z",
      "updatedAt": "2025-03-24T15:45:27.789Z"
    }
  ]
}
```

---

### [GET] /api/v1/chat/:id
**What it does:**  
Get specific chat history
**Request schema:**  
No request body required.

**Response schema:**
```typescript
{
  "chat":
    {
      "_id": ObjectId,
      "messages": [
        {
          "content": String,
          "block": String, // ID of the block that generated/received this message
          "isUserMessage": Boolean,
          "sentAt": Date
        }
      ],
      "configuration": String, // ID of the configuration used for this chat
      "lastBlock": String, // ID of the last active block
      "createdAt": Date,
      "updatedAt": Date
    }
}
```
***Sample response:***
```typescript
{
  "chat":
    {
      "_id": "67e1f23a9b8c7d6e5f4a3b2c",
      "messages": [
        {
          "content": "Hello, what are you looking for today?",
          "block": "67df514533a22d8c85f4863e",
          "isUserMessage": false,
          "sentAt": "2025-03-24T14:32:15.123Z"
        },
        {
          "content": "I want to know the weather",
          "block": "67df514533a22d8c85f4863f",
          "isUserMessage": true,
          "sentAt": "2025-03-24T14:32:28.456Z"
        },
        {
          "content": "It's sunny",
          "block": "67df514533a22d8c85f48641",
          "isUserMessage": false,
          "sentAt": "2025-03-24T14:32:30.789Z"
        }
      ],
      "configuration": "67df514533a22d8c85f4864c",
      "lastBlock": "67df514533a22d8c85f48641",
      "createdAt": "2025-03-24T14:32:15.000Z",
      "updatedAt": "2025-03-24T14:32:30.789Z"
    }
}
```


---

## WebSocket Endpoints
Sample connection:
>ws://localhost:3000/ws/chat
### [WS] /ws/chat
**What it does:**  
Start new chat with active configuration
### [WS] /ws/chat/:id
**What it does:**  
Continue existing chat by ID

### Websococket messages schemas and samples
**Message schema:** 
```typescript 
{
    "message": String
}
```
**Response schema:**  
***Conversation started***
```typescript 
{
    "status": "started",
    "chatId": ObjectId
}
```
***Chatbot message***
```typescript
{
    "status": "response",
    "message": String
}
```
***Chat ended***
```typescript
{
    "status": "finished",
}
```
***Chat history***
```typescript
[
    {
        "content": String,
        "_id": ObjectId,
        "isUserMessage": Boolean,
        "sentAt": Date
    },
]
```
**Sample Message**  
```typescript 
{
    "message": "What is the weather like?"
}
```
**Sample Response**
```typescript 
{
    "status": "response",
    "message": "It's sunny"
}
{
    "status": "response",
    "message": "Would you like anything else?"
}
```
---



