# API usuarios

## CRUD roles y usuarios

+ Puerto: 4200

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


### Crear rol

|Endpoint: /rol||
---|---|
Method      | POST
Body (json) | `{ descripcion: string }`
Returns     | [`Rol`](#rol) (el rol creado)


### Ver roles

|Endpoint: /rol/:roleId?||
---|---|
|Method    | GET                   
|Parametros| roleId: `int` (opcional)
|Returns   | [`Rol[]`](#rol)

**Nota**: omitir parametro roleId para ver todos los roles


### Editar un rol

|Endpoint: /rol/:rolId||
---|---|
Method     | POST
Parametros | rolId: `int`
Body (json)| `{ descripcion: string }`
Returns    | [`Rol`](#rol) (el rol editado)


### Eliminar un rol

|Endpoint: /rol/:rolId||
---|---|
Method     | DELETE
Parametros | rolId: `int`
Returns    | OK 200 si el rol se elimina sin problemas


### Crear usuario

|Endpoint: /usuario||
---|---|
Method     | POST
Body (json)| [`Usuario`](#usuario)
Returns    | [`Usuario`](#usuario) (el usuario creado)

**Nota**: omitir el parámetro rol para asignarle el rol por defecto (cliente)

### Ver usuarios por dni
|Endpoint: /usuario/:dni||
---|---|
Method     | GET
Parametros | dni: `int` (opcional)
Returns    | [`Usuario[]`](#usuario)

**Nota**: omitir parametro dni para ver todos los usuarios

### Ver usuarios por rol
|Endpoint: /rol/:rolId/usuarios||
---|---|
Method     | GET
Parametros | rolId: `int`
Returns    | [`Usuario[]`](#usuario)

### Editar un usuario

|Endpoint: /usuario/:dni||
---|---|
Method     | POST
Parametros | dni: `int`
Body (json)| [`Usuario`](#usuario)
Returns    | [`Usuario`](#usuario) (el usuario editado)

### Eliminar un usuario

|Endpoint: /usuario/:dni||
---|---|
Method     | DELETE
Parametros | dni: `int`
Returns    | OK 200 si el usuario se elimina sin problemas

## Interfaces

### Rol 
```typescript
{
    id_rol:      int    (11),
    descripcion: string (191 chars max)
}
```

### Usuario 
```typescript
{
    dni:          int    (11) 
    nombre:       string (191 chars max)
    apellido:     string (191 chars max)
    email:        string (191 chars max)
    contrasena:   string (191 chars max)
    telefono:     string (191 chars max)
    especialidad: string (191 chars max)
    rol?:         int    (11)
}
```

