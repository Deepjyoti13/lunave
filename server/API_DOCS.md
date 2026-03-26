# LUNAVE Backend — API Reference

Base URL: `http://localhost:5000/api`

All protected routes require:
```
Authorization: Bearer <your_jwt_token>
```

---

## AUTH  `/api/auth`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/register` | Public | Register new customer |
| POST | `/login` | Public | Login, returns JWT |
| GET | `/me` | Protected | Get my profile |
| PUT | `/me` | Protected | Update name/phone/addresses |
| PUT | `/change-password` | Protected | Change password |

### POST `/auth/register`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Secret123"
}
```
Response:
```json
{
  "success": true,
  "token": "eyJhbGci...",
  "user": { "_id": "...", "name": "John Doe", "email": "...", "role": "customer" }
}
```

### POST `/auth/login`
```json
{ "email": "admin@lunave.com", "password": "Admin@1234" }
```

---

## PRODUCTS  `/api/products`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Public | List all products (with filters) |
| GET | `/featured` | Public | Featured products (for homepage) |
| GET | `/bestsellers` | Public | Best-seller products |
| GET | `/:id` | Public | Single product by ID or slug |
| POST | `/` | Admin | Create product + upload images |
| PUT | `/:id` | Admin | Update product + add more images |
| DELETE | `/:id` | Admin | Delete product + its images |
| DELETE | `/:id/images/:filename` | Admin | Remove a single image |
| POST | `/:id/reviews` | Protected | Add review |
| DELETE | `/:id/reviews/:reviewId` | Protected/Admin | Delete review |
| GET | `/admin/all` | Admin | All products (incl. inactive) |

### GET `/products` — Query Parameters
```
?category=Designer Delights
?gender=Women
?scentFamily=Floral
?isFeatured=true
?isBestSeller=true
?isNewArrival=true
?minPrice=100&maxPrice=300
?search=elixir
?sort=-basePrice        (prefix - for descending)
?page=1&limit=12
```

### POST `/products` — multipart/form-data (Admin)
```
Field: images        (files — up to 6 JPG/PNG/WebP, max 5MB each)
Field: name          "Luxurious Elixir"
Field: basePrice     250
Field: category      "Designer Delights"
Field: gender        "Women"
Field: concentration "Eau de Parfum"
Field: stock         50
Field: shortDescription  "A floral masterpiece..."
Field: description       "Full rich text..."
Field: storyTitle        "The Golden Overture"
Field: storyContent      "Opens with citrus..."
Field: heartTitle        "The Heart of Elegance"
Field: heartContent      "Pure refinement..."
Field: scentFamily   "Floral"
Field: isFeatured    true
Field: isBestSeller  false
Field: isNewArrival  true

# JSON strings for nested fields:
Field: scentNotes    {"top":"Peach","heart":"Jasmine","base":"Musk"}
Field: volumeOptions [{"size":100,"price":250,"stock":30},{"size":150,"price":320,"stock":20}]
Field: occasion      ["Evening","Wedding"]
```

Response:
```json
{
  "success": true,
  "product": {
    "_id": "664abc...",
    "name": "Luxurious Elixir",
    "slug": "luxurious-elixir",
    "images": [
      { "url": "/uploads/luxurious-elixir-1716300000000-123456.jpg", "isPrimary": true }
    ],
    "basePrice": 250,
    ...
  }
}
```

**How to use the image URL on the frontend:**
```js
const imageUrl = `http://localhost:5000${product.images[0].url}`
// → http://localhost:5000/uploads/luxurious-elixir-1716300000000-123456.jpg
```

### POST `/:id/reviews`
```json
{ "rating": 5, "comment": "Absolutely love this fragrance!" }
```

---

## CART  `/api/cart`  *(all protected)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get my cart |
| POST | `/` | Add item to cart |
| PUT | `/:itemId` | Update item quantity |
| DELETE | `/:itemId` | Remove one item |
| DELETE | `/` | Clear entire cart |

### POST `/cart` — Add Item
```json
{
  "productId": "664abc123...",
  "quantity": 2,
  "volume": 100
}
```

Response includes virtual fields:
```json
{
  "success": true,
  "cart": {
    "_id": "...",
    "items": [...],
    "totalItems": 3,
    "subtotal": 690.00
  }
}
```

### PUT `/cart/:itemId` — Update Quantity
```json
{ "quantity": 3 }
```

---

## ORDERS  `/api/orders`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/` | Protected | Place order from cart |
| GET | `/my` | Protected | My order history |
| GET | `/:id` | Protected | Single order detail |
| PUT | `/:id/cancel` | Protected | Cancel order |
| GET | `/admin/all` | Admin | All orders |
| GET | `/admin/stats` | Admin | Dashboard stats |
| PUT | `/admin/:id/status` | Admin | Update order status |
| PUT | `/admin/:id/payment` | Admin | Mark as paid |
| DELETE | `/admin/:id` | Admin | Delete order |

### POST `/orders` — Place Order
```json
{
  "paymentMethod": "COD",
  "shippingAddress": {
    "fullName": "John Doe",
    "phone": "9876543210",
    "line1": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "country": "India",
    "pincode": "400001"
  }
}
```

### PUT `/orders/admin/:id/status` (Admin)
```json
{
  "status": "Shipped",
  "trackingId": "DHL123456789",
  "note": "Dispatched from Mumbai warehouse"
}
```
Valid statuses: `Placed` → `Confirmed` → `Processing` → `Shipped` → `Delivered`
Also: `Cancelled`, `Returned`

### GET `/orders/admin/stats` Response
```json
{
  "success": true,
  "stats": {
    "totalOrders": 142,
    "totalRevenue": 38450.00,
    "pendingOrders": 12,
    "totalProducts": 24
  }
}
```

---

## Image serving

Uploaded images are served as static files:
```
GET http://localhost:5000/uploads/<filename>
```

On **production**, replace `localhost:5000` with your live domain.

---

## Error Response Format (all errors)
```json
{
  "success": false,
  "message": "Human-readable error description"
}
```

Common HTTP codes:
| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad request / validation error |
| 401 | Not authenticated |
| 403 | Forbidden (not admin) |
| 404 | Not found |
| 500 | Server error |
