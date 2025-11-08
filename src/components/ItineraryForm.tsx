'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ItineraryFormData {
  destination: string;
  startDate: string;
  endDate: string;
  duration: number | null;
  interests: string[];
  difficulty: string;
  budget: string;
  budgetRange: string;
  groupSize: string;
  travelingWith: string[];
  title: string;
  description: string;
}

const INTERESTS = [
  'Hiking',
  'Sightseeing',
  'Wildlife Watching',
  'Photography',
  'Camping',
  'Rock Climbing',
  'Fishing',
  'Swimming',
  'Boating/Kayaking',
  'Bird Watching',
  'Stargazing',
  'History & Culture',
  'Food & Dining',
  'Shopping',
  'Relaxation',
  'Adventure Sports',
];

const DIFFICULTY_LEVELS = [
  { value: 'easy', label: 'Easy', description: 'Relaxed pace, minimal physical activity' },
  { value: 'moderate', label: 'Moderate', description: 'Some physical activity, moderate challenges' },
  { value: 'challenging', label: 'Challenging', description: 'Strenuous activities, difficult terrain' },
  { value: 'extreme', label: 'Extreme', description: 'Very strenuous, for experienced adventurers' },
];

const BUDGET_RANGES = [
  { value: 'budget', label: 'Budget', description: 'Under $500 per person' },
  { value: 'moderate', label: 'Moderate', description: '$500 - $1,500 per person' },
  { value: 'comfortable', label: 'Comfortable', description: '$1,500 - $3,000 per person' },
  { value: 'luxury', label: 'Luxury', description: '$3,000+ per person' },
];

const GROUP_SIZES = [
  'Solo Traveler',
  'Couple (2)',
  'Small Group (3-5)',
  'Medium Group (6-10)',
  'Large Group (11+)',
];

const TRAVELING_WITH = [
  'Kids',
  'Pets',
  'Seniors',
  'First-time Visitors',
];

