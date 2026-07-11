---
title: "Case Study: Uber / Pathao — Deep Dive"
---

You open the Pathao/Uber app. Within 5 seconds the app shows you 10 nearby drivers. You tap "Find Driver" - a driver is assigned within 15 seconds. What's behind this magic? Real-time geospatial systems, ML-based matching, surge pricing - all combined, an engineering masterpiece.

## Requirements

### Functional

- Rider requests a ride → matched with a nearby driver.
- Real-time location tracking.
- Fare calculation + payment.
- Trip lifecycle (request, accept, en-route, complete).
- Surge pricing (high-demand).
- Rating system.

### Non-Functional

- Low latency matching (<5 sec).
- Real-time tracking (<5 sec updates).
- High availability.
- Geographic scale (650+ cities).
- Reliable payment.

## Capacity Estimation

```
DAU: 100M (riders + drivers)
Active drivers concurrent: 5M (peak)
Trips/day: 25M
Trips/sec (avg): 25M / 86400 ≈ 290/sec (peak much higher)

Driver location update: every 4 seconds
Updates/sec: 5M / 4 = 1.25M location updates/sec
```

## API Design

```
// Driver
POST /location { lat, lng, heading } -- every 4s
POST /accept-ride { rideId }

// Rider
POST /request-ride { pickup, destination, type }
GET /nearby-drivers?lat=&lng=&radius=
GET /ride/:id/status

// Real-time updates
WebSocket: ride state changes
```

## Data Model

```
User: { id, type (rider/driver), name, ... }
Driver: {
  id, status (online/offline/in-trip),
  current_location (lat, lng), vehicle, rating
}
Trip: {
  id, rider_id, driver_id,
  pickup, destination, status,
  fare, payment_status
}
LocationUpdate: { driver_id, lat, lng, ts } (time-series)
```

## Architecture

```
[Rider App] [Driver App]
  ↓ ↓ (WebSocket)
[API Gateway / Load Balancer]
  ↓
[Microservices]
  - Trip Service
  - Location Service
  - Matching Service
  - Pricing Service
  - Payment Service
  - Notification Service
  ↓
[Geospatial Index] (Google S2 cells)
[Event Stream] (Kafka)
[Storage]:
  - Schemaless (Uber custom - sharded MySQL)
  - Cassandra (location time-series)
  - Redis (active driver pool)
```

## Geospatial Indexing

"Available drivers within 5km" - needs a fast query.

### Google S2 Library

- Divides the Earth into hierarchical cells.
- Cell ID = a string (efficient indexing).
- Variable cell size - city-level vs neighborhood-level.
- Hilbert curve - preserves spatial locality.

### Driver Indexing

1. Driver location update → compute the S2 cell ID.
2. Redis hash: cell_id → set of driver_ids.
3. Rider's location → cell ID + neighboring cells.
4. Get all drivers in those cells.
5. Filter by exact distance + availability.

## Driver Matching Algorithm

Not just nearest - many factors:

- **Distance:** Euclidean → road distance.
- **ETA:** Real-time, traffic-aware.
- **Driver rating, acceptance rate.**
- **Vehicle type match.**
- **Anti-bias:** Driver-rider history.

An ML model ranks the candidates.

## Location Update Flow

1. Driver app sends a location update every 4 sec via WebSocket.
2. Location service receives it → computes the S2 cell.
3. Redis hash updated - old cell removed, new cell added.
4. Time-series write to Cassandra (history).
5. If in-trip → the rider is notified (real-time tracking).

## Trip Lifecycle (Saga Pattern)

1. **Request:** Rider requests, system finds candidates.
2. **Match:** Best driver notified - accept/decline.
3. **En-route to pickup:** Real-time tracking.
4. **Pickup:** Trip starts.
5. **In trip:** Live location, fare meter.
6. **Complete:** Fare calculated, payment triggered.
7. **Rating:** Both sides rate each other.

Each step is an event in Kafka - the Saga handles compensating actions.

## Surge Pricing

When demand is high but supply is low → fares increase.

### How

- Per area - pending request count, available driver count.
- Ratio crosses a threshold = surge multiplier.
- Visual heatmap on the map.
- Real-time stream processing.

### Goals

- Attract drivers (more income).
- Reduce rider demand (some willing to pay; some wait).
- Reach equilibrium.

## Payment

- Fare is calculated at the end of the trip.
- Saga: payment service charges (Stripe/local).
- Payment fails → retry; persistent failure → restrict the next ride.
- Driver settlement weekly.

## Real-time Tracking

- Rider app continuously shows driver location.
- WebSocket connection.
- Driver location updates broadcast to the active rider.
- Map renders smoothly.

## Microservices Architecture

Uber had 2200+ microservices (later consolidated some).

- Trip, Driver, Rider, Location, Pricing, Payment, Notification, Maps, Search, Analytics.
- gRPC for inter-service communication.
- Kafka for event streaming.
- Schemaless - Uber's custom MySQL-based DB.

## Ringpop - Distributed Coordination

Uber's open-source library for distributed applications:

- Consistent hashing.
- Membership protocol (SWIM).
- Request forwarding.
- Use case: the driver location service ring.

## Geographic Scale

- City-level deployment.
- Each city has its own driver pool, pricing zones.
- Multi-region for disaster recovery.
- Localized map data.

## Real World

- 100M+ users globally.
- 650+ cities.
- 25M+ trips/day at peak.
- Pathao, Foodpanda, Sohoz - the same architecture in Bangladesh.

## Trade-offs

- Real-time accuracy vs network/battery cost.
- Eventually consistent location vs immediate match.
- ML matching latency vs fairness.
- Surge pricing user satisfaction vs equilibrium.

## Engineering Lessons

1. Geospatial indexing is core to location services.
2. Saga pattern for multi-step business flows.
3. Real-time + reliability - a challenging combo.
4. Event-driven scales well.
5. Don't over-microservice (Uber over-corrected).

## Chapter Summary

- Uber = real-time geospatial matching at scale.
- Google S2 + Redis-based driver index.
- WebSocket for location updates + tracking.
- Saga pattern for the trip lifecycle.
- ML + surge pricing - balancing supply and demand.
