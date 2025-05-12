# Библиотека oidc-auth-lib

Использует библиотеку `angular-oauth2-oidc` версии `^15.0.1`.
Встроенный в `angular-oauth2-oidc` http-interceptor добавляет токен
в заголовок `Authorization: Bearer...` запросов фронтенда, использующего `oidc-auth-lib`. 

## Сборка

Для сборки выполнить 
`npm run pack`
результат сборки будет находиться в файле 
`./dist/auth-lib/oidc-auth-lib-0.0.1.tgz`

## Использование
Подключить к проекту `npm install /path/to/oidc-auth-lib-0.0.1.tgz`

## Injection-токены библиотеки oidc-auth-lib
### Injection-токен для передачи настроек подключения к OIDC провайдеру
Библиотека экспортирует injection-токен `AUTH_LIB_SETTINGS_TOKEN`

В проекте предоставить значение этому injection-токену:

    @NgModule({
        ...
        providers: [
            ...
            {
                provide: AUTH_LIB_SETTINGS_TOKEN, useValue: AUTH_LIB_SETTINGS
            }
        ]
    }

где константа AUTH_LIB_SETTINGS имеет вид:

    export const AUTH_LIB_SETTINGS: AuthLibOidcSettings = {
        keycloak: {
            issuer: "https://keycloak.local/realms/APIM",
            clientId: "microfrontends_client"
        }
    }

где 
    `issuer` - адрес OIDC провайдера,
    `clientId` - название клиента, настроенного в OIDC провайдере 

### Injection-токен для передачи разрешенных ролей AUTH_LIB_ALLOWED_ROLES_TOKEN 
Библиотека экспортирует injection-токен `AUTH_LIB_ALLOWED_ROLES_TOKEN`

В проекте предоставить значение этому injection-токену:

    @NgModule({
        ...
        providers: [
            ...
            {
                provide: AUTH_LIB_ALLOWED_ROLES_TOKEN, useValue: AUTH_LIB_ALLOWED_ROLES
            }
        ]
    }

где константа AUTH_LIB_ALLOWED_ROLES для микрофронтенда имеет вид:

    export const AUTH_LIB_ALLOWED_ROLES: AuthLibAllowedRoles = {
        mf_name: {
            userRoles: ['admin_role1', ..., 'admin_roleN'], 
            adminRoles: ['user_role1', ..., 'user_roleN']
        }
    }

и для хост-приложения:

    export const AUTH_LIB_ALLOWED_ROLES: AuthLibAllowedRoles = {
        mf_name: {
            userRoles: ['admin_role1', ..., 'admin_roleN'], 
            adminRoles: ['user_role1', ..., 'user_roleN']
        },
        mf_other_name: {
            userRoles: ['admin_role1', ..., 'admin_roleN'], 
            adminRoles: ['user_role1', ..., 'user_roleN']
        },
        mf_another_name: {
            userRoles: ['admin_role1', ..., 'admin_roleN'], 
            adminRoles: ['user_role1', ..., 'user_roleN']
        },
    }

где

`mf_name`, `mf_other_name`, `mf_another_name` - идентификаторы микрофронтендов,

`userRoles`, `adminRoles` - наборы ролей, которые имеют пониженные и повышенные права,
соответствующие им роли должны находиться в токене по пути `realm_access.roles`.

## Функции
### isAuthenticated
Проверяет наличие валидного токена. Если токен отсутствует, то запускает аутентификацию в oidc-провайдере.
После успешного завершения аутентификации, проверяет наличие ролей в токене, используя настройки, 
предоставленные в `AUTH_LIB_ALLOWED_ROLES` для `rolesGroupName`:

    public isAuthenticated = (rolesGroupName: string, allowedAdminOnly: boolean): Promise<boolean>

где

`rolesGroupName` - идентификатор микрофронтенда,
`allowedAdminOnly` - разрешено ли использование повышенных прав

### isAccessAllowed
Проверяет наличие ролей в токене, используя настройки,
предоставленные в `AUTH_LIB_ALLOWED_ROLES` для `rolesGroupName`

    public isAccessAllowed(rolesGroupName: string)

### getAuthContext
Возвращает контекст аутентификации  

    public getAuthContext = (): null | AuthContext

контекст `AuthContext` имеет вид:

    export type AuthContext =  {
        userName: string,
        userRoles: string[],
        sessionId?: string
    }

где `userName` - имя пользователя, 
`userRoles` - список ролей пользователя из claims токена (`realm_access.roles`), 
`sessionId` - id сессии.

### logout
Инициирует выход:

    logout = (resolve?: ResolveType): void

где необязательный параметр `resolve` - функция типа `(value: boolean | PromiseLike<boolean>) => void`

# Подключение библиотеки к Module Federation

В проектах микрофронтендов, в файле `webpack.config.js` должна быть указана версия библиотеки `oidc-auth-lib`:

    shared: {
        ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
        "oidc-auth-lib": {singleton: true, requiredVersion: '0.0.1'}
    }