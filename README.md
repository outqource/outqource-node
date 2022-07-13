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

```typescript
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

```typescript
export const getReviews = createPrismaController<PrismaClient.ReviewFindManyArgs>(Prisma, getReviewsAPI, {
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

```typescript
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

> 알리고 문자 메시지 전송 Class

- sendMessage
- sendMessages

```typescript
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

> 암호화 Class

- async hash
- signAES
- verifyAES

```typescript
const encrypt = new Encrypt({aes? , saltRound});

encrypt.hash(value, saltRound?);
encrypt.signAES(value);
encrypt.verifyAES(value);
```

### Firebase

> 파이어 베이스 PushNotification Class

```typescript
const firebaseMessage = new FirebaseMessaging(serviceAccount)
//serviceAccount : firebase config json 파일

firebaseMessage.sendMessage({token , notification : Notification})
firebaseMessage.sendMessages(messages : SendMessageProps)
```

> 단일 메시지 전송

**`sendMessage({token , notificaion} : SendMessageProps) `**

**`SendMessageProps`**

**`token :string`**

대상 토큰

**`notifiction : Notification`**

**`title? : string`**

메시지 제목

**`body? : string`**

메시지 내용

**`imageUrl? : string`**

첨부 이미지

<br>

> 다수 메시지 전송

**`sendMessages(messages : SendMessageProps)`**

**`SendMessagesProps`**

**`SendMessage[]`**

### Hangul

> 데이터 초성 검색 가능 Class

```typescript
const hangul = new Hangul();

const data = hangul.getChosungSearchedData<T>('name', rowData, 'ㅂㄱㅇ');
```

**`getChosungSearchedData< T extends Record<string,any> >(target : keyof T , data :T[], keyword : string) => T[]`**

**`target : keyof T`**

검색 대상의 key값

**`data : T[]`**

검색 대상

**`keyword : string`**

검색 키워드

### Iamport

> 아임포트 결제/인증 관련 Class

```typescript
const iamport = new Iamport({ imp_key, imp_secret, merchat_id, pg });

await iamport.getToken({ imp_key, imp_secret });
await iamport.getPaymentData({ access_token, imp_uid });
await iamport.getPaymentDataWithAccessToken({ imp_key, imp_secret, imp_uid });
await iamport.completePayment({ imp_key, imp_secret, imp_uid, productAmount });
await iamport.cancelPayment({ imp_key, imp_secret, imp_uid, reason, productAmount });
await iamport.getCertificationData({ access_token, imp_uid });
await iamport.getCeritificationDataWithAccessToken({ imp_key, imp_secret, imp_uid });
```

> 엑세스 토큰 추출 Method

**`getToken({imp_key , imp_secret} : IamportTypes.getToken) => Promise<string | null>`**

**`imp_key?: string`**

아임포트로부터 발급받은 key

**`imp_secret?: string`**

아임포트로부터 발급받은 secret_key

**`merchant_id?: string`**

ex) imp00000000

**`pg?: string`**

ex) tosstest

<br>

> 결제 정보 불러오기

**`getPaymentData({access_token ,imp_uid} : IamportTypes.getPaymentData) => Promise<any | null>`**

**`access_token: string`**

getToken을 통해 발급받은 accessToken

**`imp_uid: string`**

아임포트로부터 발급받은 imp_uid

<br>

> 액세스 토큰 발금 + 결제 정보 불러오기

**`getPaymentDataWithAccessToken({imp_key , imp_secret, imp_uid} : IamportTypes.getPaymentDataWithAccessToken) => Promise<any | string>`**

**`imp_key?: string`**

아임포트로부터 발급받은 key

**`imp_secret?: string`**

아임포트로부터 발급받은 secret_key

**`imp_uid: string`**

아임포트로부터 발급받은 imp_uid

<br>

> 액세스 토큰 발금 + 결제 정보 불러오기

**`completePayment({imp_key , imp_secret, imp_uid, productAmount } : IamportTypes.getTcompletePaymentoken) => Promise<IamportTypes.TcompletePayment>`**

**`imp_key?: string`**

아임포트로부터 발급받은 key

**`imp_secret?: string`**

아임포트로부터 발급받은 secret_key

**`imp_uid: string`**

아임포트로부터 발급받은 imp_uid

**`productAmount: string | number`**

결제 가격

<br>

**`IamportTypes.TcompletePayment`**

**`status: number`**

**`message: string`**

**`completeStatus?: string`**

**`data?: any`**

<br>

> 카드 환불

**`cancelPayment({imp_key , imp_secret, imp_uid, reason ,cancelAmount } : IamportTypes.cancelPayment) => Promise<any | null>`**

**`imp_key?: string`**

아임포트로부터 발급받은 key

**`imp_secret?: string`**

아임포트로부터 발급받은 secret_key

**`imp_uid: string`**

아임포트로부터 발급받은 imp_uid

**`reason?: string`**

취소 사유

**`cancelAmount: string | number`**

취소 가격

<br>

> 휴대폰 본인인증 정보 얻기

**`getCertificationData({access_token ,imp_uid} : IamportTypes.getCertificationData) => Promise<any | null>`**

**`access_token: string`**

getToken을 통해 발급받은 accessToken

**`imp_uid: string`**

아임포트로부터 발급받은 imp_uid

<br>

> 휴대폰 본인인증 토큰 발급과 함께 얻기

**`getCeritificationDataWithAccessToken({imp_key , imp_secret, imp_uid, productAmount } : IamportTypes.getCeritificationDataWithAccessToken) => Promise<any | null>`**

**`imp_key?: string`**

아임포트로부터 발급받은 key

**`imp_secret?: string`**

아임포트로부터 발급받은 secret_key

**`imp_uid: string`**

아임포트로부터 발급받은 imp_uid
