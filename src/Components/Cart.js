import React from 'react';
import Swal from 'sweetalert2';

const Cart = ({ cart, onRemoveFromCart, onIncreaseQuantity, onDecreaseQuantity, onCheckout, onClose, onClearCart, currentUser }) => {
  // Calculate total price
  const totalPrice = cart.reduce((sum, item) => {
    const quantity = item.quantity || 1;
    return sum + (item.price * quantity);
  }, 0);

  // Handle clear cart with confirmation
  const handleClearCart = () => {
    Swal.fire({
      title: 'Clear Cart?',
      text: 'Are you sure you want to remove all items from your cart?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, clear it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        onClearCart();
        Swal.fire({
          title: 'Cart Cleared!',
          text: 'All items have been removed from your cart.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      }
    });
  };

  return (
    <div>
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-container" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <button onClick={onClose}>Continue Shopping</button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} />
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p className="item-price">${item.price.toFixed(2)}</p>
                    <div className="quantity-controls">
                      <button 
                        onClick={() => onDecreaseQuantity(item.id)}
                        className="qty-btn"
                      >
                        -
                      </button>
                      <span className="quantity">{item.quantity || 1}</span>
                      <button 
                        onClick={() => onIncreaseQuantity(item.id)}
                        className="qty-btn"
                      >
                        +
                      </button>
                    </div>
                    <p className="item-total">
                      Subtotal: ${((item.price * (item.quantity || 1)).toFixed(2))}
                    </p>
                  </div>
                  <button 
                    className="remove-btn"
                    onClick={() => onRemoveFromCart(item.id)}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-total">
                <h4>Total: ${totalPrice.toFixed(2)}</h4>
                <p>{cart.length} item(s)</p>
              </div>
              <div className="cart-actions">
                <button 
                  className="clear-cart-btn"
                  onClick={handleClearCart}
                >
                  Clear Cart
                </button>
                <button 
                  className="checkout-btn"
                  onClick={onCheckout}
                  disabled={!currentUser}
                >
                  {currentUser ? 'Proceed to Checkout' : 'Login to Checkout'}
                </button>
              </div>
              {!currentUser && (
                <p className="login-reminder">Please login to complete your purchase</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  </div>
  );
};

export default Cart;