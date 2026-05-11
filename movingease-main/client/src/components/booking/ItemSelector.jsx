import { useMemo, useState } from "react";
import { ITEM_CATALOG } from "../../utils/itemCatalog";
import Card from "../common/Card";
import QuantityControl from "./QuantityControl";
import Button from "../common/Button";

export default function ItemSelector({ selectedItems, onChange }) {
  const [customItem, setCustomItem] = useState({ label: "", volumeScore: "", weightScore: "", quantity: 1 });

  const itemMap = useMemo(() => Object.fromEntries(selectedItems.map((item) => [item.itemKey, item])), [selectedItems]);

  const updateQuantity = (catalogItem, quantity) => {
    const current = selectedItems.filter((item) => item.itemKey !== catalogItem.key);
    if (quantity <= 0) return onChange(current);

    const next = {
      itemKey: catalogItem.key,
      label: catalogItem.label,
      quantity,
      volumeScore: catalogItem.volumeScore,
      weightScore: catalogItem.weightScore,
      isFragile: Boolean(catalogItem.isFragile),
      isHeavy: Boolean(catalogItem.isHeavy)
    };
    onChange([...current, next]);
  };

  const addCustomItem = () => {
    const volumeScore = Number(customItem.volumeScore);
    const weightScore = Number(customItem.weightScore);
    if (!customItem.label || volumeScore <= 0 || weightScore <= 0) return;

    const next = selectedItems.filter((item) => item.itemKey !== "custom_item");
    next.push({
      itemKey: "custom_item",
      label: customItem.label,
      quantity: Number(customItem.quantity || 1),
      volumeScore,
      weightScore,
      isFragile: false,
      isHeavy: weightScore >= 5
    });
    onChange(next);
    setCustomItem({ label: "", volumeScore: "", weightScore: "", quantity: 1 });
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <p className="text-sm font-semibold text-[#1B2A4A]">Select your items</p>
        <div className="mt-4 grid gap-3">
          {ITEM_CATALOG.map((item) => (
            <div key={item.key} className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
              <div>
                <p className="font-semibold text-[#1B2A4A]">{item.label}</p>
                <p className="text-xs text-slate-500">Volume {item.volumeScore} | Weight {item.weightScore}{item.isFragile ? " | Fragile" : ""}{item.isHeavy ? " | Heavy" : ""}</p>
              </div>
              <QuantityControl value={Number(itemMap[item.key]?.quantity || 0)} onChange={(value) => updateQuantity(item, value)} />
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <p className="text-sm font-semibold text-[#1B2A4A]">Custom item</p>
        <div className="mt-3 grid gap-3 md:grid-cols-4">
          <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Item name" value={customItem.label} onChange={(e) => setCustomItem({ ...customItem, label: e.target.value })} />
          <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" type="number" min="0" step="0.5" placeholder="Volume score" value={customItem.volumeScore} onChange={(e) => setCustomItem({ ...customItem, volumeScore: e.target.value })} />
          <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" type="number" min="0" step="0.5" placeholder="Weight score" value={customItem.weightScore} onChange={(e) => setCustomItem({ ...customItem, weightScore: e.target.value })} />
          <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" type="number" min="1" placeholder="Qty" value={customItem.quantity} onChange={(e) => setCustomItem({ ...customItem, quantity: e.target.value })} />
        </div>
        <Button type="button" className="mt-3" onClick={addCustomItem}>Add custom item</Button>
      </Card>
    </div>
  );
}
