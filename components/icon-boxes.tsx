import {
  Headset,
  PhilippinePeso,
  ShoppingBag,
  WalletCards,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";

const IconBoxes = () => {
  return (
    <div>
      <Card>
        <CardContent className="grid md:grid-cols-4 gap-4 p-4 place-content-center">
          <div className="space-y-2">
            <ShoppingBag />
            <div className="text-sm font-bold">Free Shipping</div>
            <div className="text-sm text-muted-foreground">
              Free shipping on order above ₱200
            </div>
          </div>
          <div className="space-y-2">
            <PhilippinePeso />
            <div className="text-sm font-bold">Money Back Guarantee</div>
            <div className="text-sm text-muted-foreground">
              Within 30 days of purchase
            </div>
          </div>
          <div className="space-y-2">
            <WalletCards />
            <div className="text-sm font-bold">Flexible Payments</div>
            <div className="text-sm text-muted-foreground">
              Pay with Credit Cards, Paypal, or COD
            </div>
          </div>
          <div className="space-y-2">
            <Headset />
            <div className="text-sm font-bold">24/7 Support</div>
            <div className="text-sm text-muted-foreground">
              Get support at any time
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IconBoxes;
