# ShahdCoop — Interactive Component Architecture

**Author:** Frontend Architect
**Date:** February 2026
**Stack:** Next.js 15 · React 19 · TypeScript · Zustand · TanStack Query · Zod · React Hook Form

---

## Architecture Principles

Before diving into individual components, these are the shared patterns every interactive component in ShahdCoop follows:

**State Ownership:** Server state lives in TanStack Query. Client state lives in Zustand (global) or `useState`/`useReducer` (local). URL state lives in `nuqs`. No duplication — single source of truth per data domain.

**Validation:** Zod schemas are defined once in `/lib/validations/` and shared between React Hook Form (client) and Route Handler (server). Never validate in two places with two schemas.

**Error Boundary Strategy:** Each major feature wraps in its own `<ErrorBoundary>` with a contextual fallback. API errors are typed as a discriminated union (`ApiError`), never raw strings.

**Optimistic Updates:** Cart and wishlist mutations use TanStack Query's `onMutate` → `onError` rollback pattern. Checkout and auth never use optimistic updates (financial/security-critical).

---

## 1. Multi-Step Checkout Form

### 1.1 State Machine

```
                            ┌─────────────────────────────────┐
                            │           CART_REVIEW            │
                            │  Entry: validate cart not empty  │
                            │  Guard: items.length > 0         │
                            └───────────────┬─────────────────┘
                                            │ CONTINUE
                                            ▼
                         ┌──── NOT LOGGED IN ────┐
                         ▼                       │
                ┌─────────────────┐              │
                │  AUTH_GATE      │              │
                │  Login/Register │              │
                │  or Guest       │──── AUTHENTICATED ──┐
                └─────────────────┘                     │
                                                        ▼
                            ┌─────────────────────────────────┐
                            │          SHIPPING                │
                            │  • Select saved address          │
                            │  • OR fill new address form      │
                            │  • Validate with Zod             │
                            │  Guard: address valid             │
                            └───────────────┬─────────────────┘
                                            │ CONTINUE
                                            ▼
                            ┌─────────────────────────────────┐
                            │          PAYMENT                 │
                            │  • Stripe Payment Element loads  │
                            │  • OR select Cash on Delivery    │
                            │  • Create PaymentIntent / Order  │
                            │  Guard: payment method selected   │
                            └───────────────┬─────────────────┘
                                            │ PLACE_ORDER
                                            ▼
                            ┌─────────────────────────────────┐
                            │         PROCESSING               │
                            │  • Show spinner                  │
                            │  • Await Stripe confirmation     │
                            │  • OR await COD order creation   │
                            │  • No back button                │
                            └──────┬───────────────┬──────────┘
                                   │               │
                              SUCCESS          FAILURE
                                   │               │
                                   ▼               ▼
                       ┌────────────────┐  ┌──────────────────┐
                       │  CONFIRMATION  │  │  PAYMENT_ERROR   │
                       │  Order number  │  │  Retry or change │
                       │  Email sent    │  │  payment method  │
                       │  Clear cart    │  │  Back to PAYMENT │
                       └────────────────┘  └──────────────────┘
```

**Allowed Transitions:**

| From | Event | To | Guard |
|------|-------|----|-------|
| CART_REVIEW | CONTINUE | SHIPPING (or AUTH_GATE) | `cart.items.length > 0` |
| AUTH_GATE | AUTHENTICATED | SHIPPING | `session !== null` |
| AUTH_GATE | GUEST_CHECKOUT | SHIPPING | `guestEmail is valid` |
| SHIPPING | CONTINUE | PAYMENT | `shippingAddress passes Zod` |
| SHIPPING | BACK | CART_REVIEW | always |
| PAYMENT | PLACE_ORDER | PROCESSING | `paymentMethod selected` |
| PAYMENT | BACK | SHIPPING | always |
| PROCESSING | SUCCESS | CONFIRMATION | `order.id exists` |
| PROCESSING | FAILURE | PAYMENT_ERROR | `error !== null` |
| PAYMENT_ERROR | RETRY | PAYMENT | always |
| CONFIRMATION | — | (terminal) | — |

### 1.2 Data Flow

```
┌──────────────────────────────────────────────────────────────────┐
│  CheckoutPage (Server Component)                                 │
│  • Fetches: session, cart (RSC), saved addresses                 │
│  • Passes initial data as props to client boundary               │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  CheckoutFlow (Client Component — useReducer state machine)│  │
│  │                                                            │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐ │  │
│  │  │ CartReview    │  │ ShippingStep │  │ PaymentStep     │ │  │
│  │  │              │  │              │  │                 │ │  │
│  │  │ Props:       │  │ Props:       │  │ Props:          │ │  │
│  │  │ • cartItems  │  │ • addresses  │  │ • clientSecret  │ │  │
│  │  │ • totals     │  │ • onSubmit() │  │ • orderTotal    │ │  │
│  │  │ • onContinue │  │ • onBack()   │  │ • onConfirm()   │ │  │
│  │  └──────────────┘  └──────────────┘  └─────────────────┘ │  │
│  │                                                            │  │
│  │  ┌──────────────┐  ┌────────────────────────────────────┐ │  │
│  │  │ OrderSummary │  │ CheckoutStepper (step indicator)   │ │  │
│  │  │ (sidebar)    │  │ Reads step from reducer state      │ │  │
│  │  └──────────────┘  └────────────────────────────────────┘ │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘

API Calls (per step):
  SHIPPING  → POST /api/checkout/calculate  (totals + shipping cost)
  PAYMENT   → POST /api/checkout/session    (create Stripe PaymentIntent)
  PROCESSING → POST /api/webhooks/stripe     (Stripe confirms via webhook)
           OR → POST /api/checkout/cod       (COD order creation)
```

### 1.3 React Component Structure

