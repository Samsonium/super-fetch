# Usage examples

## API
API requests are the main part of this library. API fetching allows
to write strongly typed queries using API repositories
and the `fetchApi` function.

### Creating a Single Entry
If you need to use only one API request, then you can
specify as a constant with type `ApiRecord`:

```ts
import { ApiRecord } from '@samsonium/super-fetch';

/** Method to get a list of user profiles */
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

In this example, we created a method to get a list
user profiles and specified the following type parameters:
1. Query parameters: `page` and `per_page` for pagination.
   They will be added to the URL after the "?" character.
2. Lack of path parameters. There are no variables in our query
   in the path to the method itself, so we just put `null`.
3. Body of the successful response. In this case, the body stores an array
   profiles along the path `data.items`.
4. Body of unsuccessful response. If the request fails,
   then we will receive a `message` field with a description of the error.

Also, inside we specified the `endpoint` field with the path to the API method
and `method`, which describes the HTTP method to use.

> **Important!** If you are not using the API class (to be described below),
> then the `endpoint` field must contain the full URL string, including
> includes protocol, domain and path.

This method is called using the `fetchApi` function from
`sf` constants:

```ts
import sf from '@samsonium/super-fetch';
import { profilesList } from '/apis/profiles.list';

// ...

/** For example, we put it in a wrapper function */
async function fetchProfilesList() {
   const res = await sf.fetchApi(profilesList, {
      query: {
         page: 0,
         per_page: 10
      }
   });

   // We can use request verification,
   // as well as the code and text of the HTTP response status
   if (!res.ok)
      return console.error(`[${res.statusCode}] /profiles: ${res.statusText}`);
   
   // The body of the response is in the `data` field
   return res.data;
}
```

### Creating a repository
To group API methods in Super Fetch there is a function `groupApi`,
which creates a wrapper around `fetchApi` and allows you to preset
request settings and base URL. However, if you do not need this method,
then you can simply put all the records into an object by key.

#### Method No. 1 (sf.groupApi)
The API class is contained within the default exported constant `sf`
and is initialized as follows:

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

Here we import the `sf` constant and the `ApiRecord` type to describe
our method, and then create the `api` constant using the function
`groupApi`. In it we indicate the base URL, a list of API methods and
settings for the request.

Example of calling a method from an API group:

```ts
import { api } from '/apis';

// ...

/** Using a wrapper function */
async function signIn(email: string, password: string) {
    const res = await api.identity.signIn({
        body: {email, password}
    });

    // ...

    return res.data;
}
```

#### Method No. 2 (object)
The method with an object provides that: either you made the generator functions yourself
the full URL string, or you specify the full URL string in each request.
Also, the disadvantage of this method is that you need to configure the request
register on every call. Here is an example of creating a repository through an object:

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

And an example call from this repository:

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
If there is no need to use a library for API requests, but strict
typing is still needed, you can use simple queries available
inside the `sf` constant:

```ts
import sf from '@samsonium/super-fetch';

/** Successful response body */
type S = {
    ok: true;
};

/** Body of unsuccessful response */
type E = {
    ok: false;
};

await sf.get<S, E>('/', {});    // GET
await sf.post<S, E>('/', {});   // POST
await sf.put<S, E>('/', {});    // PUT
await sf.patch<S, E>('/', {});  // PATCH
await sf.delete<S, E>('/', {}); // DELETE
```

Simple queries can also be executed in parallel if you need to get
answers from several sources using the same data:

```ts
import sf from '@samsonium/super-fetch';

const result = await sf.parallel([sf.get('/profile/avatar'), sf.get('/profile/info')]);

/*
 The response will come after all requests are completed in this format:
 
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

If we need to get everything or get an error, then we can specify the second
argument `true`. It is responsible for throwing an exception in case of an error
in at least one request:

```ts
import sf from '@samsonium/super-fetch';

const result = await sf.parallel([sf.get('/profile/avatar'), sf.get('/profile/info')], true);
// -> Error
```
