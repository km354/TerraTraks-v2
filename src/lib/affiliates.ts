/**
 * Affiliate Links Configuration
 * 
 * Manages affiliate program integrations for monetization
 */

export interface AffiliateConfig {
  bookingCom: {
    enabled: boolean;
    affiliateId?: string;
  };
  rei: {
    enabled: boolean;
    affiliateId?: string;
  };
  getYourGuide: {
    enabled: boolean;
    affiliateId?: string;
  };
  viator: {
    enabled: boolean;
    affiliateId?: string;
  };
}

/**
 * Get affiliate configuration from environment variables
 */
export function getAffiliateConfig(): AffiliateConfig {
  return {
    bookingCom: {
      enabled: !!process.env.BOOKING_COM_AFFILIATE_ID,
      affiliateId: process.env.BOOKING_COM_AFFILIATE_ID,
    },
    rei: {
      enabled: !!process.env.REI_AFFILIATE_ID,
      affiliateId: process.env.REI_AFFILIATE_ID,
    },
    getYourGuide: {
      enabled: !!process.env.GET_YOUR_GUIDE_AFFILIATE_ID,
      affiliateId: process.env.GET_YOUR_GUIDE_AFFILIATE_ID,
    },
    viator: {
      enabled: !!process.env.VIATOR_AFFILIATE_ID,
      affiliateId: process.env.VIATOR_AFFILIATE_ID,
    },
  };
}

/**
 * Generate Booking.com affiliate link for hotels
 */
export function generateBookingComLink(
  destination: string,
  checkIn?: Date,
  checkOut?: Date
): string | null {
  const config = getAffiliateConfig();
  
  if (!config.bookingCom.enabled || !config.bookingCom.affiliateId) {
    return null;
  }

  const baseUrl = 'https://www.booking.com/searchresults.html';
  const params = new URLSearchParams({
    ss: destination,
  });
  
  if (checkIn) {
    params.append('checkin_month', String(checkIn.getMonth() + 1));
    params.append('checkin_monthday', String(checkIn.getDate()));
    params.append('checkin_year', String(checkIn.getFullYear()));
  }
  
  if (checkOut) {
    params.append('checkout_month', String(checkOut.getMonth() + 1));
    params.append('checkout_monthday', String(checkOut.getDate()));
    params.append('checkout_year', String(checkOut.getFullYear()));
  }
  
  if (config.bookingCom.affiliateId) {
    params.append('aid', config.bookingCom.affiliateId);
  }

  return `${baseUrl}?${params.toString()}`;
}

/**
 * Generate REI affiliate link for outdoor gear
 */
export function generateReiLink(productName: string): string | null {
  const config = getAffiliateConfig();
  
  if (!config.rei.enabled || !config.rei.affiliateId) {
    return null;
  }

  // REI uses a search-based affiliate link structure
  // Note: REI affiliate links typically use a different structure
  // This is a simplified version - you may need to adjust based on REI's actual affiliate program
  const baseUrl = 'https://www.rei.com/search';
  const params = new URLSearchParams({
    q: productName,
  });
  
  if (config.rei.affiliateId) {
    // REI affiliate tracking may use different parameters
    // Adjust based on their actual affiliate program requirements
    params.append('affiliateId', config.rei.affiliateId);
  }

  return `${baseUrl}?${params.toString()}`;
}

/**
 * Generate GetYourGuide affiliate link for tours and activities
 */
export function generateGetYourGuideLink(
  activity: string,
  destination: string
): string | null {
  const config = getAffiliateConfig();
  
  if (!config.getYourGuide.enabled || !config.getYourGuide.affiliateId) {
    return null;
  }

  const baseUrl = 'https://www.getyourguide.com/s';
  const params = new URLSearchParams({
    q: `${activity} ${destination}`,
  });
  
  if (config.getYourGuide.affiliateId) {
    params.append('partner_id', config.getYourGuide.affiliateId);
  }

  return `${baseUrl}?${params.toString()}`;
}

/**
 * Generate Viator affiliate link for tours and activities
 */
export function generateViatorLink(
  activity: string,
  destination: string
): string | null {
  const config = getAffiliateConfig();
  
  if (!config.viator.enabled || !config.viator.affiliateId) {
    return null;
  }

  const baseUrl = 'https://www.viator.com/searchResults/all';
  const params = new URLSearchParams({
    text: `${activity} ${destination}`,
  });
  
  if (config.viator.affiliateId) {
    params.append('pid', config.viator.affiliateId);
  }

  return `${baseUrl}?${params.toString()}`;
}

/**
 * Generate affiliate link for accommodation items
 */
export function getAccommodationAffiliateLink(
  destination: string,
  checkIn?: Date,
  checkOut?: Date
): { url: string; label: string; provider: string } | null {
  const bookingLink = generateBookingComLink(destination, checkIn, checkOut);
  
  if (bookingLink) {
    return {
      url: bookingLink,
      label: 'Find Hotels on Booking.com',
      provider: 'Booking.com',
    };
  }

  return null;
}

/**
 * Generate affiliate link for outdoor gear items
 */
export function getGearAffiliateLink(productName: string): { url: string; label: string; provider: string } | null {
  const reiLink = generateReiLink(productName);
  
  if (reiLink) {
    return {
      url: reiLink,
      label: `Shop ${productName} at REI`,
      provider: 'REI',
    };
  }

  return null;
}

/**
 * Generate affiliate link for tour/activity items
 */
export function getActivityAffiliateLink(
  activity: string,
  destination: string
): { url: string; label: string; provider: string } | null {
  // Try GetYourGuide first, then Viator
  const getYourGuideLink = generateGetYourGuideLink(activity, destination);
  if (getYourGuideLink) {
    return {
      url: getYourGuideLink,
      label: `Book ${activity} on GetYourGuide`,
      provider: 'GetYourGuide',
    };
  }

  const viatorLink = generateViatorLink(activity, destination);
  if (viatorLink) {
    return {
      url: viatorLink,
      label: `Book ${activity} on Viator`,
      provider: 'Viator',
    };
  }

  // Fallback to non-affiliate links if affiliates not configured
  return {
    url: `https://www.getyourguide.com/s/?q=${encodeURIComponent(`${activity} ${destination}`)}`,
    label: `Book ${activity} on GetYourGuide`,
    provider: 'GetYourGuide',
  };
}

/**
 * Check if any affiliate programs are enabled
 */
export function hasAffiliateLinks(): boolean {
  const config = getAffiliateConfig();
  return (
    config.bookingCom.enabled ||
    config.rei.enabled ||
    config.getYourGuide.enabled ||
    config.viator.enabled
  );
}