```typescript
// ─── Types ───────────────────────────────────────────────────────

type CheckoutStep =
  | "cart_review"
  | "auth_gate"
  | "shipping"
  | "payment"
  | "processing"
  | "confirmation"
  | "payment_error";

type CheckoutEvent =
  | { type: "CONTINUE" }
  | { type: "BACK" }
  | { type: "AUTHENTICATED" }
  | { type: "GUEST_CHECKOUT"; email: string }
  | { type: "PLACE_ORDER" }
  | { type: "SUCCESS"; orderId: string; orderNumber: string }
  | { type: "FAILURE"; error: ApiError }
  | { type: "RETRY" };

interface CheckoutState {
  step: CheckoutStep;
  shippingAddress: ShippingAddress | null;
  paymentMethod: "stripe" | "cod" | null;
  guestEmail: string | null;
  stripeClientSecret: string | null;
  orderId: string | null;
  orderNumber: string | null;
  error: ApiError | null;
  totals: OrderTotals | null;
}

// ─── Reducer (State Machine) ─────────────────────────────────────

function checkoutReducer(
  state: CheckoutState,
  event: CheckoutEvent
): CheckoutState {
  switch (state.step) {
    case "cart_review":
      if (event.type === "CONTINUE") {
        // Guard: checked upstream that cart is non-empty
        return { ...state, step: "shipping" };
      }
      break;

    case "shipping":
      if (event.type === "CONTINUE") {
        return { ...state, step: "payment" };
      }
      if (event.type === "BACK") {
        return { ...state, step: "cart_review" };
      }
      break;

    case "payment":
      if (event.type === "PLACE_ORDER") {
        return { ...state, step: "processing", error: null };
      }
      if (event.type === "BACK") {
        return { ...state, step: "shipping" };
      }
      break;

    case "processing":
      if (event.type === "SUCCESS") {
        return {
          ...state,
          step: "confirmation",
          orderId: event.orderId,
          orderNumber: event.orderNumber,
        };
      }
      if (event.type === "FAILURE") {
        return { ...state, step: "payment_error", error: event.error };
      }
      break;

    case "payment_error":
      if (event.type === "RETRY") {
        return { ...state, step: "payment", error: null };
      }
      break;
  }
  return state; // Invalid transition — no-op
}

// ─── Main Component ──────────────────────────────────────────────

function CheckoutFlow({
  initialCart,
  session,
  savedAddresses,
}: CheckoutFlowProps) {
  const [state, dispatch] = useReducer(checkoutReducer, {
    step: initialCart.items.length === 0 ? "cart_review" : "shipping",
    shippingAddress: null,
    paymentMethod: null,
    guestEmail: null,
    stripeClientSecret: null,
    orderId: null,
    orderNumber: null,
    error: null,
    totals: null,
  });

  // Re-calculate totals when shipping address or coupon changes
  const { data: totals, isLoading: totalsLoading } = useQuery({
    queryKey: ["checkout-totals", state.shippingAddress, cart.couponCode],
    queryFn: () => calculateTotals(cart, state.shippingAddress),
    enabled: state.step === "shipping" || state.step === "payment",
  });

  // Create Stripe PaymentIntent when entering payment step
  const createSession = useMutation({
    mutationFn: createStripeSession,
    onSuccess: (data) => {
      dispatch({ type: "CONTINUE" }); // move to payment step internally
      // stripeClientSecret stored via setState, not in reducer
    },
  });

  // Place order (COD or after Stripe confirmation)
  const placeOrder = useMutation({
    mutationFn: submitOrder,
    onSuccess: (order) => {
      dispatch({
        type: "SUCCESS",
        orderId: order.id,
        orderNumber: order.orderNumber,
      });
      clearCart(); // Zustand cart store
    },
    onError: (error) => {
      dispatch({ type: "FAILURE", error: toApiError(error) });
    },
  });

  return (
    <>
      <CheckoutStepper currentStep={state.step} />

      <div className="checkout-layout">
        <div className="checkout-main">
          {state.step === "cart_review" && (
            <CartReview
              items={initialCart.items}
              onContinue={() => dispatch({ type: "CONTINUE" })}
            />
          )}

          {state.step === "shipping" && (
            <ShippingStep
              savedAddresses={savedAddresses}
              onSubmit={(address) => {
                dispatch({ type: "CONTINUE" });
                // address stored in parent state, not reducer
              }}
              onBack={() => dispatch({ type: "BACK" })}
            />
          )}

          {state.step === "payment" && (
            <PaymentStep
              totals={totals}
              clientSecret={state.stripeClientSecret}
              onPlaceOrder={(method) => {
                dispatch({ type: "PLACE_ORDER" });
                placeOrder.mutate({ method, address: state.shippingAddress });
              }}
              onBack={() => dispatch({ type: "BACK" })}
            />
          )}

          {state.step === "processing" && <ProcessingSpinner />}

          {state.step === "confirmation" && (
            <OrderConfirmation
              orderNumber={state.orderNumber!}
              orderId={state.orderId!}
            />
          )}

          {state.step === "payment_error" && (
            <PaymentError
              error={state.error!}
              onRetry={() => dispatch({ type: "RETRY" })}
            />
          )}
        </div>

        {state.step !== "confirmation" && state.step !== "processing" && (
          <OrderSummary
            items={initialCart.items}
            totals={totals}
            loading={totalsLoading}
          />
        )}
      </div>
    </>
  );
}
```

### 1.4 Error Handling

| Error Source | Handler | User Experience |
|-------------|---------|-----------------|
| Cart empty on load | Guard in reducer | Redirect to `/cart` with toast: "Your cart is empty" |
| Shipping validation fail | Zod `safeParse` in `ShippingStep` | Inline field errors, scroll to first error |
| Calculate totals API fail | TanStack Query `onError` | Retry button + "Couldn't calculate shipping" inline |
| Stripe PaymentIntent creation fail | `createSession.onError` | Toast + stay on payment step |
| Stripe payment declined | Stripe Element `onError` callback | Inline error below Stripe Element: "Card declined" |
| COD order creation fail | `placeOrder.onError` | `PAYMENT_ERROR` step with full error + retry |
| Network timeout during processing | `placeOrder.onError` with timeout check | "Connection lost. Your order may have been placed. Check your email or contact support." — never auto-retry payments |
| Webhook mismatch (race condition) | Polling `/api/orders/[id]/status` | If order exists, redirect to confirmation. If not after 30s, show "Processing — we'll email you." |

### 1.5 Loading & Empty States

| State | Component | Behavior |
|-------|-----------|----------|
| Totals calculating | `OrderSummary` | Skeleton lines for subtotal, shipping, total. Disable "Continue" button. |
| Stripe Element loading | `PaymentStep` | Skeleton rectangle (200×40px) where Stripe Element will mount. "Loading secure payment..." |
| Order submitting | `ProcessingSpinner` | Full-step takeover. Animated spinner + "Processing your order..." No back button. Disable browser back via `beforeunload`. |
| Empty cart | `CartReview` | `EmptyState` illustration + "Your cart is empty" + "Continue Shopping" CTA |
| No saved addresses | `ShippingStep` | Skip address selector, show form directly with "Add your shipping address" heading |

### 1.6 Edge Cases

| Edge Case | Solution |
|-----------|----------|
| User modifies cart in another tab during checkout | `onFocus` event triggers cart refetch. If items changed, show toast + recalculate totals. If item now out of stock, force back to `CART_REVIEW` with error. |
| Stripe 3D Secure popup closes without completing | Stripe Element fires `onError` → stay on payment step, show "Payment requires additional authentication" |
| User hits browser back on confirmation page | `replaceState` on confirmation to prevent re-submit. Back goes to homepage. |
| Coupon expires between cart and checkout | `/api/checkout/calculate` returns `couponInvalid: true` → remove coupon, recalculate, show toast |
| Stock depleted during checkout | `/api/checkout/session` checks stock atomically before creating order. Returns `409 Conflict` with `outOfStockItems[]` → show which items need updating |
| Duplicate order prevention | `placeOrder` mutation uses `mutationKey` + disabled button during `isPending`. Server uses idempotency key (Stripe PaymentIntent ID or generated UUID). |

---

## 2. Dynamic Pricing Calculator

### 2.1 State Machine

