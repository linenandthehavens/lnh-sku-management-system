#LNH  SKU Management System - Architecture Overview

## Technology Stack

### Frontend
- **Framework**: React 18.2
- **Build Tool**: Vite 5.0
- **HTTP Client**: Axios 1.6
- **Styling**: Custom CSS with CSS Variables
- **Fonts**: 
  - Outfit (Headings) - Bold, modern display font
  - DM Sans (Body) - Clean, readable sans-serif

### Backend
- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Database**: H2 (In-Memory)
- **ORM**: Spring Data JPA / Hibernate
- **Build Tool**: Maven
- **Validation**: Bean Validation (Jakarta)

## API Architecture

### RESTful Design Principles
- Resource-based URLs
- HTTP methods for operations (GET, POST, PUT, DELETE)
- JSON for data exchange
- Proper HTTP status codes
- CORS enabled for cross-origin requests

### Endpoint Structure
```
/api/skus                    # Collection operations
/api/skus/{id}               # Single resource operations
/api/skus/search?term=...    # Search operation
/api/skus/category/{cat}     # Filter operation
```

## Data Flow

### Creating a New SKU
```
1. User fills form in SkuForm.jsx
   ↓
2. Form validation in React
   ↓
3. POST request via Axios to /api/skus
   ↓
4. SkuController receives request
   ↓
5. SkuServiceImpl validates business rules
   ↓
6. SkuRepository saves to database
   ↓
7. Response with created SKU (201 Created)
   ↓
8. Frontend updates state and refreshes table
```

### Searching SKUs
```
1. User types in search box
   ↓
2. onChange event triggers state update
   ↓
3. useEffect runs filterSkus() function
   ↓
4. Filter logic executed client-side
   ↓
5. Filtered results displayed in table
```

## Design Patterns Used

### Backend Patterns
1. **Layered Architecture**: Controller → Service → Repository
2. **Dependency Injection**: @Autowired for loose coupling
3. **Repository Pattern**: Data access abstraction
4. **DTO Pattern**: Implicit through Entity objects
5. **Exception Handling**: Centralized with @RestControllerAdvice

### Frontend Patterns
1. **Component-Based Architecture**: Reusable React components
2. **Unidirectional Data Flow**: Props down, events up
3. **Container/Presentational**: App.jsx (container), SkuTable/Form (presentational)
4. **Controlled Components**: Form inputs managed by React state

## Security Features

### Current Implementation
- Input validation (client and server)
- SQL injection prevention (JPA/Hibernate)
- Duplicate SKU code detection
- Error message sanitization

### Production Recommendations
- Add Spring Security for authentication
- Implement JWT tokens
- Add rate limiting
- Configure CORS for specific origins
- Use HTTPS
- Add input sanitization
- Implement audit logging

## Performance Considerations

### Optimizations Implemented
- In-memory database for fast access
- Lazy loading in JPA
- Client-side filtering for instant results
- CSS animations for smooth UX
- Efficient React rendering

### Future Improvements
- Add pagination for large datasets
- Implement caching (Redis)
- Database indexing on frequently queried fields
- Code splitting in React
- Server-side search for large datasets

## Database Schema

```sql
CREATE TABLE skus (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sku_code VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    quantity INTEGER NOT NULL,
    price DOUBLE NOT NULL,
    category VARCHAR(255) NOT NULL,
    supplier VARCHAR(255),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);
```

## Deployment Architecture

### Development
```
Frontend (Vite Dev Server) → Backend (Spring Boot)
    :3000                         :8080
         ↓                           ↓
    React App                   REST API
                                    ↓
                              H2 Database
```

### Production (Recommended)
```
                    Load Balancer
                         |
        ┌────────────────┼────────────────┐
        ↓                ↓                ↓
   Web Server 1    Web Server 2    Web Server 3
   (React Build)   (React Build)   (React Build)
        |                |                |
        └────────────────┼────────────────┘
                         ↓
                  API Gateway
                         |
        ┌────────────────┼────────────────┐
        ↓                ↓                ↓
   Backend 1        Backend 2        Backend 3
   (Spring Boot)    (Spring Boot)    (Spring Boot)
        |                |                |
        └────────────────┼────────────────┘
                         ↓
                Production Database
                (PostgreSQL/MySQL)
```

## Scalability Considerations

1. **Horizontal Scaling**: Stateless backend allows multiple instances
2. **Database Migration**: H2 → PostgreSQL/MySQL for production
3. **Caching Layer**: Add Redis for frequently accessed data
4. **CDN**: Serve static frontend assets via CDN
5. **Microservices**: Can split into inventory, orders, etc.

## Monitoring & Logging

### Implemented
- Spring Boot Actuator endpoints
- Console logging for development
- SQL query logging

### Recommended Additions
- ELK Stack (Elasticsearch, Logstash, Kibana)
- Application Performance Monitoring (APM)
- Error tracking (Sentry, Rollbar)
- Health checks and metrics

## Testing Strategy

### Backend Testing (Recommended)
- Unit tests for services
- Integration tests for repositories
- API tests for controllers
- Test coverage > 80%

### Frontend Testing (Recommended)
- Component tests (React Testing Library)
- Integration tests
- E2E tests (Cypress, Playwright)

---

This architecture provides a solid foundation for an enterprise-grade SKU management system with clear separation of concerns, scalability, and maintainability.
