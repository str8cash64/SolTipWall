'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  Zap, 
  Shield, 
  BarChart3, 
  Star,
  CheckCircle,
  TrendingUp
} from 'lucide-react';
import { formatSol } from '@/lib/fees';
import { useToast } from '@/components/ui/use-toast';

interface PremiumUpsellProps {
  currentEarnings?: number;
}

export function PremiumUpsell({ currentEarnings = 8.75 }: PremiumUpsellProps) {
  const { toast } = useToast();

  // Calculate potential savings
  const monthlyTips = currentEarnings * 4; // Rough monthly estimate
  const currentFees = monthlyTips * 0.05; // Average 5% fee
  const premiumSavings = currentFees; // 0% fees with premium
  const breakEvenPoint = 10; // $10/month premium cost
  const roiMonths = breakEvenPoint / (premiumSavings * 100); // Convert SOL to USD estimate

  const handleUpgrade = () => {
    // TODO: Implement premium upgrade flow
    toast({
      title: "Redirecting to premium upgrade",
      description: "Taking you to the premium subscription page...",
    });
  };

  const features = [
    {
      icon: <Zap className="h-5 w-5" />,
      title: "0% Platform Fees",
      description: "Keep 100% of your tips - no platform fees on any amount"
    },
    {
      icon: <Crown className="h-5 w-5" />,
      title: "Premium Badge",
      description: "Stand out with a premium badge on your profile"
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Priority Support",
      description: "Get faster response times for support requests"
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      title: "Advanced Analytics",
      description: "Detailed insights, export options, and performance metrics"
    },
    {
      icon: <Star className="h-5 w-5" />,
      title: "Early Access",
      description: "Be first to try new features and tools"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden"
    >
      <Card className="border-2 border-gradient-to-r from-yellow-400 to-yellow-600 bg-gradient-to-br from-yellow-50 via-white to-orange-50 dark:from-yellow-950/20 dark:via-background dark:to-orange-950/20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-yellow-400/10 to-orange-500/10 rounded-full translate-y-12 -translate-x-12" />
        
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Crown className="h-6 w-6 text-yellow-600" />
              <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                TipWall Premium
              </span>
            </CardTitle>
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
              <Star className="h-3 w-3 mr-1" />
              Popular
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Maximize your earnings and unlock premium features
          </p>
        </CardHeader>

        <CardContent className="relative space-y-6">
          {/* ROI Calculation */}
          <div className="p-4 bg-white/50 dark:bg-background/50 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <span className="font-semibold text-emerald-600">Your Potential Savings</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Current monthly fees:</div>
                <div className="font-bold text-red-600">-{formatSol(currentFees)}</div>
              </div>
              <div>
                <div className="text-muted-foreground">With Premium:</div>
                <div className="font-bold text-emerald-600">{formatSol(0)} fees</div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-yellow-200 dark:border-yellow-800">
              <div className="font-semibold text-emerald-600">
                Monthly savings: {formatSol(premiumSavings)}
              </div>
              {roiMonths < 12 && (
                <div className="text-xs text-muted-foreground">
                  Pays for itself in ~{Math.ceil(roiMonths)} months
                </div>
              )}
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid gap-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-white/30 dark:bg-background/30"
              >
                <div className="text-yellow-600 mt-0.5">
                  {feature.icon}
                </div>
                <div>
                  <div className="font-medium text-sm">{feature.title}</div>
                  <div className="text-xs text-muted-foreground">{feature.description}</div>
                </div>
                <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 ml-auto flex-shrink-0" />
              </motion.div>
            ))}
          </div>

          {/* Pricing */}
          <div className="space-y-3">
            <div className="text-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                $10-$50/month
              </div>
              <div className="text-sm text-muted-foreground">
                Based on your tip volume
              </div>
            </div>

            <Button 
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
              size="lg"
            >
              <Crown className="h-4 w-4 mr-2" />
              Become Premium
            </Button>

            <div className="text-center text-xs text-muted-foreground">
              Cancel anytime • 7-day money-back guarantee
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