```
  ┌──────────────────────────────────────────────────────────┐
  │                      IDLE                                │
  │  Cart has items. Totals displayed from last calculation.  │
  └────────────────────────┬─────────────────────────────────┘
                           │ quantity_change | coupon_apply |
                           │ coupon_remove | address_change
                           ▼
  ┌──────────────────────────────────────────────────────────┐
  │                    DEBOUNCING                            │
  │  300ms debounce timer running. UI shows stale totals     │
  │  with a subtle opacity pulse on the total line.          │
  └────────────────────────┬─────────────────────────────────┘
                           │ debounce_complete
                           ▼
  ┌──────────────────────────────────────────────────────────┐
  │                   CALCULATING                            │
  │  POST /api/checkout/calculate in flight.                 │
  │  Skeleton on total. "Updating..." text.                  │
  └────────┬───────────────────────────────────┬─────────────┘
           │ success                           │ error
           ▼                                   ▼
  ┌──────────────────┐              ┌─────────────────────┐
  │  IDLE            │              │  CALCULATION_ERROR   │
  │  New totals      │              │  Show last known     │
  │  displayed       │              │  totals + error msg  │
  └──────────────────┘              │  Retry button        │
                                    └─────────────────────┘
```

### 2.2 Pricing Logic (Client-Side Preview + Server Authoritative)

```
Client-side preview (instant, approximate):
  subtotal     = Σ(item.unitPrice × item.quantity)
  discount     = coupon.type === "percentage"
                   ? subtotal × (coupon.value / 100)
                   : coupon.value
  discount     = min(discount, coupon.maxDiscountAmount ?? Infinity)
  shippingEst  = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_RATE
  taxEst       = 0  (Morocco: no VAT on honey/agricultural)
  totalPreview = subtotal - discount + shippingEst + taxEst

Server-side authoritative (POST /api/checkout/calculate):
  • Re-fetches live prices from DB (prevents stale-price exploits)
  • Validates coupon eligibility (expired? per-user limit? min order?)
  • Calculates weight-based shipping from address region
  • Applies category-specific tax rules
  • Returns final totals + line-item breakdown
```

### 2.3 React Component Structure

```typescript
// ─── Types ───────────────────────────────────────────────────────

interface PricingState {
  items: CartItem[];
  couponCode: string | null;
  couponDetails: Coupon | null;
  shippingAddress: ShippingAddress | null;
  totals: OrderTotals;
  status: "idle" | "debouncing" | "calculating" | "error";
  error: string | null;
}

interface OrderTotals {
  subtotal: number;       // centimes
  shippingCost: number;
  discountAmount: number;
  tax: number;
  total: number;
  freeShippingEligible: boolean;
  freeShippingRemaining: number; // how much more to qualify
  couponApplied: boolean;
  couponError: string | null;
  lineItems: LineItemTotal[]; // per-item breakdown
}

// ─── Hook: usePricingCalculator ──────────────────────────────────

function usePricingCalculator(items: CartItem[]) {
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [shippingAddress, setShippingAddress] =
    useState<ShippingAddress | null>(null);

  // Client-side instant preview
  const previewTotals = useMemo(
    () => calculatePreviewTotals(items, couponCode),
    [items, couponCode]
  );

  // Server-side authoritative calculation (debounced)
  const {
    data: serverTotals,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["pricing", items, couponCode, shippingAddress],
    queryFn: () =>
      fetch("/api/checkout/calculate", {
        method: "POST",
        body: JSON.stringify({ items, couponCode, shippingAddress }),
      }).then(handleApiResponse<OrderTotals>),
    enabled: items.length > 0,
    staleTime: 0, // always re-calculate
    // Debounce is handled by the queryKey changing — TanStack Query
    // deduplicates rapid changes automatically. We add manual debounce
    // for quantity changes via the cart store.
  });

  // Apply coupon mutation
  const applyCoupon = useMutation({
    mutationFn: (code: string) =>
      fetch("/api/cart/coupon", {
        method: "POST",
        body: JSON.stringify({ code }),
      }).then(handleApiResponse<{ coupon: Coupon }>),
    onSuccess: (data) => {
      setCouponCode(data.coupon.code);
      toast.success(`Coupon "${data.coupon.code}" applied!`);
    },
    onError: (err: ApiError) => {
      if (err.code === "COUPON_EXPIRED") toast.error("This coupon has expired.");
      else if (err.code === "COUPON_MIN_ORDER")
        toast.error(`Minimum order: ${formatPrice(err.meta.minAmount)}`);
      else if (err.code === "COUPON_ALREADY_USED")
        toast.error("You've already used this coupon.");
      else toast.error("Invalid coupon code.");
    },
  });

  const removeCoupon = useMutation({
    mutationFn: () => fetch("/api/cart/coupon", { method: "DELETE" }),
    onSuccess: () => {
      setCouponCode(null);
      toast.success("Coupon removed.");
    },
  });

  // Use server totals when available, fall back to preview
  const totals: OrderTotals = serverTotals ?? previewTotals;
  const status = isLoading
    ? "calculating"
    : isError
      ? "error"
      : "idle";

  return {
    totals,
    status,
    error,
    couponCode,
    applyCoupon,
    removeCoupon,
    setShippingAddress,
    refetch,
  };
}

// ─── Component: OrderSummary ─────────────────────────────────────

function OrderSummary({
  items,
  totals,
  status,
  couponCode,
  onApplyCoupon,
  onRemoveCoupon,
}: OrderSummaryProps) {
  return (
    <aside className="order-summary" aria-live="polite">
      {/* Collapsible item list */}
      <Collapsible>
        <CollapsibleTrigger>
          {items.length} items · {formatPrice(totals.subtotal)}
        </CollapsibleTrigger>
        <CollapsibleContent>
          {items.map((item) => (
            <SummaryLineItem key={item.productId} item={item} />
          ))}
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      {/* Totals breakdown */}
      <div className="totals-grid">
        <TotalRow label="Subtotal" value={totals.subtotal} />
        <TotalRow
          label="Shipping"
          value={totals.shippingCost}
          loading={status === "calculating"}
          badge={
            totals.freeShippingEligible
              ? "Free"
              : `${formatPrice(totals.freeShippingRemaining)} more for free`
          }
        />
        {totals.discountAmount > 0 && (
          <TotalRow
            label={`Discount (${couponCode})`}
            value={-totals.discountAmount}
            variant="success"
          />
        )}
        {totals.tax > 0 && (
          <TotalRow label="Tax" value={totals.tax} />
        )}
      </div>

      <Separator />

      <TotalRow
        label="Total"
        value={totals.total}
        variant="bold"
        loading={status === "calculating"}
      />

      {/* Coupon input */}
      <CouponInput
        applied={couponCode}
        onApply={onApplyCoupon}
        onRemove={onRemoveCoupon}
      />

      {status === "error" && (
        <ErrorBanner message="Couldn't update pricing" onRetry={refetch} />
      )}
    </aside>
  );
}
```

### 2.4 Edge Cases

| Edge Case | Solution |
|-----------|----------|
| Price changed between add-to-cart and checkout | Server recalculates from live DB prices. If price increased > 10%, show a diff: "Price updated: ~~180 MAD~~ → 195 MAD" with option to remove. |
| Coupon makes total negative | Server clamps `total = max(0, subtotal - discount) + shipping`. Excess discount is silently capped. |
| Free shipping threshold exactly met, then quantity reduced | Recalculate immediately. If now below threshold, shipping cost appears with animation (slide down). Show "Add X MAD more for free shipping" motivator. |
| Currency formatting for MAD | Always `Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' })`. Server and client must match. |
| Floating point errors with centimes | All prices stored and calculated as integers (centimes). Division to MAD only at display layer: `(amount / 100).toFixed(2)`. |
| Multiple rapid quantity changes | Zustand cart store debounces quantity updates by 300ms before syncing to server. Local state updates instantly for responsive feel. |

