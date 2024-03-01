# Примеры использования библиотеки

## API
API запросы - основная часть данной библиотеки. Она позволяют
писать строго типизированные запросы, используя API-репозитории
и функцию `fetchApi`.

### Создание одиночной записи
Если нужно использовать только один API-запрос, то его можно
указать в виде константы с типом `ApiRecord`:

```ts
import { ApiRecord } from '@samsonium/super-fetch';

/** Метод для получения списка профилей пользователей */
export const profilesList: ApiRecord<{
    page: number;
    per_page: number;
}, null, {
    data: {
        items: {
            id: string;
            firstName: string;
            lastName: string;
            avatar: string;
        }[]
    }
}, {
    message: string;
}> = {
    endpoint: 'https://api.example.com/profiles',
    method: 'GET'
};
```

В данном примере мы создали метод для получения списка
профилей пользователей и указали следующие параметры типа:
1. Query-параметры: `page` и `per_page` для пагинации.
   Они будут добавлены в URL после символа "?".
2. Отсутствие path-параметров. В нашем запросе нет переменных
   в самом пути к методу, поэтому просто ставим `null`.
3. Тело успешного ответа. В данном случае тело хранит массив
   профилей по пути `data.items`.
4. Тело неуспешного ответа. Если запрос закончится неуспешно,
   то нам придёт поле `message` с описанием ошибки.

Также, внутри мы указали поле `endpoint` с путём до API метода
и `method`, описывающий используемый HTTP-метод.

> **Важно!** Если Вы не используете класс API (будет описан ниже),
> то поле `endpoint` должно содержать полную URL строку, включающую
> в себя протокол, домен и путь.

Вызов данного метода осуществляется с помощью функции `fetchApi` из
константы `sf`:

```ts
import sf from '@samsonium/super-fetch';
import { profilesList } from '/apis/profiles.list';

// ...

/** Например, кладём в функцию-обёртку */
async function fetchProfilesList() {
   const res = await sf.fetchApi(profilesList, {
      query: {
         page: 0,
         per_page: 10
      }
   });

   // Можем использовать проверку запроса,
   // а также код и текст статуса ответа HTTP
   if (!res.ok)
      return console.error(`[${res.statusCode}] /profiles: ${res.statusText}`);
   
   // Тело ответа лежит в поле `data`
   return res.data;
}
```

### Создание репозитория
Для группирования API-методов в Super Fetch есть функция `groupApi`,
создающая обёртку над `fetchApi` и позволяющая предустанавливать
настройки запроса и базовый URL. Однако, если Вам не нужен такой способ,
то Вы можете просто поместить все записи в объект по ключам.

#### Способ №1 (sf.groupApi)
Класс API содержится внутри экспортируемой по умолчанию константы `sf`
и инициализируется следующим образом:

```ts
import sf, { ApiRecord } from '@samsonium/super-fetch';

export const api = sf.groupApi('https://api.example.com/', {
   identity: {
      signUp: {
         endpoint: '/identity/signup',
         method: 'POST'
      } as ApiRecord<null, null, {
         access_token: string;
      }, {
         message: string;
      }, {
         firstName: string;
         lastName: string;
         email: string;
         password: string;
      }>,

      signIn: {
         endpoint: '/identity/signin',
         method: 'POST'
      } as ApiRecord<null, null, {
         access_token: string
      }, {
         message: string
      }, {
         email: string;
         password: string;
      }>
   }
}, {
   headers: {
      'Accept': 'application/json'
   },
   extra: {
      mode: 'cors'
   }
});
```

Здесь мы импортируем константу `sf` и тип `ApiRecord`, для описания
нашего метода, а затем создаём константу `api` с помощью функции
`groupApi`. В неё мы указываем базовый URL, список API-методов и
настройки для запроса.

Пример вызова метода из группы API:

```ts
import { api } from '/apis';

// ...

/** Используем функцию-обёртку */
async function signIn(email: string, password: string) {
    const res = await api.identity.signIn({
        body: {email, password}
    });

    // ...

    return res.data;
}
```

#### Способ №2 (объект)
Способ с объектом предусматривает, что: либо Вы сами сделали функции-генератор
полной URL строки, либо вы указываете полную URL строку в каждом запросе.
Также, минусом данного способа является то, что настройки запроса нужно
прописывать при каждом вызове. Вот пример создания репозитория через объект:

```ts
import { ApiRecord } from '@samsonium/super-fetch';

export const apis = {
   identity: {
      signIn: {
         endpoint: 'https://api.example.com/identity/signin',
         method: 'POST'
      } as ApiRecord<null, null, {
         access_token: string;
      }, {
         message: string;
      }, {
         email: string;
         password: string;
      }>,
      
      signUp: {
         endpoint: 'https://api.example.com/identity/signup',
         method: 'POST'
      } as ApiRecord<null, null, {
         access_token: string;
      }, {
         message: string;
      }, {
          firstName: string;
          lastName: string;
          email: string;
          password: string;
      }>
   }
};
```

И пример вызова из этого репозитория:

```ts
import { apis } from '/apis';
import sf from '@samsonium/super-fetch';

async function signIn(email: string, password: string) {
    const res = await sf.fetchApi(apis.identity.signIn, {
        headers: {
            'Accept': 'application/json'
        },
        extra: {
            mode: 'cors'
        }
    });

    // ...

    return res.data;
}
```

## Simple
Если нет необходимости использовать библиотеку для запросов к API, но строгая
типизация всё равно нужна, то можно использовать простые запросы, доступные
внутри константы `sf`:

```ts
import sf from '@samsonium/super-fetch';

/** Тело успешного ответа */
type S = {
    ok: true;
};

/** Тело неуспешного ответа */
type E = {
    ok: false;
};

await sf.get<S, E>('/', {});    // GET
await sf.post<S, E>('/', {});   // POST
await sf.put<S, E>('/', {});    // PUT
await sf.patch<S, E>('/', {});  // PATCH
await sf.delete<S, E>('/', {}); // DELETE
```

Простые запросы также могут быть выполнены параллельно, если нужно получить
ответы из нескольких источников по одним и тем же данным:

```ts
import sf from '@samsonium/super-fetch';

const result = await sf.parallel([sf.get('/profile/avatar'), sf.get('/profile/info')]);

/*
 Ответ придёт по завершению всех запросов в таком формате:
 
 [
    {
        ok: true,
        statusCode: 200,
        statusText: 'OK',
        json: Function,
        text: Function
    },
    {
        ok: false,
        statusCode: 404,
        statusText: 'Not found',
        json: Function,
        text: Function
    }
 ]
 */
```

Если нам нужно получить всё, либо выйти в ошибку, то можно указать вторым
аргументом `true`. Он отвечает за выбрасывание исключения в случае ошибки
хотя бы в одном запросе:

```ts
import sf from '@samsonium/super-fetch';

const result = await sf.parallel([sf.get('/profile/avatar'), sf.get('/profile/info')], true);
// -> Error
```