export function ItineraryForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ItineraryFormData>({
    destination: '',
    startDate: '',
    endDate: '',
    duration: null,
    interests: [],
    difficulty: '',
    budget: '',
    budgetRange: '',
    groupSize: '',
    travelingWith: [],
    title: '',
    description: '',
  });

  const totalSteps = 5;

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.destination.trim()) {
          newErrors.destination = 'Please enter a destination';
        }
        break;
      case 2:
        if (!formData.startDate) {
          newErrors.startDate = 'Please select a start date';
        }
        if (!formData.endDate) {
          newErrors.endDate = 'Please select an end date';
        }
        if (formData.startDate && formData.endDate) {
          const start = new Date(formData.startDate);
          const end = new Date(formData.endDate);
          if (end <= start) {
            newErrors.endDate = 'End date must be after start date';
          }
        }
        break;
      case 3:
        if (formData.interests.length === 0) {
          newErrors.interests = 'Please select at least one interest';
        }
        break;
      case 4:
        if (!formData.difficulty) {
          newErrors.difficulty = 'Please select a difficulty level';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
    if (errors.interests) {
      setErrors((prev) => ({ ...prev, interests: '' }));
    }
  };

  const handleTravelingWithToggle = (item: string) => {
    setFormData((prev) => ({
      ...prev,
      travelingWith: prev.travelingWith.includes(item)
        ? prev.travelingWith.filter((i) => i !== item)
        : [...prev.travelingWith, item],
    }));
  };

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'startDate' && prev.endDate) {
        const start = new Date(value);
        const end = new Date(prev.endDate);
        if (end > start) {
          const diffTime = Math.abs(end.getTime() - start.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          updated.duration = diffDays;
        }
      } else if (field === 'endDate' && prev.startDate) {
        const start = new Date(prev.startDate);
        const end = new Date(value);
        if (end > start) {
          const diffTime = Math.abs(end.getTime() - start.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          updated.duration = diffDays;
        }
      }
      return updated;
    });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }

    // Validate all required fields
    if (!formData.destination || !formData.startDate || !formData.endDate || 
        formData.interests.length === 0 || !formData.difficulty) {
      setErrors({ general: 'Please complete all required fields' });
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Call API route to generate itinerary
      const response = await fetch('/api/itineraries/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Check if response is JSON
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        // Response is not JSON, likely a server error
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      if (!response.ok) {
        // Handle specific error cases
        if (data.upgradeRequired) {
          setError('You\'ve reached the free plan limit of 3 itineraries. Upgrade to Premium for unlimited itineraries.');
          setIsSubmitting(false);
          // Optionally redirect to pricing after a delay
          setTimeout(() => {
            if (confirm('Would you like to upgrade to Premium?')) {
              router.push('/pricing');
            }
          }, 100);
          return;
        }
        throw new Error(data.error || `Failed to generate itinerary: ${response.status} ${response.statusText}`);
      }

      // Validate response data
      if (!data || !data.itinerary) {
        throw new Error('Invalid response from server');
      }

      // Redirect to the new itinerary page
      if (data.itinerary.id) {
        router.push(`/itinerary/${data.itinerary.id}`);
      } else {
        // Fallback to dashboard if no ID
        router.push('/dashboard');
      }
    } catch (error: any) {
      console.error('Error creating itinerary:', error);
      setError(error.message || 'Failed to create itinerary. Please check your connection and try again.');
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: keyof ItineraryFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-forest">
            Step {currentStep} of {totalSteps}
          </h2>
          <span className="text-sm text-forest/60">
            {Math.round((currentStep / totalSteps) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-sage-light/30 rounded-full h-2">
          <div
            className="bg-forest h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: Destination */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-forest mb-2">
              Where are you going?
            </h3>
            <p className="text-forest/70 mb-6">
              Choose a national park, city, or any destination to get started
            </p>
          </div>

          <div>
            <label
              htmlFor="destination"
              className="block text-sm font-semibold text-forest mb-2"
            >
              Destination <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="destination"
              value={formData.destination}
              onChange={(e) => updateFormData('destination', e.target.value)}
              placeholder="e.g., Yosemite National Park, Paris, France, Grand Canyon"
              className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-sky focus:border-sky text-forest placeholder-forest/40 transition-colors ${
                errors.destination ? 'border-red-300' : 'border-sage/30'
              }`}
              required
            />
            {errors.destination && (
              <p className="mt-1 text-sm text-red-600">{errors.destination}</p>
            )}
            <p className="mt-2 text-sm text-forest/60">
              💡 Tip: Be specific! Include the city, state, or country for better recommendations.
            </p>
          </div>

          <div>
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-forest mb-2"
            >
              Trip Title (optional)
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => updateFormData('title', e.target.value)}
              placeholder="e.g., Summer Adventure in Yosemite"
              className="w-full px-4 py-3 border-2 border-sage/30 rounded-lg focus:ring-2 focus:ring-sky focus:border-sky text-forest placeholder-forest/40 transition-colors"
            />
            <p className="mt-2 text-sm text-forest/60">
              Give your trip a memorable name
            </p>
          </div>
        </div>
      )}

      {/* Step 2: Travel Dates */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-forest mb-2">
              When are you traveling?
            </h3>
            <p className="text-forest/70 mb-6">
              Select your travel dates to help us plan your itinerary
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-semibold text-forest mb-2"
              >
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="startDate"
                value={formData.startDate}
                onChange={(e) => handleDateChange('startDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-sky focus:border-sky text-forest transition-colors ${
                  errors.startDate ? 'border-red-300' : 'border-sage/30'
                }`}
                required
              />
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-semibold text-forest mb-2"
              >
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="endDate"
                value={formData.endDate}
                onChange={(e) => handleDateChange('endDate', e.target.value)}
                min={formData.startDate || new Date().toISOString().split('T')[0]}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-sky focus:border-sky text-forest transition-colors ${
                  errors.endDate ? 'border-red-300' : 'border-sage/30'
                }`}
                required
              />
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
              )}
            </div>
          </div>

          {formData.duration && (
            <div className="bg-sage-light/30 rounded-lg p-4">
              <p className="text-sm text-forest/80">
                <strong>Duration:</strong> {formData.duration} {formData.duration === 1 ? 'day' : 'days'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Interests and Activities */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-forest mb-2">
              What are you interested in?
            </h3>
            <p className="text-forest/70 mb-6">
              Select all activities and interests that apply (select at least one)
            </p>
          </div>

          <div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {INTERESTS.map((interest) => (
                <label
                  key={interest}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.interests.includes(interest)
                      ? 'border-forest bg-forest/10'
                      : 'border-sage/30 hover:border-sage/50'
                  } ${errors.interests ? 'border-red-300' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={formData.interests.includes(interest)}
                    onChange={() => handleInterestToggle(interest)}
                    className="sr-only"
                  />
                  <span className={`flex-1 text-sm font-medium ${
                    formData.interests.includes(interest) ? 'text-forest' : 'text-forest/70'
                  }`}>
                    {interest}
                  </span>
                  {formData.interests.includes(interest) && (
                    <svg
                      className="h-5 w-5 text-forest ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </label>
              ))}
            </div>
            {errors.interests && (
              <p className="mt-2 text-sm text-red-600">{errors.interests}</p>
            )}
          </div>
        </div>
      )}

      {/* Step 4: Difficulty Level */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-forest mb-2">
              What's your activity level?
            </h3>
            <p className="text-forest/70 mb-6">
              Help us tailor the itinerary to your preferred pace and difficulty
            </p>
          </div>

          <div className="space-y-3">
            {DIFFICULTY_LEVELS.map((level) => (
              <label
                key={level.value}
                className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.difficulty === level.value
                    ? 'border-forest bg-forest/10'
                    : 'border-sage/30 hover:border-sage/50'
                } ${errors.difficulty ? 'border-red-300' : ''}`}
              >
                <input
                  type="radio"
                  name="difficulty"
                  value={level.value}
                  checked={formData.difficulty === level.value}
                  onChange={(e) => updateFormData('difficulty', e.target.value)}
                  className="mt-1 mr-3 h-4 w-4 text-forest focus:ring-forest"
                />
                <div className="flex-1">
                  <div className="font-semibold text-forest">{level.label}</div>
                  <div className="text-sm text-forest/70 mt-1">{level.description}</div>
                </div>
              </label>
            ))}
          </div>
          {errors.difficulty && (
            <p className="text-sm text-red-600">{errors.difficulty}</p>
          )}
        </div>
      )}

      {/* Step 5: Budget and Group Details */}
      {currentStep === 5 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-forest mb-2">
              Tell us about your group
            </h3>
            <p className="text-forest/70 mb-6">
              Optional details to help us customize your experience
            </p>
          </div>

          <div>
            <label
              htmlFor="groupSize"
              className="block text-sm font-semibold text-forest mb-2"
            >
              Group Size
            </label>
            <select
              id="groupSize"
              value={formData.groupSize}
              onChange={(e) => updateFormData('groupSize', e.target.value)}
              className="w-full px-4 py-3 border-2 border-sage/30 rounded-lg focus:ring-2 focus:ring-sky focus:border-sky text-forest transition-colors"
            >
              <option value="">Select group size...</option>
              {GROUP_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-forest mb-2">
              Traveling With (select all that apply)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {TRAVELING_WITH.map((item) => (
                <label
                  key={item}
                  className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.travelingWith.includes(item)
                      ? 'border-forest bg-forest/10'
                      : 'border-sage/30 hover:border-sage/50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.travelingWith.includes(item)}
                    onChange={() => handleTravelingWithToggle(item)}
                    className="sr-only"
                  />
                  <span className={`flex-1 text-sm font-medium text-center ${
                    formData.travelingWith.includes(item) ? 'text-forest' : 'text-forest/70'
                  }`}>
                    {item}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-forest mb-2">
              Budget Range (optional)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {BUDGET_RANGES.map((range) => (
                <label
                  key={range.value}
                  className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.budgetRange === range.value
                      ? 'border-forest bg-forest/10'
                      : 'border-sage/30 hover:border-sage/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="budgetRange"
                    value={range.value}
                    checked={formData.budgetRange === range.value}
                    onChange={(e) => updateFormData('budgetRange', e.target.value)}
                    className="mt-1 mr-3 h-4 w-4 text-forest focus:ring-forest"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-forest">{range.label}</div>
                    <div className="text-sm text-forest/70 mt-1">{range.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="budget"
              className="block text-sm font-semibold text-forest mb-2"
            >
              Specific Budget Amount (optional)
            </label>
            <input
              type="number"
              id="budget"
              value={formData.budget}
              onChange={(e) => updateFormData('budget', e.target.value)}
              placeholder="e.g., 5000"
              min="0"
              step="0.01"
              className="w-full px-4 py-3 border-2 border-sage/30 rounded-lg focus:ring-2 focus:ring-sky focus:border-sky text-forest placeholder-forest/40 transition-colors"
            />
            <p className="mt-2 text-sm text-forest/60">
              Enter your total trip budget in USD (optional)
            </p>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-forest mb-2"
            >
              Additional Notes (optional)
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateFormData('description', e.target.value)}
              rows={4}
              placeholder="Any special requirements, dietary restrictions, accessibility needs, or other preferences..."
              className="w-full px-4 py-3 border-2 border-sage/30 rounded-lg focus:ring-2 focus:ring-sky focus:border-sky text-forest placeholder-forest/40 transition-colors resize-none"
            />
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg">
          <div className="flex items-center">
            <svg
              className="h-5 w-5 mr-2 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="font-semibold">Error</p>
          </div>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      )}

      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
            <div className="mb-4">
              <svg
                className="animate-spin h-12 w-12 text-forest mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-forest mb-2">
              Planning Your Adventure...
            </h3>
            <p className="text-forest/70">
              Our AI is crafting a personalized itinerary just for you. This may take a moment.
            </p>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t border-sage/20">
        <button
          type="button"
          onClick={handleBack}
          disabled={currentStep === 1 || isSubmitting}
          className={`px-6 py-3 border-2 rounded-lg font-medium transition-colors ${
            currentStep === 1 || isSubmitting
              ? 'border-sage/20 text-forest/30 cursor-not-allowed'
              : 'border-sage/50 text-forest bg-white hover:bg-sage/10'
          }`}
        >
          ← Back
        </button>

        {currentStep < totalSteps ? (
          <button
            type="button"
            onClick={handleNext}
            disabled={isSubmitting}
            className="px-6 py-3 border-2 border-transparent rounded-lg text-offwhite bg-forest hover:bg-forest-light transition-all shadow-md hover:shadow-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-8 py-3 border-2 border-transparent rounded-lg text-offwhite font-semibold transition-all shadow-md hover:shadow-lg ${
              isSubmitting
                ? 'bg-forest/50 cursor-not-allowed'
                : 'bg-forest hover:bg-forest-light'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Creating Itinerary...
              </span>
            ) : (
              'Create Itinerary'
            )}
          </button>
        )}
      </div>
    </form>
  );
}