---

## 3. Search with Filters

### 3.1 State Machine

```
  ┌──────────────────────────────────────────────────────────┐
  │                     IDLE                                 │
  │  Products displayed. Filters reflected in URL.           │
  └──────────────┬────────────────────────────┬──────────────┘
                 │ filter_change |            │ query_change
                 │ sort_change |              │ (search input)
                 │ page_change               │
                 ▼                            ▼
  ┌──────────────────────┐     ┌──────────────────────────────┐
  │  URL_UPDATING        │     │  DEBOUNCING                  │
  │  nuqs updates URL    │     │  300ms debounce on search    │
  │  params instantly     │     │  input before URL update     │
  │  (no debounce needed  │     └──────────────┬───────────────┘
  │   for clicks)         │                    │ debounce_complete
  └──────────┬────────────┘                    │
             │                                 │
             ▼                                 ▼
  ┌──────────────────────────────────────────────────────────┐
  │                   FETCHING                               │
  │  TanStack Query fetches /api/products with URL params.   │
  │  Previous results remain visible (stale-while-revalidate)│
  │  Subtle loading indicator (progress bar or skeleton).    │
  └────────┬──────────────────────────────────┬──────────────┘
           │ success                          │ error
           ▼                                  ▼
  ┌──────────────────┐             ┌─────────────────────────┐
  │  IDLE            │             │  FETCH_ERROR             │
  │  Results updated │             │  Show stale results      │
  │  URL is source   │             │  + error banner + retry  │
  │  of truth        │             └─────────────────────────┘
  └──────────────────┘

  Special states:
  ┌──────────────────────────────────────────────────────────┐
  │  EMPTY_RESULTS: products.length === 0 after fetch.       │
  │  Show EmptyState + "Clear filters" or "Try a different   │
  │  search term" CTA.                                       │
  └──────────────────────────────────────────────────────────┘
```

### 3.2 URL as Single Source of Truth

All filter, sort, search, and pagination state lives in URL search params via `nuqs`. This means every product listing state is shareable, bookmarkable, and back-button-friendly.

```
/products?q=sidr&category=honey&minPrice=50&maxPrice=300&rating=4&inStock=true&sort=price_asc&page=2

Parameter map:
  q          → search query (text)
  category   → category slug (string, multi via comma)
  minPrice   → minimum price in MAD (number)
  maxPrice   → maximum price in MAD (number)
  rating     → minimum rating (number 1-5)
  inStock    → only in-stock items (boolean)
  sort       → sort key (enum: relevance, price_asc, price_desc,
                          newest, rating, bestselling)
  page       → page number (number, 1-indexed)
```

### 3.3 React Component Structure

```typescript
// ─── URL State Hook (nuqs) ───────────────────────────────────────

function useProductFilters() {
  const [q, setQ] = useQueryState("q", parseAsString.withDefault(""));
  const [category, setCategory] = useQueryState(
    "category",
    parseAsArrayOf(parseAsString).withDefault([])
  );
  const [minPrice, setMinPrice] = useQueryState(
    "minPrice",
    parseAsInteger.withDefault(0)
  );
  const [maxPrice, setMaxPrice] = useQueryState(
    "maxPrice",
    parseAsInteger.withDefault(10000)
  );
  const [rating, setRating] = useQueryState(
    "rating",
    parseAsInteger.withDefault(0)
  );
  const [inStock, setInStock] = useQueryState(
    "inStock",
    parseAsBoolean.withDefault(false)
  );
  const [sort, setSort] = useQueryState(
    "sort",
    parseAsStringLiteral([
      "relevance", "price_asc", "price_desc",
      "newest", "rating", "bestselling",
    ] as const).withDefault("relevance")
  );
  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1)
  );

  // Reset page to 1 when any filter changes
  const setFilterAndResetPage = useCallback(
    (setter: Function, value: any) => {
      setter(value);
      setPage(1);
    },
    [setPage]
  );

  const clearAllFilters = useCallback(() => {
    setQ("");
    setCategory([]);
    setMinPrice(0);
    setMaxPrice(10000);
    setRating(0);
    setInStock(false);
    setSort("relevance");
    setPage(1);
  }, [/* all setters */]);

  const activeFilterCount = [
    q, category.length > 0, minPrice > 0, maxPrice < 10000,
    rating > 0, inStock,
  ].filter(Boolean).length;

  return {
    filters: { q, category, minPrice, maxPrice, rating, inStock, sort, page },
    setters: {
      setQ, setCategory, setMinPrice, setMaxPrice,
      setRating, setInStock, setSort, setPage,
    },
    setFilterAndResetPage,
    clearAllFilters,
    activeFilterCount,
  };
}

// ─── Data Fetching Hook ──────────────────────────────────────────

function useProductSearch(filters: ProductFilters) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.q) params.set("q", filters.q);
      if (filters.category.length)
        params.set("category", filters.category.join(","));
      if (filters.minPrice > 0)
        params.set("minPrice", String(filters.minPrice));
      if (filters.maxPrice < 10000)
        params.set("maxPrice", String(filters.maxPrice));
      if (filters.rating > 0)
        params.set("rating", String(filters.rating));
      if (filters.inStock)
        params.set("inStock", "true");
      params.set("sort", filters.sort);
      params.set("page", String(filters.page));
      params.set("limit", "20");

      const res = await fetch(`/api/products?${params}`);
      return handleApiResponse<ProductSearchResult>(res);
    },
    placeholderData: keepPreviousData, // stale-while-revalidate
    staleTime: 30_000, // 30s cache
  });
}

interface ProductSearchResult {
  products: Product[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  facets: {
    categories: { slug: string; name: string; count: number }[];
    priceRange: { min: number; max: number };
    ratings: { rating: number; count: number }[];
  };
}

// ─── Page Component ──────────────────────────────────────────────

function ProductListingPage() {
  const { filters, setters, clearAllFilters, activeFilterCount } =
    useProductFilters();
  const { data, isLoading, isError, isPlaceholderData, error } =
    useProductSearch(filters);

  // Debounced search input (300ms)
  const [searchInput, setSearchInput] = useState(filters.q);
  const debouncedSetQ = useDebouncedCallback(setters.setQ, 300);

  const handleSearchChange = (value: string) => {
    setSearchInput(value); // instant UI update
    debouncedSetQ(value);  // debounced URL update
  };

  // Prefetch next page
  const queryClient = useQueryClient();
  useEffect(() => {
    if (data && filters.page < data.totalPages) {
      queryClient.prefetchQuery({
        queryKey: ["products", { ...filters, page: filters.page + 1 }],
        queryFn: () => fetchProducts({ ...filters, page: filters.page + 1 }),
      });
    }
  }, [data, filters.page]);

  return (
    <div className="plp-layout">
      {/* Sidebar filters (desktop) / Sheet (mobile) */}
      <ProductFilters
        filters={filters}
        setters={setters}
        facets={data?.facets}
        activeCount={activeFilterCount}
        onClear={clearAllFilters}
      />

      <main className="plp-main">
        {/* Toolbar: result count, sort, active filter pills */}
        <SearchToolbar
          totalCount={data?.totalCount ?? 0}
          sort={filters.sort}
          onSortChange={setters.setSort}
          activeFilters={filters}
          onRemoveFilter={/* removes individual filter */}
          searchValue={searchInput}
          onSearchChange={handleSearchChange}
          isStale={isPlaceholderData}
        />

        {/* Results */}
        {isLoading && !data ? (
          <ProductGridSkeleton count={12} />
        ) : isError ? (
          <ErrorState
            message="Couldn't load products"
            onRetry={() => queryClient.invalidateQueries(["products"])}
          />
        ) : data.products.length === 0 ? (
          <EmptyState
            icon="search"
            title="No products found"
            description={
              filters.q
                ? `No results for "${filters.q}"`
                : "Try adjusting your filters"
            }
            action={
              <Button variant="secondary" onClick={clearAllFilters}>
                Clear all filters
              </Button>
            }
          />
        ) : (
          <>
            <ProductGrid
              products={data.products}
              isStale={isPlaceholderData} // subtle opacity during refetch
            />
            <PaginationBar
              currentPage={data.currentPage}
              totalPages={data.totalPages}
              onPageChange={setters.setPage}
            />
          </>
        )}
      </main>
    </div>
  );
}

// ─── Filter Sidebar Component ────────────────────────────────────

function ProductFilters({
  filters,
  setters,
  facets,
  activeCount,
  onClear,
}: ProductFiltersProps) {
  // On mobile, this renders inside a Sheet (bottom drawer)
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [open, setOpen] = useState(false);

  const content = (
    <div className="filter-panel">
      <div className="filter-header">
        <h3>Filters {activeCount > 0 && `(${activeCount})`}</h3>
        {activeCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            Clear all
          </Button>
        )}
      </div>

      {/* Category checkboxes with counts from facets */}
      <FilterSection title="Category">
        {facets?.categories.map((cat) => (
          <FilterCheckbox
            key={cat.slug}
            label={`${cat.name} (${cat.count})`}
            checked={filters.category.includes(cat.slug)}
            onChange={(checked) => {
              const next = checked
                ? [...filters.category, cat.slug]
                : filters.category.filter((c) => c !== cat.slug);
              setters.setCategory(next);
              setters.setPage(1);
            }}
          />
        ))}
      </FilterSection>

      {/* Price range slider */}
      <FilterSection title="Price (MAD)">
        <DualRangeSlider
          min={facets?.priceRange.min ?? 0}
          max={facets?.priceRange.max ?? 10000}
          value={[filters.minPrice, filters.maxPrice]}
          onChange={([min, max]) => {
            setters.setMinPrice(min);
            setters.setMaxPrice(max);
            setters.setPage(1);
          }}
          step={10}
          formatLabel={(v) => `${v} MAD`}
        />
      </FilterSection>

      {/* Minimum rating */}
      <FilterSection title="Rating">
        {[4, 3, 2, 1].map((r) => (
          <FilterRadio
            key={r}
            label={<><StarDisplay rating={r} /> & up</>}
            checked={filters.rating === r}
            onChange={() => {
              setters.setRating(filters.rating === r ? 0 : r);
              setters.setPage(1);
            }}
          />
        ))}
      </FilterSection>

      {/* In stock toggle */}
      <FilterSection title="Availability">
        <FilterToggle
          label="In stock only"
          checked={filters.inStock}
          onChange={(v) => {
            setters.setInStock(v);
            setters.setPage(1);
          }}
        />
      </FilterSection>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="secondary" size="sm">
            Filters {activeCount > 0 && `(${activeCount})`}
          </Button>
        </SheetTrigger>
        <SheetContent side="left">{content}</SheetContent>
      </Sheet>
    );
  }

  return <aside className="plp-sidebar">{content}</aside>;
}
```

