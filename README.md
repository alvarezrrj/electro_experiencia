# API usuarios

## CRUD roles y usuarios

+ Puerto: 4200


### Crear rol

|Endpoint: /rol||
---|---|
Method  | POST
Body    | `descripcion: string`
Returns | Rol (el rol creado)


### Ver roles

|Endpoint: /rol/:roleId?||
---|---|
|Method    | GET                   
|Parametros| roleId: int (opcional)
|Returns   | Rol[]                 

**Nota**: omitir parametro roleId para ver todos los roles


### Editar un rol

|Endpoint: /rol/:rolId||
---|---|
Method     | POST
Parametros | rolId: int
Body       | `descripcion: string`
Returns    | Rol (el rol editado)


### Eliminar un rol

|Endpoint: /rol/:rolId||
---|---|
Method     | DELETE
Parametros | rolId: int
Returns    | OK 200 si el rol se elimina sin problemas


### Crear usuario

|Endpoint: /usuario||
---|---|
Method     | POST
Body       | Usuario
Returns    | Usuario (el usuario creado)

**Nota**: omitir el parámetro rol para asignarle el rol por defecto (cliente)

### Ver usuarios por dni
|Endpoint: /usuario/:dni||
---|---|
Method     | GET
Parametros | dni: int (opcional)
Returns    | Usuario[]

**Nota**: omitir parametro dni para ver todos los usuarios

### Ver usuarios por rol
|Endpoint: /rol/:rolId/usuarios||
---|---|
Method     | GET
Parametros | rolId: int
Returns    | Usuario[]

### Editar un usuario

|Endpoint: /usuario/:dni||
---|---|
Method     | POST
Parametros | dni: int
Body       | Usuario
Returns    | Usuario (el usuario editado)

### Eliminar un usuario

|Endpoint: /usuario/:dni||
---|---|
Method     | DELETE
Parametros | dni: int
Returns    | OK 200 si el rol se elimina sin problemas

## Interfaces

### Rol 
```
{
    id_rol:      int    (11),
    descripcion: string (191 chars max)
}
```

### Usuario 
```
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
