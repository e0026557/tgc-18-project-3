// *** DEPENDENCIES ***
import React, { useContext, useEffect } from "react";
import { loadStripe } from '@stripe/stripe-js';

// *** CONTEXTS ***
import UserContext from '../contexts/UserContext';

export default function Checkout() {
  // Consume user context
  const userContext = useContext(UserContext);
    (async () => {
      // Get stripe session id as object and publishable key
      let sessionIdObj = {};
      let publishableKey = null;

      const stripeData = await userContext.checkout();

      if (stripeData) {
        sessionIdObj = {sessionId: stripeData.sessionId};
        publishableKey = stripeData.publishableKey;
      }

      const stripe = await loadStripe(publishableKey);
      stripe.redirectToCheckout(sessionIdObj);
    })();
}