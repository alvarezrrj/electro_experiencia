# API usuarios

## CRUD roles y usuarios

+ URL Testing: https://electrofix-usuarios-y-roles.onrender.com
+ Puerto (sólo en producción): 4200

### Contenidos

+ [Crear rol](#crear-rol)
+ [Ver roles](#ver-roles)
+ [Editar un rol](#editar-un-rol)
+ [Eliminar un rol](#eliminar-un-rol)
+ [Crear usuario](#crear-usuario)
+ Ver usuarios
    - [Por DNI](#ver-usuarios-por-dni)
    - [Por rol](#ver-usuarios-por-rol)
+ [Editar un usuario](#editar-un-usuario)
+ [Eliminar un usuario](#eliminar-un-usuario)
+ [Interfaces](#interfaces)
+ [Despliegue](#despliegue)

### Crear rol

|Endpoint: `/rol`||
---|---|
Method      | POST
Body (json) | `{ descripcion: string }`
Returns     | [`Rol`](#rol) (el rol creado)
Error       | [`Error`](#error)

**Nota**: la descripción es convertida a minúsculas. Roles con la misma descripción no están permitidos.

### Ver roles

|Endpoint: `/rol/:rolId?`||
---|---|
Method    | GET                   
Parametros| roleId: `int` (opcional)
Returns   | [`Rol[]`](#rol)
Error     | [`Error`](#error)

**Nota**: omitir parametro roleId para ver todos los roles


### Editar un rol

|Endpoint: `/rol/:rolId`||
---|---|
Method     | POST
Parametros | rolId: `int`
Body (json)| `{ descripcion: string }`
Returns    | [`Rol`](#rol) (el rol editado)
Error      | [`Error`](#error)


### Eliminar un rol

|Endpoint: `/rol/:rolId`||
---|---|
Method     | DELETE
Parametros | rolId: `int`
Returns    | OK 200 si el rol se elimina sin problemas
Error      | [`Error`](#error)


### Crear usuario

|Endpoint: `/usuario`||
---|---|
Method     | POST
Body (json)| [`CamposDeUsuario`](#camposdeusuario)
Returns    | [`UsuarioCreado`](#usuariocreado) (el usuario creado)
Error      | [`Error`](#error)

**Nota**: omitir el parámetro rol para asignarle el rol por defecto (cliente)

### Ver usuarios por dni
|Endpoint: `/usuario/:dni`||
---|---|
Method     | GET
Parametros | dni: `int` (opcional)
Returns    | [`Usuario[]`](#usuario)
Error      | [`Error`](#error)

**Nota**: omitir parametro dni para ver todos los usuarios

### Ver usuarios por rol
|Endpoint: `/rol/:rolId/usuarios`||
---|---|
Method     | GET
Parametros | rolId: `int`
Returns    | [`UsuarioCreado[]`](#usuariocreado)
Error      | [`Error`](#error)

### Editar un usuario

|Endpoint: `/usuario`||
---|---|
Method     | PUT
Parametros | dni: `int`
Body (json)| [`CamposDeUsuario`](#camposdeusuario)
Returns    | [`UsuarioCreado`](#usuariocreado) (el usuario editado)
Error      | [`Error`](#error)

### Eliminar un usuario

|Endpoint: `/usuario/:dni`||
---|---|
Method     | DELETE
Parametros | dni: `int`
Returns    | OK 200 si el usuario se elimina sin problemas
Error      | [`Error`](#error)

## Interfaces


### Rol
```typescript
{
//  nombre       tipo       tamaño
    id_rol:      int        (11)
    descripcion: string     (191 chars max)
    createdAt:   datetime
    updatedAt:   dateTime
}
```

### CamposDeUsuario 
```typescript
{
//  nombre       tipo       tamaño
    id:          int        (11) 
    first_name:  string     (191 chars max)
    last_name:   string     (191 chars max)
    email:       string     (191 chars max)
    // 8 caracteres, una mayúscula, una minúscula, un número y un simbolo
    password:    string     (191 chars max)
    gender:      string     (191 chars max)
    username:    string     (191 chars max)
    rol:         int        (11)
}
```
**Nota**: la contraseña es omitida en pedidos que devuelven usuarios

### Usuario
```typescript
{
//  nombre       tipo       tamaño
    id:          int        (11) 
    first_name:  string     (191 chars max)
    last_name:   string     (191 chars max)
    email:       string     (191 chars max)
    gender:      string     (191 chars max)
    username:    string     (191 chars max)
    createdAt:   datetime
    updatedAt:   dateTime
    Rol:         Rol    
}
```

### UsuarioCreado
```typescript
{
//  nombre       tipo       tamaño
    id:          int        (11) 
    first_name:  string     (191 chars max)
    last_name:   string     (191 chars max)
    email:       string     (191 chars max)
    gender:      string     (191 chars max)
    username:    string     (191 chars max)
    rol:         int        (11)
    createdAt:   datetime
    updatedAt:   dateTime
}
```

### Error
```typescript
{
    error: string
}
```

## Despliegue

Copiar `.env.example` a `.env` y setear las variables de entorno en `.env`. Luego correr

```bash
$ npm install
$ npx prisma migrate
$ npm run seed
$ npm run prod
```

Para instalar dependencias, correr migraciones, poblar la base de datos con roles y usuario administrador e iniciar el servidor.

Empujar a la rama `master` dispara un despliegue en Render.
