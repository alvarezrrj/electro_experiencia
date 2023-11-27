# ElextroFix APIs

## Roles, Usuarios, Reparaciones Nomencladas y Recepciones

+ URL Testing: https://electrofix-usuarios-y-roles.onrender.com
+ Puerto (sólo en producción): 4200

### Contenidos

#### Roles
+ [Crear rol](#crear-rol)
+ [Ver roles](#ver-roles)
+ [Editar un rol](#editar-un-rol)
+ [Eliminar un rol](#eliminar-un-rol)

#### Usuarios
+ [Crear usuario](#crear-usuario)
+ [Crear cliente](#crear-cliente)
+ [Crear empleado](#crear-empleado)
+ Ver usuarios
    - [Por DNI](#ver-usuarios-por-dni)
    - [Por rol](#ver-usuarios-por-rol)
    - [Ver clientes](#ver-clientes)
    - [Ver empleados](#ver-empleados)
+ [Editar un usuario](#editar-un-usuario)
+ [Eliminar un usuario](#eliminar-un-usuario)

#### Reparaciones Nomencladas
+ [Crear reparación](#crear-reparación)
+ [Editar reparación](#editar-reparación)
+ [Ver reparaciones](#ver-reparaciones)
+ [Buscar reparación](#buscar-reparación)
+ [Eliminar reparación](#eliminar-reparación)

#### Recepciones
+ [Crear recepción](#crear-recepción)
+ [Ver recepciones](#ver-recepciones)
+ [Editar recepción](#editar-recepción)
+ [Eliminar recepción](#eliminar-recepción)

#### Turnos (solicitud de diagnóstico o visita)
+ [Crear turno](#crear-turno)
+ [Ver turnos](#ver-turnos)
+ [Editar turno](#editar-turno)
+ [Eliminar turno](#eliminar-turno)

#### Login
+ [Iniciar sesión](#iniciar-sesión)
+ [Cerrar sesión](#cerrar-sesión)

#### Otros
+ [Interfaces](#interfaces)
+ [Despliegue](#despliegue)

### Crear rol

|Endpoint:| `/rol`|
---|---|
Method      | POST
Body (`json`) | `{ descripcion: string }`
Returns     | [`Rol`](#rol) (el rol creado)
Error       | [`Error`](#error)

**Nota**: la descripción es convertida a minúsculas. Roles con la misma descripción no están permitidos.

### Ver roles

|Endpoint:| `/rol/:rolId?`|
---|---|
Ej.       | /rol/1
Method    | GET                   
Parametros| rolId: `int` (opcional)
Returns   | [`Rol[]`](#rol)
Error     | [`Error`](#error)

**Nota**: omitir parametro roleId para ver todos los roles


### Editar un rol

|Endpoint:| `/rol/:rolId`|
---|---|
Method     | POST
Parametros | rolId: `int`
Body (`json`)| `{ descripcion: string }`
Returns    | [`Rol`](#rol) (el rol editado)
Error      | [`Error`](#error)


### Eliminar un rol

|Endpoint:| `/rol/:rolId`|
---|---|
Method     | DELETE
Parametros | rolId: `int`
Returns    | OK 200 si el rol se elimina sin problemas
Error      | [`Error`](#error)


### Crear usuario

Crear cualquier tipo de usuario, se le debe asignar un rol

|Endpoint:| `/usuario`|
---|---|
Method     | POST
Body (`json`)| [`CamposDeUsuario`](#camposdeusuario)
Returns    | [`UsuarioCreado`](#usuariocreado) (el usuario creado)
Error      | [`Error`](#error)

**Nota**: omitir el parámetro rol para asignarle el rol por defecto (cliente)

### Crear cliente

Crear un usuario con rol `cliente`

|Endpoint:| `/usuario/clientes`|
---|---|
Method     | POST
Body (`json`)| `Omit`<[`CamposDeUsuario`](#camposdeusuario), `'rol'`> (`CamposDeUsuario` excluyendo el campo `rol`)
Returns    | [`UsuarioCreado`](#usuariocreado) (el usuario creado)
Error      | [`Error`](#error)

### Crear empleado

Crear un usuario con rol `empleado`

|Endpoint:| `/usuario/empleados`|
---|---|
Method     | POST
Body (`json`)| `Omit`<[`CamposDeUsuario`](#camposdeusuario), `'rol'`> (`CamposDeUsuario` excluyendo el campo `rol`)
Returns    | [`UsuarioCreado`](#usuariocreado) (el usuario creado)
Error      | [`Error`](#error)

### Ver usuarios por dni

|Endpoint:| `/usuario/:dni`|
---|---|
Ej.        | /usuario/33333333
Method     | GET
Parametros | dni: `int` (opcional)
Returns    | [`Usuario[]`](#usuario)
Error      | [`Error`](#error)

**Nota**: omitir parametro dni para ver todos los usuarios

### Ver usuarios por rol
|Endpoint:| `/rol/:rolId/usuarios`|
---|---|
Method     | GET
Parametros | rolId: `int`
Returns    | [`UsuarioCreado[]`](#usuariocreado)
Error      | [`Error`](#error)

### Ver clientes

|Endpoint:| `/usuario/clientes`|
---|---|
Method     | GET
Returns    | [`Usuario[]`](#usuario)
Error      | [`Error`](#error)

### Ver empleados

|Endpoint:| `/usuario/empleados`|
---|---|
Method     | GET
Returns    | [`Usuario[]`](#usuario)
Error      | [`Error`](#error)

### Editar un usuario

|Endpoint:| `/usuario`|
---|---|
Method     | PUT
Body (`json`)| [`CamposDeUsuario`](#camposdeusuario)
Returns    | [`UsuarioCreado`](#usuariocreado) (el usuario editado)
Error      | [`Error`](#error)

### Eliminar un usuario

|Endpoint:| `/usuario/:dni`|
---|---|
Ej.        | /usuario/33333333
Method     | DELETE
Parametros | dni: `int`
Returns    | OK 200 si el usuario se elimina sin problemas
Error      | [`Error`](#error)

### Crear reparación
|Endpoint:| `/reparacion`|
---|---|
Method     | POST
Body (`json`)| [`CamposDeReparacionNomenclada`](#camposdereparacionnomenclada)
Returns    | [`ReparacionNomenclada`](#reparacionnomenclada) (la reparación creada)
Error      | [`Error`](#error)

### Editar reparación

|Endpoint:| `/reparacion`|
---|---|
Method     | PUT
Body (`json`)| [`CamposDeReparacionNomenclada`](#camposdereparacionnomenclada) `& { id: int }`
Returns    | [`ReparaciónNomenclada`](#reparacionnomenclada) (la reparación editada)
Error      | [`Error`](#error)

### Ver reparaciones

|Endpoint:| `/reparacion/:reparacionId?`|
---|---|
Method    | GET                   
Parametros| reparacionId: `int` (opcional)
Returns   | [`ReparacionNomenclada[]`](#reparacionnomenclada)
Error     | [`Error`](#error)

**Nota**: omitir parametro reparacionId para ver todas las reparaciones

### Buscar reparación

|Endpoint:| `/reparacion/search?q=search_string`|
---|---|
Ej.       | /reparacion/search?q=cambio de motor
Method    | GET                   
Parametros| q: `string` (palabras clave a buscar en el nombre y descripción de la reparación)
Returns   | [`ReparacionNomenclada`](#reparacionnomenclada)
Error     | [`Error`](#error)


### Eliminar reparación

|Endpoint:| `/reparacion/:reparacionId`|
---|---|
Ej.        | /reparacion/1
Method     | DELETE
Parametros | reparacionId: `int`
Returns    | OK 200 si la reparación se elimina sin problemas
Error      | [`Error`](#error)

### Crear recepción
|Endpoint:| `/recepcion`|
---|---|
Method     | POST
Body (`json`)| [`CamposDeRecepcion`](#camposderecepcion)
Returns    | [`RecepcionCreada`](#recepcioncreada) (la recepción creada)
Error      | [`Error`](#error)

**Nota**: `employee_id` debe ser el `id` de un usuario con `rol` "employee"

### Ver recepciones

|Endpoint:| `/recepcion/:recepcionId?`|
---|---|
Ej.       | /recepcion/1
Method    | GET                   
Parametros| recepcionId: `int` (opcional)
Returns   | [`Recepcion[]`](#recepcion)
Error     | [`Error`](#error)

**Nota**: omitir parametro recepcionId para ver todas las recepciones

### Editar recepción
|Endpoint:| `/recepcion/:recepcionId`|
---|---|
Method     | PUT
Parametros | recepcionId: `int`
Body (`json`)| [`CamposDeRecepcion`](#camposderecepcion)
Returns    | [`RecepcionCreada`](#recepcioncreada) (la recepción editada)
Error      | [`Error`](#error)

### Eliminar recepción

|Endpoint:| `/recepcion/:recepcionId`|
---|---|
Ej.        | /recepcion/1
Method     | DELETE
Parametros | recepcionId: `int`
Returns    | OK 200 si la recepción se elimina sin problemas
Error      | [`Error`](#error)

### Iniciar sesión

La sesión usa cookies.

|Endpoint:| `/login`|
---|---|
Ej         | `curl '/login?password=$ecreto&email=admin@example.com' -X POST`
Method     | POST
Params (`application/x-www-form-urlencoded`) | email=&lt;string&gt; password=&lt;string&gt;
Returns    | OK 200 si el usuario existe y la contraseña es correcta. 401 Unauthorized si el usuario no existe o la contraseña es incorrecta.
Error      | [`Error`](#error)

### Cerrar sesión

|Endpoint:| `/logout`|
---|---|
Method     | POST
Returns    | OK 200 si la sesión se cierra sin problemas.
Error      | [`Error`](#error)

### Crear turno

|Endpoint:| `/turno`
---|---|
Method      | POST
Body (json) | [`CamposDeTurno`](#camposdeturno)
Returns     | [`Turno`](#turno)
Error     | [`Error`](#error)

### Ver turnos

|Endpoint:| `/turno/:turnoId?`|
---|---|
Ej.       | /turno/1
Method    | GET                   
Parametros| turnoId: `int` (opcional)
Returns   | [`Turno[]`](#turno)
Error     | [`Error`](#error)

**Nota**: omitir parametro turnoId para ver todos los turnos

### Editar turno

|Endpoint:| `/turno/:turnoId`|
---|---|
Ej.       | /turno/1
Method    | PUT                   
Parametros| turnoId: `int`
Returns   | [`Turno[]`](#turno)
Error     | [`Error`](#error)

### Eliminar turno

|Endpoint:| `/turno/:turnoId`|
---|---|
Ej.       | /turno/1
Method    | DELETE
Parametros| turnoId: `int`
Returns   | OK 200 si el turno se elimina sin problemas
Error     | [`Error`](#error)

## Interfaces

### Rol
```typescript
{
//  nombre       tipo       tamaño
    id_rol:      int        (11)
    descripcion: string     (191)
    createdAt:   dateTime                      // YYYY-MM-DD HH:MM:SS
    updatedAt:   dateTime                      // YYYY-MM-DD HH:MM:SS
}
```

### CamposDeUsuario 
```typescript
{
//  nombre          tipo       tamaño
    id:             int        (11)            // DNI
    first_name:     string     (191)
    last_name:      string     (191)
    email:          string     (191)
    // 8 caracteres, una mayúscula, una minúscula, un número y un simbolo
    password:       string     
    cuit:           string     (32) 
    condicion_iva:  string     (191) // Default: "Consumidor final"
    rol:            int        (11)
}
```

### Usuario
```typescript
{
//  nombre          tipo       tamaño
    id:             int        (11) 
    first_name:     string     (191)
    last_name:      string     (191)
    email:          string     (191)
    telefono:       string     (15)
    cuit:           string     (32) 
    condicion_iva:  string     (191)
    createdAt:      dateTime                   // YYYY-MM-DD HH:MM:SS
    updatedAt:      dateTime                   // YYYY-MM-DD HH:MM:SS
    Rol:            Rol    
}
```

### UsuarioCreado
```typescript
{
//  nombre          tipo       tamaño
    id:             int        (11) 
    first_name:     string     (191)
    last_name:      string     (191)
    email:          string     (191)
    telefono:       string     (15)
    cuit:           string     (32) 
    condicion_iva:  string     (191)
    rol:            int        (11)
    createdAt:      dateTime                   // YYYY-MM-DD HH:MM:SS
    updatedAt:      dateTime                   // YYYY-MM-DD HH:MM:SS
}
```

### CamposDeReparacionNomenclada
```typescript
{
//  nombre       tipo       tamaño
    name         string     (191)
    descripcion  string     (65,535)
    costo        int        (11)
}
```

### ReparacionNomenclada
```typescript
{
//  nombre       tipo       tamaño
    id           int        (11)
    name         string     (191)
    descripcion  string     (65,535)
    costo        int        (11)
    createdAt    dateTime                      // YYYY-MM-DD HH:MM:SS
    updatedAt    dateTime                      // YYYY-MM-DD HH:MM:SS
}
```

### CamposDeRecepcion
```typescript
{
//  nombre       tipo       tamaño
    first_name   string     (191)
    last_name    string     (191)
    email        string     (191)
    telefono     string     (15)
    equipo       string     (191)
    tipo         string     (191)
    descripcion  string     (65,535)
    employee_id  int        (11)
}
```

### Recepcion 
```typescript
{
//  nombre       tipo       tamaño
    id           int        (11) 
    first_name   string     (191)
    last_name    string     (191)
    email        string     (191)
    telefono     string     (15)
    equipo       string     (191)              // Modelo
    tipo         string     (191)
    descripcion  string     (65,535)           // Descripción de la falla
    employee_id  int        (11)
    Employee     Usuario     
    createdAt    dateTime                      // YYYY-MM-DD HH:MM:SS    
    updatedAt    dateTime                      // YYYY-MM-DD HH:MM:SS    
}
```

### RecepcionCreada
```typescript
{
//  nombre       tipo       tamaño
    id           int        (11) 
    first_name   string     (191)
    last_name    string     (191)
    email        string     (191)
    telefono     string     (15)
    equipo       string     (191)
    tipo         string     (191)
    descripcion  string     (65,535)
    employee_id  int        (11)
    createdAt    dateTime                      // YYYY-MM-DD HH:MM:SS    
    updatedAt    dateTime                      // YYYY-MM-DD HH:MM:SS    
}
```

### CamposDeTurno
```typescript
{
//  nombre       tipo       tamaño
    name         string     (191)
    email        string     (191)
    telefono     string     (191)
    descripcion  string     (65,535)
    equipo       string     (191)
    fecha        dateTime                      // YYYY-MM-DD HH:MM:SS  
}
```

### Turno
```typescript
{
//  nombre       tipo       tamaño
    id           int        (11)
    name         string     (191)
    email        string     (191)
    telefono     string     (191)
    descripcion  string     (65,535)
    equipo       string     (191)
    fecha        dateTime                      // YYYY-MM-DD HH:MM:SS  
    createdAt    dateTime                      // YYYY-MM-DD HH:MM:SS  
    updatedAt    dateTime                      // YYYY-MM-DD HH:MM:SS  
}
```

### Error
```typescript
{
    error: string
}
```

## Despliegue

Copiar `.env.example` a `.env` y setear las variables de entorno en `.env`. Luego, desde el directorio `usuario` correr

```bash
$ npm install   
$ npx tsc
$ npx prisma migrate deploy
$ npx prisma generate
$ npm run seed
$ npm run prod
```

Para instalar dependencias, compilar TypeScript, correr migraciones, generar el cliente de Prisma, poblar la base de datos con roles y usuario administrador e iniciar el servidor.

Empujar a la rama `master` dispara un despliegue en Render.


## Autor

**[Rodrigo Alvarez](https://github.com/alvarezrrj)**