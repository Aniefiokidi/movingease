# 05 — Pricing Engine

Pricing runs on **both the server and the client**:

- **Server** (`server/services/pricing.service.js`): authoritative calculation using live DB config. Called when a booking is created.
- **Client** (`client/src/utils/pricingEngine.js`): instant live preview using hardcoded defaults. Called as the user fills out the quote form.

---

## Formula

```
Total = basePrice
      + (distanceKm × distanceRatePerKm)
      + (workersCount × laborRatePerWorker)
      + truckRates[truckType]
      + urgencyRates[urgency]
      + accessibilitySurcharge
      + fragileSurcharge
      − discountAmount

Rounded to nearest $5 (500 cents)
```

---

## Default Rates (from PricingConfig)

All values stored in **cents (CAD)**.

| Component | Variable | Default | = CAD |
|-----------|----------|---------|-------|
| Base fee | `basePrice` | 15,000 | $150.00 |
| Per km | `distanceRatePerKm` | 250 | $2.50/km |
| Per worker | `laborRatePerWorker` | 5,000 | $50.00/worker |
| Van | `truckRates.van` | 7,500 | $75.00 |
| Medium truck | `truckRates.medium` | 12,500 | $125.00 |
| Large truck | `truckRates.large` | 20,000 | $200.00 |
| Standard urgency | `urgencyRates.standard` | 0 | $0.00 |
| Same-day | `urgencyRates.same_day` | 10,000 | $100.00 |
| Express | `urgencyRates.express` | 20,000 | $200.00 |
| Per floor above ground | `floorSurchargePerFloor` | 2,500 | $25.00 |
| No elevator | `noElevatorSurcharge` | 5,000 | $50.00 |
| Narrow stairs | `narrowStairsSurcharge` | 4,000 | $40.00 |
| Far parking | `farParkingSurcharge` | 3,000 | $30.00 |
| Fragile items | `fragileSurcharge` | 7,500 | $75.00 |

---

## Accessibility Surcharge Breakdown

Applies to both pickup and dropoff locations:

```js
floorFees = max(pickup.floor - 1, 0) + max(dropoff.floor - 1, 0)

accessibilitySurcharge =
    floorFees × floorSurchargePerFloor
  + (pickup.hasElevator === false OR dropoff.hasElevator === false) ? noElevatorSurcharge : 0
  + (pickup.hasNarrowStairs OR dropoff.hasNarrowStairs) ? narrowStairsSurcharge : 0
  + (pickup.parkingDistance === "far" OR dropoff.parkingDistance === "far") ? farParkingSurcharge : 0
```

**Note:** Floor surcharge only applies for floors above ground floor (floor 1). Ground floor (floor 1 or 0) = no surcharge. Floor 2 = 1 × $25. Floor 3 = 2 × $25, etc.

---

## Rounding

```js
const roundToNearestFive = (cents) => Math.round(cents / 500) * 500;
```

Final total is always a multiple of $5.00.

---

## Example Calculation

Scenario: 2-bedroom residential move, 180 km, 2 workers, medium truck, 3rd floor pickup (no elevator), standard urgency, no fragile items.

```
basePrice:               15,000   = $150.00
distanceCost: 180 × 250  45,000   = $450.00
laborCost:    2 × 5000   10,000   = $100.00
truckCost:    medium     12,500   = $125.00
urgencyCost:  standard        0   =   $0.00
accessibilitySurcharge:
  floorFees: (3-1)=2 × 2500  5,000  = $50.00
  noElevator:            5,000  = $50.00
fragileSurcharge:             0   =   $0.00
discountAmount:               0

subtotal: 92,500
rounded to nearest 500: 92,500 = $925.00
```

---

## Admin Price Override

Admins can manually change `pricing.finalPrice` via PATCH `/admin/bookings/:id` by passing:
```json
{
  "pricing": { "finalPrice": 85000 },
  "overrideReason": "Loyalty discount applied"
}
```
The override reason is recorded in `statusHistory`.

---

## Client-Side Live Preview

The `usePrice(data)` hook (in `hooks/usePrice.js`) calls `calculateLivePrice(data)` from `utils/pricingEngine.js` on every render using `useMemo`. It uses **hardcoded defaults** (not fetched from API), so the live preview may differ slightly from the server calculation if an admin has changed pricing config.

Returns: `{ totalEstimate: number, display: "CAD $925.00" }`

---

## Admin Can Change Pricing

Via the Admin Pricing page (`/admin/pricing`) or directly via PATCH `/admin/pricing`.  
Changes are persisted in the `PricingConfig` collection.  
All future bookings will use the new rates.  
Existing bookings are **not retroactively recalculated** — their `pricing` sub-document is frozen at booking time.
