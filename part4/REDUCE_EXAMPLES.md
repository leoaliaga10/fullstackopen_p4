# Usos de `reduce()` en list_helper.js

Este documento explica todos los usos del método `reduce()` en el archivo `list_helper.js`, con ejemplos claros y sencillos para entender cómo funciona cada implementación.

## ¿Qué es `reduce()`?

`reduce()` es un método de arrays que ejecuta una función reductora sobre cada elemento del array, devolviendo como resultado un único valor. Es muy útil para:
- Sumar valores
- Encontrar máximos/mínimos
- Transformar arrays en objetos
- Contar elementos

**Sintaxis básica:**
```javascript
array.reduce((acumulador, elementoActual) => {
  // lógica de reducción
  return nuevoAcumulador
}, valorInicial)
```

---

## 1. `totalLikes()` - Suma de valores

### Código:
```javascript
const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}
```

### Explicación:
- **Propósito**: Sumar todos los likes de todos los blogs
- **Acumulador (`sum`)**: Mantiene la suma total
- **Elemento actual (`blog`)**: Cada blog del array
- **Valor inicial**: `0`

### Ejemplo paso a paso:
```javascript
const blogs = [
  { title: "Blog A", likes: 5 },
  { title: "Blog B", likes: 3 },
  { title: "Blog C", likes: 8 }
]

// Iteración 1: sum = 0, blog = {title: "Blog A", likes: 5}
// Resultado: 0 + 5 = 5

// Iteración 2: sum = 5, blog = {title: "Blog B", likes: 3}
// Resultado: 5 + 3 = 8

// Iteración 3: sum = 8, blog = {title: "Blog C", likes: 8}
// Resultado: 8 + 8 = 16

// Resultado final: 16
```

---

## 2. `favoriteBlog()` - Encontrar el máximo

### Código:
```javascript
const favoriteBlog = (blogs) => {
  const favorite = blogs.reduce((favorite, current) => {
    return current.likes > favorite.likes ? current : favorite
  })
  
  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
}
```

### Explicación:
- **Propósito**: Encontrar el blog con más likes
- **Acumulador (`favorite`)**: El blog con más likes encontrado hasta ahora
- **Elemento actual (`current`)**: El blog que estamos comparando
- **Valor inicial**: No se especifica, usa el primer elemento del array

### Ejemplo paso a paso:
```javascript
const blogs = [
  { title: "Blog A", author: "Juan", likes: 5 },
  { title: "Blog B", author: "Ana", likes: 12 },
  { title: "Blog C", author: "Luis", likes: 8 }
]

// Iteración 1: favorite = {title: "Blog A", likes: 5}, current = {title: "Blog B", likes: 12}
// Comparación: 12 > 5 → true
// Resultado: {title: "Blog B", likes: 12}

// Iteración 2: favorite = {title: "Blog B", likes: 12}, current = {title: "Blog C", likes: 8}
// Comparación: 8 > 12 → false
// Resultado: {title: "Blog B", likes: 12}

// Resultado final: {title: "Blog B", author: "Ana", likes: 12}
```

---

## 3. `mostBlogs()` - Contar y encontrar máximo

### Código:
```javascript
const mostBlogs = (blogs) => {
  // Primer reduce: Contar blogs por autor
  const authorCounts = blogs.reduce((counts, blog) => {
    counts[blog.author] = (counts[blog.author] || 0) + 1
    return counts
  }, {})
  
  // Segundo reduce: Encontrar el autor con más blogs
  const mostBlogsAuthor = Object.entries(authorCounts).reduce((max, [author, count]) => {
    return count > max.blogs ? { author, blogs: count } : max
  }, { author: '', blogs: 0 })
  
  return {
    author: mostBlogsAuthor.author,
    blogs: mostBlogsAuthor.blogs
  }
}
```

### Explicación:

#### Primer `reduce()` - Contar blogs por autor:
- **Propósito**: Crear un objeto que cuenta cuántos blogs tiene cada autor
- **Acumulador (`counts`)**: Objeto con autores como claves y cantidades como valores
- **Valor inicial**: `{}` (objeto vacío)

#### Segundo `reduce()` - Encontrar el máximo:
- **Propósito**: Encontrar el autor con más blogs
- **Acumulador (`max`)**: El autor con más blogs encontrado hasta ahora
- **Valor inicial**: `{ author: '', blogs: 0 }`

### Ejemplo paso a paso:

#### Primer reduce (contar):
```javascript
const blogs = [
  { title: "Blog 1", author: "Juan" },
  { title: "Blog 2", author: "Ana" },
  { title: "Blog 3", author: "Juan" },
  { title: "Blog 4", author: "Ana" },
  { title: "Blog 5", author: "Ana" }
]

// Iteración 1: counts = {}, blog = {author: "Juan"}
// Resultado: {Juan: 1}

// Iteración 2: counts = {Juan: 1}, blog = {author: "Ana"}
// Resultado: {Juan: 1, Ana: 1}

// Iteración 3: counts = {Juan: 1, Ana: 1}, blog = {author: "Juan"}
// Resultado: {Juan: 2, Ana: 1}

// Iteración 4: counts = {Juan: 2, Ana: 1}, blog = {author: "Ana"}
// Resultado: {Juan: 2, Ana: 2}

// Iteración 5: counts = {Juan: 2, Ana: 2}, blog = {author: "Ana"}
// Resultado: {Juan: 2, Ana: 3}
```