### 3.4 Edge Cases

| Edge Case | Solution |
|-----------|----------|
| User types fast in search | 300ms debounce on search input. Only the final keystroke triggers a URL update and API call. |
| Deep-linking with invalid filter params | `nuqs` parsers return defaults for invalid values. `parseAsInteger` returns `0` for `"abc"`. Zod validates server-side. |
| Filter combination yields 0 results | Show `EmptyState` with "No products match these filters" + "Clear all filters" button. Never show a blank page. |
| Back button after filter change | URL-based state means back button naturally restores previous filter state. TanStack Query cache serves previous results instantly. |
| Category with 0 matching products | Server facets return categories with `count: 0`. UI shows them grayed out with "(0)" but still clickable (user might combine with other filter changes). |
| Price range slider edge | Enforce `min < max`. If user drags min above max, swap values. Debounce the slider `onChange` by 150ms. |
| Pagination beyond available pages | Server clamps `page = min(page, totalPages)`. Client redirects to last page if requested page > total. |
| SEO for paginated pages | Page 1 is canonical. Pages 2+ get `<meta name="robots" content="noindex,follow">` + `rel="prev/next"`. |

---

## 4. User Dashboard

### 4.1 State Machine (Per Section)

The dashboard is a tabbed/routed interface. Each section has its own state:

```
  /account
    ├── /account/orders          → OrdersSection
    │     States: LOADING → IDLE(orders[]) | EMPTY | ERROR
    │     Sub-state: order detail modal/page
    │
    ├── /account/settings        → ProfileSection
    │     States: IDLE → EDITING → SAVING → IDLE | SAVE_ERROR
    │     Sub-sections: profile form, password change, 2FA setup
    │
    ├── /account/addresses       → AddressSection
    │     States: IDLE(addresses[]) | EMPTY
    │     CRUD states per address: VIEWING → EDITING → SAVING
    │     Add new: CREATING → SAVING → IDLE
    │     Delete: CONFIRM_DELETE → DELETING → IDLE
    │
    ├── /account/wishlist        → WishlistSection
    │     States: LOADING → IDLE(products[]) | EMPTY
    │     Remove: optimistic removal + undo toast
    │
    └── /account/notifications   → NotificationPrefsSection
          States: LOADING → IDLE → SAVING → IDLE
          Toggle matrix: type × channel
```

### 4.2 React Component Structure

