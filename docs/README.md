![Poster](poster.png)

# Super Fetch
The Super Fetch library is a lightweight (7.6 KB) ESM library that provides strict and secure
interface for making HTTP requests using
[Fetch API](https:developer.mozilla.orgen-USdocsWebAPIFetch_API).

### Features

| Status           | Icon |
|------------------|------|
| Ready            | ✅    |
| Work in progress | 🏗️  |
| Planned          | 📃   |

- ✅ **API**: queries built on the basis of the API repository, allowing you to specify types for query parameters,
  path parameters as in express, bodies of successful and unsuccessful responses, as well as the body of the request.
- ✅ **Simple**: a simplified way of making requests using `.get`, `.post` and other REST API methods.
- 🏗️ (будет в 1.1.0) **Linked sequence**: A codependent query environment in which old responses cannot overwrite new ones.
- 📃 (будет в 1.2.0) **Long polling**: Controlled long polling.

### Installation
You can install the library using NPM:
```shell
npm i @samsonium/super-fetch
```

### Contribution
If you know about any problem or have a suggestion to improve the project, describe it in the section
[issue](https://github.com/samsonium/super-fetch/issues) or submit a merge request.

### License
This project is governed by the MIT license.
