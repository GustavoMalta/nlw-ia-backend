# Next Level Week I.A.

Backend develop in the event made by Rocketseat.
There is some changes that I made in original layout, and space for improvements.

## **The Frontend project**

You can check the Frontend here:
[NLW-IA-Frontend](https://github.com/GustavoMalta/nlw-ia-fontend)

## **Run Backend project**

\
Environment variables:

Create a .env file based on .env.example with you key generated on OpenAI.
For new accounts they offers $5.00 that expires in 3 months to teste the API, so you can use this credit to test the system.\
Depending the content of the video, the cost to transcript is some arount $0.05 or $0.10, and is the most expensive process, so, be careful to re-upload the same video twice, for this use the "select" section to search for a video already transcripted.\
To generate the Title or the Description is way more cheaper, about fractions of cents, so you can do this a lot without worryies.

[Generate your secret key on OpenAI here!](https://platform.openai.com/account/api-keys)

---

\
Download dependences:

```
npm install
```

or

```
yarn
```

---

\
Prepare Database:

```
npx prisma migrate dev
```

or

```
yarn prisma migrate dev
```

---

\
Execute Project:

```
npm run dev
```

or

```
yarn dev
```

---

\
Check Database with Prisma:

```
npx prisma studio
```

or

```
yarn prisma studio
```

---