```typescript
// ─── Layout ──────────────────────────────────────────────────────

function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = useSession();

  return (
    <div className="account-layout">
      <AccountSidebar
        user={session.user}
        activeSection={usePathname()}
      />
      <main className="account-main">
        <Suspense fallback={<AccountSectionSkeleton />}>
          {children}
        </Suspense>
      </main>
    </div>
  );
}

// ─── Orders Section ──────────────────────────────────────────────

function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders", statusFilter, page],
    queryFn: () => fetchOrders({ status: statusFilter, page, limit: 10 }),
  });

  if (isLoading) return <OrderTableSkeleton rows={5} />;
  if (isError) return <ErrorState message="Couldn't load orders" />;
  if (data.orders.length === 0 && statusFilter === "all") {
    return (
      <EmptyState
        icon="package"
        title="No orders yet"
        description="When you place an order, it will appear here."
        action={<Button asChild><Link href="/products">Shop Now</Link></Button>}
      />
    );
  }

  return (
    <>
      <div className="orders-toolbar">
        <h1>My Orders</h1>
        <StatusFilterTabs value={statusFilter} onChange={setStatusFilter} />
      </div>

      <DataTable
        columns={orderColumns}
        data={data.orders}
        onRowClick={(order) => router.push(`/account/orders/${order.id}`)}
      />

      <PaginationBar
        currentPage={data.currentPage}
        totalPages={data.totalPages}
        onPageChange={setPage}
      />
    </>
  );
}

// ─── Address Section (Full CRUD) ─────────────────────────────────

function AddressesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: fetchAddresses,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const updateAddress = useMutation({
    mutationFn: (data: { id: string; address: AddressInput }) =>
      fetch(`/api/account/addresses/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify(data.address),
      }).then(handleApiResponse),
    onSuccess: () => {
      queryClient.invalidateQueries(["addresses"]);
      setEditingId(null);
      toast.success("Address updated");
    },
    onError: () => toast.error("Failed to update address"),
  });

  const deleteAddress = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/account/addresses/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries(["addresses"]);
      toast.success("Address removed");
    },
  });

  const setDefault = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/account/addresses/${id}/default`, { method: "PATCH" }),
    onMutate: async (id) => {
      // Optimistic: mark this as default, unmark others
      await queryClient.cancelQueries(["addresses"]);
      const prev = queryClient.getQueryData<Address[]>(["addresses"]);
      queryClient.setQueryData<Address[]>(["addresses"], (old) =>
        old?.map((a) => ({ ...a, isDefault: a.id === id }))
      );
      return { prev };
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(["addresses"], context?.prev);
    },
    onSettled: () => queryClient.invalidateQueries(["addresses"]),
  });

  if (isLoading) return <AddressGridSkeleton count={3} />;

  return (
    <>
      <div className="addresses-header">
        <h1>Saved Addresses</h1>
        <Button onClick={() => setIsAdding(true)}>+ Add Address</Button>
      </div>

      {data.length === 0 && !isAdding ? (
        <EmptyState
          icon="map-pin"
          title="No saved addresses"
          description="Add an address for faster checkout."
          action={
            <Button onClick={() => setIsAdding(true)}>Add Address</Button>
          }
        />
      ) : (
        <div className="address-grid">
          {data.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              isEditing={editingId === address.id}
              onEdit={() => setEditingId(address.id)}
              onSave={(updated) =>
                updateAddress.mutate({ id: address.id, address: updated })
              }
              onCancel={() => setEditingId(null)}
              onDelete={() => {
                // Show confirmation dialog first
                if (confirm("Remove this address?")) {
                  deleteAddress.mutate(address.id);
                }
              }}
              onSetDefault={() => setDefault.mutate(address.id)}
              isSaving={
                updateAddress.isPending &&
                updateAddress.variables?.id === address.id
              }
            />
          ))}

          {isAdding && (
            <AddressCard
              isNew
              isEditing
              onSave={(newAddr) => {
                createAddress.mutate(newAddr, {
                  onSuccess: () => setIsAdding(false),
                });
              }}
              onCancel={() => setIsAdding(false)}
              isSaving={createAddress.isPending}
            />
          )}
        </div>
      )}
    </>
  );
}

// ─── Notification Preferences ────────────────────────────────────

function NotificationPrefsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["notification-prefs"],
    queryFn: fetchNotificationPrefs,
  });

  const updatePref = useMutation({
    mutationFn: (prefs: NotificationPrefs) =>
      fetch("/api/notifications/preferences", {
        method: "PUT",
        body: JSON.stringify(prefs),
      }),
    onMutate: async (newPrefs) => {
      // Optimistic toggle
      await queryClient.cancelQueries(["notification-prefs"]);
      const prev = queryClient.getQueryData(["notification-prefs"]);
      queryClient.setQueryData(["notification-prefs"], newPrefs);
      return { prev };
    },
    onError: (_err, _prefs, context) => {
      queryClient.setQueryData(["notification-prefs"], context?.prev);
      toast.error("Failed to update preferences");
    },
    onSettled: () =>
      queryClient.invalidateQueries(["notification-prefs"]),
  });

  if (isLoading) return <PrefsMatrixSkeleton />;

  // Matrix: rows = notification types, columns = channels
  const types = [
    { key: "order_updates", label: "Order updates" },
    { key: "promotions", label: "Promotions & offers" },
    { key: "stock_alerts", label: "Back-in-stock alerts" },
    { key: "review_requests", label: "Review requests" },
  ] as const;

  const channels = ["email", "sms", "push", "inApp"] as const;

  return (
    <table className="prefs-matrix">
      <thead>
        <tr>
          <th />
          {channels.map((ch) => (
            <th key={ch}>{channelLabels[ch]}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {types.map((type) => (
          <tr key={type.key}>
            <td>{type.label}</td>
            {channels.map((ch) => (
              <td key={ch}>
                <Toggle
                  checked={data[type.key]?.[ch] ?? false}
                  onChange={(checked) =>
                    updatePref.mutate({
                      ...data,
                      [type.key]: { ...data[type.key], [ch]: checked },
                    })
                  }
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### 4.3 Edge Cases

| Edge Case | Solution |
|-----------|----------|
| User deletes their only/default address | Prevent deletion of the sole address if there's an active order in "processing" or "shipped" state. Otherwise allow, and next checkout prompts a new address. |
| Optimistic update fails (network error) | Rollback via `onError` + TanStack Query `context`. Show toast with "Failed to save — your changes were reverted." |
| Session expires while editing profile | Auth middleware returns 401 → TanStack Query `onError` global handler redirects to `/auth/login?callbackUrl=/account/settings`. |
| Order detail page for cancelled order | Show all info read-only. Status timeline stops at "Cancelled" with a red badge. Hide "Cancel" and "Track" buttons. |
| Push notification toggle when browser doesn't support Push API | Check `'serviceWorker' in navigator && 'PushManager' in window`. If false, disable push toggle with tooltip: "Push notifications not supported in this browser." |
| User has 100+ orders | Server paginates (10/page). Query key includes page number. Prefetch next page on current page load. |

---

## 5. Authentication Flow

### 5.1 State Machine

```
                    ┌──────────────────────────────────┐
                    │          UNAUTHENTICATED          │
                    │  No session. Public routes only.  │
                    └─────┬──────────────┬─────────────┘
                          │              │
                     LOGIN_START    REGISTER_START
                          │              │
                          ▼              ▼
              ┌─────────────────┐ ┌──────────────────────┐
              │  LOGIN_FORM     │ │  REGISTER_FORM       │
              │  Email+password │ │  Name+email+password  │
              │  or OAuth       │ │  or OAuth             │
              └───┬──────┬──────┘ └───┬──────────────────┘
                  │      │            │
             SUBMIT  OAUTH_START   SUBMIT
                  │      │            │
                  ▼      │            ▼
       ┌──────────────┐  │   ┌──────────────────────────┐
       │ VALIDATING   │  │   │ CREATING_ACCOUNT         │
       │ Server check │  │   │ POST /api/auth/register  │
       └──┬───────┬───┘  │   └───┬──────────────────────┘
          │       │       │       │
       SUCCESS  FAIL      │    SUCCESS
          │       │       │       │
          │       ▼       │       ▼
          │  ┌─────────┐  │  ┌─────────────────────────────┐
          │  │ ERROR    │  │  │ EMAIL_VERIFICATION_PENDING  │
          │  │ Show msg │  │  │ "Check your email"          │
          │  └─────────┘  │  │ Resend link available (60s)  │
          │               │  └──────────────┬──────────────┘
          │               │                 │ EMAIL_VERIFIED
          ▼               │                 ▼
  ┌─ Has 2FA? ──────────────────────────────────────────────┐
  │  YES                                                 NO │
  │  ▼                                                   ▼  │
  │  ┌──────────────────────┐    ┌─────────────────────┐    │
  │  │  TWO_FACTOR_CHALLENGE│    │  AUTHENTICATED       │    │
  │  │  Enter 6-digit TOTP  │    │  Session active.     │    │
  │  │  from authenticator  │    │  Redirect to         │    │
  │  └──┬───────────┬───────┘    │  callbackUrl or /    │    │
  │     │           │            └─────────────────────┘    │
  │  VERIFY_OK   VERIFY_FAIL                                │
  │     │           │                                       │
  │     ▼           ▼                                       │
  │  AUTHENTICATED  ERROR (3 attempts → lockout 15min)      │
  └─────────────────────────────────────────────────────────┘

  OAUTH flow (parallel path):
  ┌────────────────┐    ┌────────────────────────┐
  │ OAUTH_REDIRECT │───▶│ Provider login page     │
  │ (Google, etc.) │    │ (external)              │
  └────────────────┘    └───────────┬────────────┘
                                    │ callback
                                    ▼
                        ┌────────────────────────┐
                        │ OAUTH_CALLBACK         │
                        │ NextAuth handles:      │
                        │ • Create/link account  │
                        │ • Create session       │
                        │ • Redirect             │
                        └───────────┬────────────┘
                                    │
                                    ▼
                              AUTHENTICATED

  PASSWORD_RESET flow (separate):
  FORGOT_PASSWORD → RESET_EMAIL_SENT → RESET_FORM → RESET_SUCCESS
