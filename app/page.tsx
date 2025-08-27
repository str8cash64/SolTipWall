import {
  Hero,
  TrustBar,
  StatsStrip,
  HowItWorks,
  CreatorsShowcase,
  LeaderboardTabs,
  FeesAndPremium,
  FAQ,
  MobileStickyCTA
} from '@/components/marketing'

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <TrustBar />
      <StatsStrip />
      <HowItWorks />
      <CreatorsShowcase />
      <LeaderboardTabs />
      <FeesAndPremium />
      <FAQ />
      <MobileStickyCTA />
    </div>
  )
}
