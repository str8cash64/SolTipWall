'use client';
import OnboardingForm from './OnboardingForm';

// For now, settings form is the same as onboarding form
// In the future, this could have additional features like:
// - Account deletion
// - Export data
// - Advanced privacy settings
// - Integration settings

export default function SettingsForm({ initial }: any) {
  return <OnboardingForm initial={initial} />;
}