```

### 5.2 React Component Structure

```typescript
// ─── Types ───────────────────────────────────────────────────────

type AuthStep =
  | "login"
  | "register"
  | "forgot_password"
  | "reset_sent"
  | "two_factor"
  | "email_verification";

interface AuthState {
  step: AuthStep;
  email: string | null;      // persisted across steps
  twoFactorRequired: boolean;
  error: string | null;
  isLoading: boolean;
}

// ─── Login Form ──────────────────────────────────────────────────

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

function LoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const router = useRouter();
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [tempCredentials, setTempCredentials] = useState<{
    email: string;
    password: string;
  } | null>(null);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: z.infer<typeof loginSchema>) => {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error === "2FA_REQUIRED") {
        return { requires2FA: true };
      }
      if (result?.error) {
        throw new Error(result.error);
      }
      return { requires2FA: false };
    },
    onSuccess: (result) => {
      if (result.requires2FA) {
        setTempCredentials({
          email: form.getValues("email"),
          password: form.getValues("password"),
        });
        setTwoFactorRequired(true);
      } else {
        router.push(callbackUrl ?? "/");
        router.refresh(); // re-run server components with new session
      }
    },
    onError: (error) => {
      if (error.message === "EMAIL_NOT_VERIFIED") {
        form.setError("root", {
          message: "Please verify your email before logging in.",
        });
      } else {
        form.setError("root", {
          message: "Invalid email or password.",
        });
      }
    },
  });

  // If 2FA is required, show the TOTP input
  if (twoFactorRequired && tempCredentials) {
    return (
      <TwoFactorChallenge
        email={tempCredentials.email}
        onVerified={() => {
          router.push(callbackUrl ?? "/");
          router.refresh();
        }}
        onCancel={() => {
          setTwoFactorRequired(false);
          setTempCredentials(null);
        }}
      />
    );
  }

  return (
    <div className="auth-card">
      <h1 className="auth-title">Welcome back</h1>
      <p className="auth-subtitle">
        Sign in to your ShahdCoop account
      </p>

      {/* OAuth buttons */}
      <OAuthButtons />

      <Separator label="or continue with email" />

      <form onSubmit={form.handleSubmit((d) => loginMutation.mutate(d))}>
        {/* Root error (invalid credentials, email not verified) */}
        {form.formState.errors.root && (
          <Alert variant="error">
            {form.formState.errors.root.message}
          </Alert>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <Input
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              {...field}
            />
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <PasswordInput
              placeholder="Password"
              autoComplete="current-password"
              {...field}
            />
          )}
        />

        <div className="auth-options">
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <Checkbox
                label="Remember me"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Link href="/auth/forgot-password" className="auth-link">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? <Spinner /> : "Sign In"}
        </Button>
      </form>

      <p className="auth-footer">
        Don't have an account?{" "}
        <Link href="/auth/register">Create one</Link>
      </p>
    </div>
  );
}

// ─── Registration Form ───────────────────────────────────────────

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Include at least one uppercase letter")
      .regex(/[0-9]/, "Include at least one number"),
    confirmPassword: z.string(),
    phone: z.string().optional(),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms" }),
    }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

function RegisterForm() {
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "", email: "", password: "",
      confirmPassword: "", phone: "", acceptTerms: false,
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: z.infer<typeof registerSchema>) =>
      fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }).then(handleApiResponse),
    onSuccess: () => setEmailSent(true),
    onError: (error: ApiError) => {
      if (error.code === "EMAIL_EXISTS") {
        form.setError("email", {
          message: "An account with this email already exists.",
        });
      } else {
        form.setError("root", { message: "Registration failed. Try again." });
      }
    },
  });

  if (emailSent) {
    return (
      <EmailVerificationPending
        email={form.getValues("email")}
        onResend={() => resendVerification(form.getValues("email"))}
      />
    );
  }

  return (
    <div className="auth-card">
      <h1 className="auth-title">Create your account</h1>
      <OAuthButtons label="Sign up with" />
      <Separator label="or register with email" />

      <form onSubmit={form.handleSubmit((d) => registerMutation.mutate(d))}>
        {/* form fields with PasswordStrengthMeter, terms checkbox, etc. */}
        {/* ... */}
        <Button type="submit" disabled={registerMutation.isPending}>
          {registerMutation.isPending ? <Spinner /> : "Create Account"}
        </Button>
      </form>
    </div>
  );
}

// ─── Two-Factor Challenge ────────────────────────────────────────

function TwoFactorChallenge({
  email,
  onVerified,
  onCancel,
}: TwoFactorChallengeProps) {
  const [code, setCode] = useState("");
  const [attempts, setAttempts] = useState(0);
  const MAX_ATTEMPTS = 5;

  const verifyMutation = useMutation({
    mutationFn: (code: string) =>
      fetch("/api/auth/2fa/verify", {
        method: "POST",
        body: JSON.stringify({ email, code }),
      }).then(handleApiResponse),
    onSuccess: () => onVerified(),
    onError: () => {
      setAttempts((a) => a + 1);
      setCode("");
      if (attempts + 1 >= MAX_ATTEMPTS) {
        toast.error("Too many attempts. Please try again in 15 minutes.");
      }
    },
  });

  const isLockedOut = attempts >= MAX_ATTEMPTS;

  return (
    <div className="auth-card">
      <h1 className="auth-title">Two-factor authentication</h1>
      <p className="auth-subtitle">
        Enter the 6-digit code from your authenticator app.
      </p>

      <OTPInput
        length={6}
        value={code}
        onChange={setCode}
        onComplete={(code) => verifyMutation.mutate(code)}
        disabled={isLockedOut || verifyMutation.isPending}
        autoFocus
      />

      {verifyMutation.isError && !isLockedOut && (
        <Alert variant="error">
          Invalid code. {MAX_ATTEMPTS - attempts} attempts remaining.
        </Alert>
      )}

      {isLockedOut && (
        <Alert variant="error">
          Account temporarily locked. Try again in 15 minutes.
        </Alert>
      )}

      <div className="auth-2fa-footer">
        <Button variant="ghost" onClick={onCancel}>
          Use a different method
        </Button>
      </div>
    </div>
  );
}

