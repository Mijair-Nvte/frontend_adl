const pastelColors = [
  '#FBCFE8', // pink
  '#DDD6FE', // purple
  '#BFDBFE', // blue
  '#BBF7D0', // green
  '#FEF9C3', // yellow
  '#FDE68A', // amber
  '#FCA5A5', // red
  '#A5F3FC', // cyan
  '#C4B5FD', // violet
  '#FDBA74', // orange
];

export function getColorFromString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % pastelColors.length;
  return pastelColors[index];
}
