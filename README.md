# Outqource-Node

## Prisma

### ControllerAPI (Type)

- tags : 대분류
- path : Endpoint
- method : REST API Method
- param
- query
- header
- body
- auth : 인증 방식 "jwt" | "cookie" | "session"
- summary : 요약
- description : 설명
- formData
- response : Response 예시

#### 예시

```javascript
export const createReviewAPI: ControllerAPI = {
  tags: ['Review'],
  summary: '리뷰 생성하기',
  path: '/reviews',
  method: 'POST',
  auth: 'jwt',
  middlewares: [authorization.USER],
  body: [
    { key: 'content', type: 'string' },
    { key: 'score', type: 'number' },
    { key: 'doctorId', type: 'string', nullable: true },
    { key: 'pharmacistId', type: 'string', nullable: true },
  ],
  responses: [responseWithId(201)],
};
```

### createPrismaController\<T\> : CRUD API 작성 , T : Prisma Option

- params
  - database : PrismaClient
  - controllerAPI : ControllerAPI
  - options : PrismaOption (T)

####

```javascript
export const getReviews =
  createPrismaController <
  PrismaClient.ReviewFindManyArgs >
  (Prisma,
  getReviewsAPI,
  {
    table: 'Review',
    actions: ['findMany', 'count'],
    options: {
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    },
  });
```

## Express

### ExpressController (Type) : req, res, next => void

### createResponse : response generator

- skip
- take
- count
- data

### InitApp : Express Application

```javascript
const initApp = new InitApp({
  controllers,
  openAPI: {
    path: path.join(__dirname, config.SWAGGER_PATH),
    options: openAPIOptions,
    endPoint: '/api-docs',
  },
});
await initApp.init();

initApp.app.use(express.json({ limit: '50mb' }));
initApp.app.use(express.urlencoded({ limit: '50mb' }));
initApp.app.use(bodyParser.json({ limit: '50mb' }));
initApp.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

initApp.middlewares([], { jwtUserCallback });

initApp.app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

initApp.routers({
  globalOptions: {
    html: '<h1></h1>',
    status: 200,
  },
});

initApp.app.listen(config.PORT, () => {
  console.log(`🚀 Sever Listening on ${config.PORT}...`);
});
```

## Common

### 알리고

알리고 문자 메시지 전송 Class

- sendMessage
- sendMessages

```javascript
const aligo = new Aligo(userId, key, sender);

aligo.sendMessage({ phoneNumber, message });
aligo.sendMessages([
  { phoneNumber, message },
  { phoneNumber, message },
]);
```

### Axios

- onRequest

### Encrypt (암호화)

암호화 Class

- async hash
- signAES
- verifyAES

```javascript
const encrypt = new Encrypt({aes? , saltRound});

encrypt.hash(value, saltRound?);
encrypt.signAES(value);
encrypt.verifyAES(value);
```

### Firebase

파이어 베이스 PushNotification Class

```javascript
const firebaseMessage = new FirebaseMessaging(serviceAccount)
//serviceAccount : firebase config json 파일

firebaseMessage.sendMessage({token , notification : Notification})
firebaseMessage.sendMessages(messages : SendMessageProps)
```

**`sendMessage({token , notificaion} : SendMessageProps) `**

단일 메시지 전송

**`SendMessageProps`**
**`token :string`**

**`notifiction : Notification`**
**`title? : string`**
**`body? : string`**
**`imageUrl? : string`**

**\*`sendMessages(messages : SendMessageProps)`**
다수 메시지 전송

**`SendMessagesProps`**
**`SendMessage[]`**

### Hangul

데이터 초성 검색 가능 Class

```javascript
const hangul = new Hangul();

const data = hangul.getChosungSearchedData < T > ('name', rowData, 'ㅂㄱㅇ');
```

**`getChosungSearchedData<T extends Record<string,any>>(target : keyof T , data :T[], keyword : string)=>T[]`**

**`target : keyof T`**
검색 대상의 key값
**`data : T[]`**
검색 대상
**`keyword : string`**
검색 키워드