// ─── OTP Input Component ─────────────────────────────────────────

function OTPInput({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled,
  autoFocus,
}: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, char: string) => {
    if (!/^[0-9]?$/.test(char)) return; // digits only

    const newValue =
      value.substring(0, index) + char + value.substring(index + 1);
    onChange(newValue.substring(0, length));

    // Auto-advance to next input
    if (char && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when complete
    if (newValue.length === length && !newValue.includes("")) {
      onComplete?.(newValue);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      // Move back on backspace when current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    const newValue = pasted.substring(0, length);
    onChange(newValue);
    if (newValue.length === length) {
      onComplete?.(newValue);
    } else {
      inputRefs.current[newValue.length]?.focus();
    }
  };

  return (
    <div className="otp-input-group" role="group" aria-label="Verification code">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] ?? ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={i === 0 ? handlePaste : undefined}
          disabled={disabled}
          autoFocus={autoFocus && i === 0}
          className="otp-digit"
          aria-label={`Digit ${i + 1}`}
        />
      ))}
    </div>
  );
}

// ─── Password Reset Flow ─────────────────────────────────────────

function ForgotPasswordPage() {
  const [step, setStep] = useState<"form" | "sent">("form");
  const [email, setEmail] = useState("");

  const requestReset = useMutation({
    mutationFn: (email: string) =>
      fetch("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      }).then(handleApiResponse),
    onSuccess: () => setStep("sent"),
    // Always show "sent" even if email doesn't exist (prevent enumeration)
    onError: () => setStep("sent"),
  });

  if (step === "sent") {
    return (
      <div className="auth-card">
        <h1 className="auth-title">Check your email</h1>
        <p className="auth-subtitle">
          If an account exists for <strong>{email}</strong>, we've sent a
          password reset link. Check your inbox and spam folder.
        </p>
        <ResendTimer
          onResend={() => requestReset.mutate(email)}
          cooldownSeconds={60}
        />
        <Link href="/auth/login" className="auth-link">
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="auth-card">
      <h1 className="auth-title">Reset your password</h1>
      <p className="auth-subtitle">
        Enter your email and we'll send a reset link.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          requestReset.mutate(email);
        }}
      >
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
          required
        />
        <Button type="submit" disabled={requestReset.isPending}>
          {requestReset.isPending ? <Spinner /> : "Send Reset Link"}
        </Button>
      </form>
    </div>
  );
}
```

### 5.3 Error Handling

| Error | Handler | UX |
|-------|---------|-----|
| Invalid credentials | Server returns generic "Invalid email or password" | Single inline error above form. Never reveal which field is wrong (prevents enumeration). |
| Email already exists (register) | Server returns `EMAIL_EXISTS` | Inline error on email field: "An account with this email already exists. [Log in instead?]" |
| Weak password | Client-side Zod regex + `zxcvbn` meter | Real-time feedback. Disable submit until minimum strength met. |
| OAuth provider error | NextAuth catches and redirects with `?error=OAuthCallbackError` | Error page: "Something went wrong with Google sign-in. [Try again] or [Use email instead]" |
| 2FA invalid code | Server returns 401 | Inline error with remaining attempts. After 5 fails, 15-minute lockout. |
| Email verification link expired | Server returns `TOKEN_EXPIRED` | "This link has expired. [Resend verification email]" |
| Rate limiting (too many login attempts) | Server returns 429 | "Too many attempts. Please wait X minutes." Disable submit button with countdown timer. |
| Password reset for non-existent email | Server always returns 200 | "If an account exists, we sent a link." — prevents email enumeration. |
| Network error during auth | `onError` handler | "Connection error. Please check your internet and try again." Preserve form data. |

### 5.4 Security Edge Cases

| Edge Case | Solution |
|-----------|----------|
| CSRF on auth forms | NextAuth.js provides CSRF token automatically. Custom endpoints use `csrf` middleware. |
| Session fixation | NextAuth regenerates session ID on login. `HttpOnly`, `Secure`, `SameSite=Lax` cookie flags. |
| Password in URL | Never. All auth forms use `POST`. Reset tokens are URL params but expire in 1 hour and are single-use. |
| Open redirect via `callbackUrl` | Validate `callbackUrl` against allowed origins. Only allow relative paths or `shahdcoop.ma` domain. |
| Timing attacks on email enumeration | Login always takes ~500ms (constant time). Register returns immediately. Password reset always shows "sent" message. |
| 2FA backup/recovery | On 2FA setup, show 8 recovery codes. Store hashed. Each code is single-use. "Lost your device?" → enter recovery code → disable 2FA. |
| OAuth account linking | If a user registers with email, then tries Google OAuth with same email: prompt to link accounts (requires email password to confirm). |
| Session in multiple tabs | Session state synced via `BroadcastChannel`. Logout in one tab → all tabs redirect to login via `storage` event listener. |
| Bot registration | Rate limit `/api/auth/register` to 3/minute per IP. Optional: invisible reCAPTCHA on register form (load via `next/script`). |

---

## Shared Utilities

### API Response Handler

```typescript
// lib/utils/api.ts

interface ApiErrorResponse {
  code: string;
  message: string;
  meta?: Record<string, unknown>;
}

class ApiError extends Error {
  code: string;
  status: number;
  meta?: Record<string, unknown>;

  constructor(status: number, body: ApiErrorResponse) {
    super(body.message);
    this.code = body.code;
    this.status = status;
    this.meta = body.meta;
  }
}

async function handleApiResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({
      code: "UNKNOWN",
      message: "An unexpected error occurred",
    }));
    throw new ApiError(res.status, body);
  }
  return res.json();
}

function toApiError(err: unknown): ApiError {
  if (err instanceof ApiError) return err;
  if (err instanceof Error) {
    return new ApiError(500, {
      code: "CLIENT_ERROR",
      message: err.message,
    });
  }
  return new ApiError(500, {
    code: "UNKNOWN",
    message: "An unexpected error occurred",
  });
}
```

### Global Error Toast Handler

```typescript
// providers/query-provider.tsx

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (error) => {
        if (error instanceof ApiError) {
          if (error.status === 401) {
            // Session expired
            router.push(
              `/auth/login?callbackUrl=${encodeURIComponent(pathname)}`
            );
            return;
          }
          if (error.status === 429) {
            toast.error("Too many requests. Please slow down.");
            return;
          }
        }
        // Don't show generic toasts here — let each mutation handle its own
      },
    },
    queries: {
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status < 500) return false;
        return failureCount < 2; // retry server errors twice
      },
      staleTime: 30_000, // 30 seconds default
    },
  },
});
```

---

*End of component architecture document.*