#### Segundo reduce (encontrar máximo):
```javascript
// Object.entries(authorCounts) = [["Juan", 2], ["Ana", 3]]

// Iteración 1: max = {author: '', blogs: 0}, [author, count] = ["Juan", 2]
// Comparación: 2 > 0 → true
// Resultado: {author: "Juan", blogs: 2}

// Iteración 2: max = {author: "Juan", blogs: 2}, [author, count] = ["Ana", 3]
// Comparación: 3 > 2 → true
// Resultado: {author: "Ana", blogs: 3}

// Resultado final: {author: "Ana", blogs: 3}
```

---

## 4. `mostLikes()` - Sumar por categoría y encontrar máximo

### Código:
```javascript
const mostLikes = (blogs) => {
  // Primer reduce: Sumar likes por autor
  const authorLikes = blogs.reduce((likes, blog) => {
    likes[blog.author] = (likes[blog.author] || 0) + blog.likes
    return likes
  }, {})
  
  // Segundo reduce: Encontrar el autor con más likes totales
  const mostLikesAuthor = Object.entries(authorLikes).reduce((max, [author, totalLikes]) => {
    return totalLikes > max.likes ? { author, likes: totalLikes } : max
  }, { author: '', likes: 0 })
  
  return {
    author: mostLikesAuthor.author,
    likes: mostLikesAuthor.likes
  }
}
```

### Explicación:

#### Primer `reduce()` - Sumar likes por autor:
- **Propósito**: Crear un objeto que suma todos los likes de cada autor
- **Acumulador (`likes`)**: Objeto con autores como claves y likes totales como valores
- **Valor inicial**: `{}` (objeto vacío)

#### Segundo `reduce()` - Encontrar el máximo:
- **Propósito**: Encontrar el autor con más likes totales
- **Acumulador (`max`)**: El autor con más likes encontrado hasta ahora
- **Valor inicial**: `{ author: '', likes: 0 }`

### Ejemplo paso a paso:

#### Primer reduce (sumar likes):
```javascript
const blogs = [
  { title: "Blog 1", author: "Juan", likes: 5 },
  { title: "Blog 2", author: "Ana", likes: 8 },
  { title: "Blog 3", author: "Juan", likes: 3 },
  { title: "Blog 4", author: "Ana", likes: 12 }
]

// Iteración 1: likes = {}, blog = {author: "Juan", likes: 5}
// Resultado: {Juan: 5}

// Iteración 2: likes = {Juan: 5}, blog = {author: "Ana", likes: 8}
// Resultado: {Juan: 5, Ana: 8}

// Iteración 3: likes = {Juan: 5, Ana: 8}, blog = {author: "Juan", likes: 3}
// Resultado: {Juan: 8, Ana: 8}

// Iteración 4: likes = {Juan: 8, Ana: 8}, blog = {author: "Ana", likes: 12}
// Resultado: {Juan: 8, Ana: 20}
```

#### Segundo reduce (encontrar máximo):
```javascript
// Object.entries(authorLikes) = [["Juan", 8], ["Ana", 20]]

// Iteración 1: max = {author: '', likes: 0}, [author, totalLikes] = ["Juan", 8]
// Comparación: 8 > 0 → true
// Resultado: {author: "Juan", likes: 8}

// Iteración 2: max = {author: "Juan", likes: 8}, [author, totalLikes] = ["Ana", 20]
// Comparación: 20 > 8 → true
// Resultado: {author: "Ana", likes: 20}

// Resultado final: {author: "Ana", likes: 20}
```

---

## Resumen de patrones de `reduce()`

### 1. **Suma simple** (`totalLikes`):
```javascript
array.reduce((suma, elemento) => suma + elemento.propiedad, 0)
```

### 2. **Encontrar máximo** (`favoriteBlog`):
```javascript
array.reduce((max, actual) => actual.propiedad > max.propiedad ? actual : max)
```

### 3. **Contar elementos** (`mostBlogs`, `mostLikes`):
```javascript
array.reduce((contador, elemento) => {
  contador[elemento.clave] = (contador[elemento.clave] || 0) + 1
  return contador
}, {})
```

### 4. **Sumar por categorías** (`mostLikes`):
```javascript
array.reduce((sumas, elemento) => {
  sumas[elemento.categoria] = (sumas[elemento.categoria] || 0) + elemento.valor
  return sumas
}, {})
```

---

## Consejos para usar `reduce()`

1. **Siempre define un valor inicial** cuando sea apropiado
2. **Recuerda retornar el acumulador** en cada iteración
3. **Usa nombres descriptivos** para el acumulador y elemento actual
4. **Combina múltiples reduces** para operaciones complejas
5. **Considera la legibilidad** - a veces un `for` loop es más claro

¡El método `reduce()` es muy poderoso una vez que entiendes estos patrones básicos! 