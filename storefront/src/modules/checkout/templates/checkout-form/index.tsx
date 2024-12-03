import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import { HttpTypes } from "@medusajs/types"

export default async function CheckoutForm({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) {
  if (!cart) {
    return null
  }

  const shippingMethods = await listCartShippingMethods(cart.id)
  const paymentMethods = await listCartPaymentMethods(cart.region?.id ?? "")

  if (!shippingMethods || !paymentMethods) {
    return null
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      <form>
        {/* Contact & Shipping Address Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Contact & Shipping Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="First Name" 
              name="firstName"
              defaultValue={customer?.first_name}
              className="w-full p-2 border rounded"
              required 
            />
            <input 
              type="text" 
              placeholder="Last Name" 
              name="lastName"
              defaultValue={customer?.last_name}
              className="w-full p-2 border rounded"
              required 
            />
          </div>
          <input 
            type="email" 
            placeholder="Email"
            name="email"
            defaultValue={customer?.email}
            className="w-full p-2 border rounded mt-4"
            required 
          />
          <input 
            type="text" 
            placeholder="Address"
            name="address"
            className="w-full p-2 border rounded mt-4"
            required 
          />
          <div className="grid grid-cols-3 gap-4 mt-4">
            <input 
              type="text" 
              placeholder="City"
              name="city"
              className="w-full p-2 border rounded" 
              required
            />
            <input 
              type="text" 
              placeholder="Postal Code"
              name="postalCode"
              className="w-full p-2 border rounded" 
              required
            />
            <select 
              name="country"
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Country</option>
              {cart.region?.countries?.map((country) => (
                <option key={country.iso_2} value={country.iso_2}>
                  {country.display_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Shipping Method Section */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Shipping Method</h2>
          <div className="space-y-2">
            {shippingMethods.map((method) => (
              <div key={method.id} className="flex items-center">
                <input 
                  type="radio" 
                  id={method.id} 
                  name="shippingMethod" 
                  value={method.id}
                  className="mr-2"
                  required 
                />
                <label htmlFor={method.id}>
                  {method.name} - {method.amount / 100} {cart.region?.currency_code.toUpperCase()}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Method Section */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
          <div className="space-y-2">
            {paymentMethods.map((method) => (
              <div key={method.provider} className="flex items-center">
                <input 
                  type="radio" 
                  id={method.provider} 
                  name="paymentMethod" 
                  value={method.provider}
                  className="mr-2"
                  required 
                />
                <label htmlFor={method.provider}>
                  {method.provider}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary Section */}
        <div className="mt-6"></div>