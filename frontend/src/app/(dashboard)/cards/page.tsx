"use client";

import { useState } from "react";
import { 
  CreditCard, Search, Lock, Unlock, ShieldAlert, 
  Globe, Smartphone, ShoppingCart, Sliders, KeyRound, Save
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CardDetail {
  _id: string;
  cardNumber: string;
  accountNumber: string;
  cardHolderName: string;
  cardType: "Debit" | "Credit";
  cardNetwork: "Visa" | "MasterCard" | "RuPay";
  expiryDate: string;
  cvv: string;
  status: "Active" | "Inactive" | "Blocked";
  dailyLimit: number;
  isInternational?: boolean;
  isOnline?: boolean;
  isContactless?: boolean;
  pin?: string;
}

export default function CardsListPage() {
  const [accountNumber, setAccountNumber] = useState("");
  const [cards, setCards] = useState<CardDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  
  // Selected Card for inspector controls
  const [selectedCard, setSelectedCard] = useState<CardDetail | null>(null);
  
  // Control States for editing
  const [status, setStatus] = useState<"Active" | "Inactive" | "Blocked">("Active");
  const [dailyLimit, setDailyLimit] = useState(50000);
  const [isInternational, setIsInternational] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isContactless, setIsContactless] = useState(false);
  const [pin, setPin] = useState("1234");
  const [savingControls, setSavingControls] = useState(false);

  const fetchCards = async () => {
    if (!accountNumber) {
      alert("Please enter an account number.");
      return;
    }
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`http://localhost:5000/api/cards/account/${accountNumber}`);
      const data = await res.json();
      if (data.success) {
        setCards(data.data);
        if (data.data.length > 0) {
          const firstCard = data.data[0];
          setSelectedCard(firstCard);
          setStatus(firstCard.status);
          setDailyLimit(firstCard.dailyLimit || 50000);
          setIsInternational(firstCard.isInternational ?? false);
          setIsOnline(firstCard.isOnline ?? true);
          setIsContactless(firstCard.isContactless ?? false);
          setPin(firstCard.pin ?? "1234");
        } else {
          setSelectedCard(null);
        }
      }
    } catch (err) {
      console.error("Failed to fetch cards", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (card: CardDetail) => {
    setSelectedCard(card);
    setStatus(card.status);
    setDailyLimit(card.dailyLimit || 50000);
    setIsInternational(card.isInternational ?? false);
    setIsOnline(card.isOnline ?? true);
    setIsContactless(card.isContactless ?? false);
    setPin(card.pin ?? "1234");
  };

  const saveCardControls = async () => {
    if (!selectedCard) return;
    setSavingControls(true);
    try {
      const res = await fetch(`http://localhost:5000/api/cards/${selectedCard._id}/controls`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          dailyLimit,
          isInternational,
          isOnline,
          isContactless,
          pin
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("Card security controls saved successfully!");
        // Update local cards state
        const updatedCards = cards.map(c => {
          if (c._id === selectedCard._id) {
            return {
              ...c,
              status,
              dailyLimit,
              isInternational,
              isOnline,
              isContactless,
              pin
            };
          }
          return c;
        });
        setCards(updatedCards);
      }
    } catch (err) {
      console.error("Failed to update card controls", err);
    } finally {
      setSavingControls(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)] flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-cyan-400" /> Card Command Center
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Query issued cards and manage advanced operational transaction permissions.</p>
        </div>
      </div>

      {/* Account Number Lookup Input Box */}
      <div className="border border-slate-800 bg-slate-950/60 rounded-3xl p-6 backdrop-blur-md relative overflow-hidden max-w-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest mb-3">Retrieve Account Cards</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              placeholder="Enter Account Number (e.g. 1000284719)"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="pl-10 bg-slate-900/60 border-slate-700 text-cyan-400 placeholder:text-slate-600 focus-visible:border-cyan-500 focus-visible:ring-cyan-500/20"
            />
          </div>
          <Button 
            onClick={fetchCards} 
            disabled={loading}
            className="bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-bold"
          >
            {loading ? "Searching..." : "Fetch Card Data"}
          </Button>
        </div>
      </div>

      {searched && cards.length === 0 && !loading && (
        <div className="py-16 text-center border border-slate-800 rounded-3xl bg-slate-950/20 max-w-2xl">
          <CreditCard className="w-12 h-12 mx-auto text-slate-700 mb-4 animate-bounce" />
          <p className="text-slate-400 font-medium font-mono">NO ACTIVE CARDS FOUND FOR ACCOUNT: {accountNumber}</p>
        </div>
      )}

      {cards.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Card list and digital card visual (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* List Selector Tabs */}
            <div className="flex gap-3 overflow-x-auto pb-1.5">
              {cards.map((c, idx) => (
                <button
                  key={c._id}
                  onClick={() => handleCardClick(c)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold border transition-all shrink-0 ${
                    selectedCard?._id === c._id
                      ? "bg-cyan-500/10 border-cyan-500 text-cyan-300"
                      : "border-slate-850 bg-slate-900/30 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  {c.cardType} Card ({idx + 1}) - **** {c.cardNumber.slice(-4)}
                </button>
              ))}
            </div>

            {selectedCard && (
              <div className="space-y-6">
                {/* Premium Big Card Box */}
                <div className={`relative w-full max-w-md aspect-[1.586/1] rounded-[24px] p-8 overflow-hidden text-slate-100 flex flex-col justify-between border shadow-2xl transition-all duration-500 bg-gradient-to-br ${
                  selectedCard.cardType === "Credit"
                    ? "from-slate-950 via-slate-900 to-slate-950 border-slate-800 shadow-[0_15px_35px_rgba(0,0,0,0.4)]"
                    : "from-cyan-950 via-slate-900 to-indigo-950 border-cyan-800/40 shadow-[0_15px_35px_rgba(6,182,212,0.15)]"
                }`}>
                  {/* Decorative card micro-elements */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-cyan-400/5 to-transparent rounded-full blur-3xl pointer-events-none" />
                  
                  {/* Row 1: Header */}
                  <div className="flex justify-between items-start z-10">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold font-mono">LomaX Central Bank</p>
                      <p className="text-xs text-cyan-400 font-bold font-mono tracking-wider">{selectedCard.cardType} Platinum</p>
                    </div>
                    <span className="font-extrabold text-sm tracking-wider font-mono uppercase bg-slate-900/60 border border-slate-800 px-2 py-0.5 rounded text-slate-300">
                      {selectedCard.cardNetwork}
                    </span>
                  </div>

                  {/* Row 2: Chip and Contactless indicator */}
                  <div className="flex items-center gap-4 z-10 my-1">
                    <div className="w-11 h-9 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-600 border border-amber-300/40 relative shadow-inner overflow-hidden">
                      <div className="absolute inset-y-0 left-3 w-[1px] bg-amber-950/20" />
                      <div className="absolute inset-y-0 left-6.5 w-[1px] bg-amber-950/20" />
                      <div className="absolute inset-x-0 top-3 h-[1px] bg-amber-950/20" />
                      <div className="absolute inset-x-0 top-6 h-[1px] bg-amber-950/20" />
                    </div>
                    {isContactless && (
                      <Smartphone className="w-4 h-4 text-cyan-400 animate-pulse rotate-90" />
                    )}
                  </div>

                  {/* Row 3: Card Number */}
                  <div className="font-mono text-xl md:text-2xl tracking-[0.2em] z-10 text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] my-2">
                    {selectedCard.cardNumber.replace(/(\d{4})/g, "$1 ").trim()}
                  </div>

                  {/* Row 4: Cardholder Name & Expiry */}
                  <div className="flex justify-between items-end z-10 font-mono">
                    <div>
                      <span className="text-[8px] text-slate-500 block uppercase font-bold">CARD HOLDER</span>
                      <span className="text-xs font-bold text-slate-200 tracking-wide uppercase">{selectedCard.cardHolderName}</span>
                    </div>
                    <div className="flex gap-4">
                      <div>
                        <span className="text-[8px] text-slate-500 block uppercase font-bold">EXPIRES</span>
                        <span className="text-xs font-bold text-slate-200">{selectedCard.expiryDate}</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-500 block uppercase font-bold">CVV</span>
                        <span className="text-xs font-bold text-slate-200">***</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-2xl font-mono text-xs space-y-2.5 max-w-md">
                  <div className="flex justify-between">
                    <span className="text-slate-500">CONNECTED A/C:</span>
                    <span className="text-slate-300 font-bold">{selectedCard.accountNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">DAILY SPENDING LIMIT:</span>
                    <span className="text-cyan-400 font-bold">₹{dailyLimit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">CURRENT STATUS:</span>
                    <span className={`px-2 py-0.5 rounded font-bold ${
                      status === "Active" ? "bg-emerald-950/60 text-emerald-400 border border-emerald-900/30" : "bg-rose-950/60 text-rose-400 border border-rose-900/30"
                    }`}>{status}</span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Card Control Matrix (lg:col-span-5) */}
          <div className="lg:col-span-5">
            {selectedCard && (
              <div className="border border-slate-800 bg-slate-950/60 p-6 rounded-3xl backdrop-blur-md space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
                
                <div className="space-y-0.5 border-b border-slate-900 pb-3">
                  <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-cyan-400" /> Security Matrix
                  </h2>
                  <p className="text-xs text-slate-400">Configure status limits and regional permissions.</p>
                </div>

                {/* Control Toggles */}
                <div className="space-y-4 font-mono text-xs">
                  {/* Status Toggle */}
                  <div className="flex justify-between items-center bg-slate-900/30 border border-slate-850/60 p-3 rounded-xl">
                    <div className="space-y-0.5">
                      <span className="text-slate-200 font-bold flex items-center gap-1.5">
                        {status === "Active" ? <Unlock className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3.5 h-3.5 text-rose-400" />}
                        Card Authorization
                      </span>
                      <p className="text-[10px] text-slate-500">Temporarily freeze or unfreeze this card</p>
                    </div>
                    <button 
                      onClick={() => setStatus(status === "Active" ? "Blocked" : "Active")}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none ${status === "Active" ? "bg-emerald-500" : "bg-slate-800"}`}
                    >
                      <div className={`w-4 h-4 bg-slate-950 rounded-full transition-transform ${status === "Active" ? "translate-x-4" : "translate-x-0"}`} />
                    </button>
                  </div>

                  {/* Online Transactions */}
                  <div className="flex justify-between items-center bg-slate-900/30 border border-slate-850/60 p-3 rounded-xl">
                    <div className="space-y-0.5">
                      <span className="text-slate-200 font-bold flex items-center gap-1.5">
                        <ShoppingCart className="w-3.5 h-3.5 text-cyan-400" /> Online Payments
                      </span>
                      <p className="text-[10px] text-slate-500">Authorize card for e-commerce checkouts</p>
                    </div>
                    <button 
                      onClick={() => setIsOnline(!isOnline)}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none ${isOnline ? "bg-cyan-500" : "bg-slate-800"}`}
                    >
                      <div className={`w-4 h-4 bg-slate-950 rounded-full transition-transform ${isOnline ? "translate-x-4" : "translate-x-0"}`} />
                    </button>
                  </div>

                  {/* International Operations */}
                  <div className="flex justify-between items-center bg-slate-900/30 border border-slate-850/60 p-3 rounded-xl">
                    <div className="space-y-0.5">
                      <span className="text-slate-200 font-bold flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-indigo-400" /> Cross-Border Routing
                      </span>
                      <p className="text-[10px] text-slate-500">Allow payments outside home Indian network</p>
                    </div>
                    <button 
                      onClick={() => setIsInternational(!isInternational)}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none ${isInternational ? "bg-indigo-500" : "bg-slate-800"}`}
                    >
                      <div className={`w-4 h-4 bg-slate-950 rounded-full transition-transform ${isInternational ? "translate-x-4" : "translate-x-0"}`} />
                    </button>
                  </div>

                  {/* Contactless payments */}
                  <div className="flex justify-between items-center bg-slate-900/30 border border-slate-850/60 p-3 rounded-xl">
                    <div className="space-y-0.5">
                      <span className="text-slate-200 font-bold flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-teal-400" /> Contactless NFC
                      </span>
                      <p className="text-[10px] text-slate-500">Tap to pay with mobile and POS devices</p>
                    </div>
                    <button 
                      onClick={() => setIsContactless(!isContactless)}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none ${isContactless ? "bg-teal-500" : "bg-slate-800"}`}
                    >
                      <div className={`w-4 h-4 bg-slate-950 rounded-full transition-transform ${isContactless ? "translate-x-4" : "translate-x-0"}`} />
                    </button>
                  </div>
                </div>

                {/* Adjust Daily limit slider */}
                <div className="space-y-2 bg-slate-900/30 border border-slate-850/60 p-4 rounded-xl font-mono">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-bold">DAILY LEDGER LIMIT:</span>
                    <span className="text-cyan-400 font-bold">₹{dailyLimit.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" 
                    min="5000" 
                    max="500000" 
                    step="5000"
                    value={dailyLimit} 
                    onChange={(e) => setDailyLimit(Number(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400" 
                  />
                  <div className="flex justify-between text-[9px] text-slate-500">
                    <span>₹5,000</span>
                    <span>₹500,000</span>
                  </div>
                </div>

                {/* Reset PIN box */}
                <div className="space-y-2.5 bg-slate-900/30 border border-slate-850/60 p-4 rounded-xl font-mono text-xs">
                  <span className="text-slate-200 font-bold flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-cyan-400" /> Change PIN Code
                  </span>
                  <div className="flex gap-2">
                    <Input
                      type="password"
                      maxLength={4}
                      placeholder="Enter new 4-digit PIN"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      className="bg-slate-950/50 border-slate-800 text-slate-200 font-bold tracking-widest text-center"
                    />
                  </div>
                </div>

                <Button 
                  onClick={saveCardControls} 
                  disabled={savingControls}
                  className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold gap-2"
                >
                  <Save className="w-4 h-4" /> Save Security Matrix
                </Button>

              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
