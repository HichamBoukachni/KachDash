export function calcRR(entry, stop, take, side) {
  if (!entry || !stop || !take) return null;
  const risk = Math.abs(entry - stop);
  const reward = Math.abs(take - entry);
  return parseFloat((reward / risk).toFixed(2));
}

export function calcPips(entry, exit, side) {
  if (!entry || !exit) return 0;
  const pips = (exit - entry) * 10000;
  return side === "sell" || side === "short" ? -pips : pips;
}
